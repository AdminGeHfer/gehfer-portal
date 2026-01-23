import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { RncDepartmentEnum, RncTypeEnum } from '@/types/rnc';

export interface TypeQualityStats {
  type: RncTypeEnum | null;
  count: number | null;
}

export interface DepartmentQualityStats {
  department: RncDepartmentEnum | null;
  count: number | null;
}

export interface ResponsibleQualityStats {
  responsible: string | null;
  count: number | null;
}

export interface CompanyQualityStats {
  company: string | null;
  count: number | null;
}

export interface ResolutionTimeStats {
  rnc_number: number | null;
  company: string | null;
  responsible: string | null;
  department: string | null;
  created_at: string | null;
  closed_at: string | null;
  duration_hours: number | null;
  duration_days: number | null;
}

export interface ResolutionSeriesPoint {
  bucket_date: string;
  avg_hours: number;
  p50_hours: number;
  p90_hours: number;
  qtd: number;
}

export interface ResolutionTopItem {
  rnc_number: number | null;
  company: string | null;
  responsible: string | null;
  department: string | null;
  created_at: string | null;
  closed_at: string | null;
  duration_hours: number | null;
}

export interface ResolutionKpis {
  avg_hours: number;
  p50_hours: number;
  p90_hours: number;
  min_hours: number;
  max_hours: number;
  qtd: number;
}

interface DashboardStats {
  totalRNCs: number;
  totalMonthlyRNCs: number;
  pendingRNCs: number;
  pendingMonthlyRNCs: number;
  canceledRNCs: number;
  canceledMonthlyRNCs: number;
  collectedRNCs: number;
  collectedMonthlyRNCs: number;
  concludedRNCs: number;
  concludedMonthlyRNCs: number;
  typeStats: TypeQualityStats[];
  departmentStats: DepartmentQualityStats[];
  responsibleStats: ResponsibleQualityStats[];
  companyStats: CompanyQualityStats[];
  resolutionTime: ResolutionTimeStats[];
  resolutionSeries: ResolutionSeriesPoint[];
  resolutionTopSlow: ResolutionTopItem[];
  resolutionTopFast: ResolutionTopItem[];
  resolutionKpis: ResolutionKpis | null;
}

type GroupGranularity = 'day' | 'month';

function dateKey(d: Date, group: GroupGranularity): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return group === 'day' ? `${y}-${m}-${day}` : `${y}-${m}-01`;
}

function percentile(arr: number[], p: number): number {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  const w = idx - lo;
  return sorted[lo] * (1 - w) + sorted[hi] * w;
}

function buildSeries(rows: ResolutionTimeStats[], group: GroupGranularity): ResolutionSeriesPoint[] {
  const buckets = new Map<string, number[]>();
  for (const r of rows) {
    if (!r.closed_at || r.duration_hours == null) continue;
    const d = new Date(r.closed_at);
    const key = dateKey(d, group);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(r.duration_hours);
  }
  const out: ResolutionSeriesPoint[] = [];
  for (const [key, vals] of Array.from(buckets.entries()).sort((a, b) => a[0].localeCompare(b[0]))) {
    const avg = vals.reduce((s, v) => s + v, 0) / vals.length || 0;
    out.push({
      bucket_date: key,
      avg_hours: Number(avg.toFixed(1)),
      p50_hours: Number(percentile(vals, 0.5).toFixed(1)),
      p90_hours: Number(percentile(vals, 0.9).toFixed(1)),
      qtd: vals.length,
    });
  }
  return out;
}

function buildKpis(rows: ResolutionTimeStats[]): ResolutionKpis | null {
  const vals = rows.map(r => r.duration_hours ?? 0).filter(v => v >= 0);
  if (!vals.length) return null;
  const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
  return {
    avg_hours: Number(avg.toFixed(1)),
    p50_hours: Number(percentile(vals, 0.5).toFixed(1)),
    p90_hours: Number(percentile(vals, 0.9).toFixed(1)),
    min_hours: Math.min(...vals),
    max_hours: Math.max(...vals),
    qtd: vals.length,
  };
}

type RncChartRow = {
  type: RncTypeEnum | null;
  department: RncDepartmentEnum | null;
  responsible: string | null;
  company: string | null;
};

function buildTypeStats(rows: RncChartRow[]): TypeQualityStats[] {
  const counts = new Map<RncTypeEnum, number>();
  let nullCount = 0;
  for (const row of rows) {
    if (!row.type) {
      nullCount += 1;
      continue;
    }
    counts.set(row.type, (counts.get(row.type) ?? 0) + 1);
  }
  const out = Array.from(counts.entries()).map(([type, count]) => ({ type, count }));
  if (nullCount > 0) out.push({ type: null, count: nullCount });
  return out;
}

function buildDepartmentStats(rows: RncChartRow[]): DepartmentQualityStats[] {
  const counts = new Map<RncDepartmentEnum, number>();
  let nullCount = 0;
  for (const row of rows) {
    if (!row.department) {
      nullCount += 1;
      continue;
    }
    counts.set(row.department, (counts.get(row.department) ?? 0) + 1);
  }
  const out = Array.from(counts.entries()).map(([department, count]) => ({ department, count }));
  if (nullCount > 0) out.push({ department: null, count: nullCount });
  return out;
}

function buildResponsibleStats(rows: RncChartRow[]): ResponsibleQualityStats[] {
  const counts = new Map<string, number>();
  let nullCount = 0;
  for (const row of rows) {
    if (!row.responsible) {
      nullCount += 1;
      continue;
    }
    counts.set(row.responsible, (counts.get(row.responsible) ?? 0) + 1);
  }
  const out = Array.from(counts.entries()).map(([responsible, count]) => ({ responsible, count }));
  if (nullCount > 0) out.push({ responsible: null, count: nullCount });
  return out;
}

function buildCompanyStats(rows: RncChartRow[]): CompanyQualityStats[] {
  const counts = new Map<string, number>();
  let nullCount = 0;
  for (const row of rows) {
    if (!row.company) {
      nullCount += 1;
      continue;
    }
    counts.set(row.company, (counts.get(row.company) ?? 0) + 1);
  }
  const out = Array.from(counts.entries()).map(([company, count]) => ({ company, count }));
  if (nullCount > 0) out.push({ company: null, count: nullCount });
  return out;
}

export const useDashboardStats = (
  opts?: {
    /** resolution filters; if undefined, current month */
    start?: Date;
    end?: Date;
    group?: GroupGranularity;  // 'day' | 'month'
    topN?: number;
  }
) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const group = opts?.group ?? 'month';
  const topN = opts?.topN ?? 10;

  const hasDateFilter = Boolean(opts?.start && opts?.end);

  const now = new Date();
  const defaultStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
  const defaultEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0));

  const filterStartISO = hasDateFilter ? opts!.start!.toISOString() : undefined;
  const filterEndISO = hasDateFilter ? opts!.end!.toISOString() : undefined;

  const monthStartISO = (hasDateFilter ? opts!.start! : defaultStart).toISOString();
  const monthEndISO = (hasDateFilter ? opts!.end! : defaultEnd).toISOString();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        let totalQuery = supabase
          .from('rncs')
          .select('*', { count: 'exact', head: true })
          .is('deleted_at', null);
        if (hasDateFilter) {
          totalQuery = totalQuery.gte('created_at', filterStartISO!).lt('created_at', filterEndISO!);
        }
        const { count: totalCount } = await totalQuery;

        const { count: totalMonthlyCount } = await supabase
          .from('rncs')
          .select('*', { count: 'exact', head: true })
          .is('deleted_at', null)
          .gte('created_at', monthStartISO)
          .lt('created_at', monthEndISO);

        let pendingQuery = supabase
          .from('rncs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending')
          .is('deleted_at', null);
        if (hasDateFilter) {
          pendingQuery = pendingQuery.gte('created_at', filterStartISO!).lt('created_at', filterEndISO!);
        }
        const { count: pendingCount } = await pendingQuery;

        const { count: pendingMonthlyCount } = await supabase
          .from('rncs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending')
          .is('deleted_at', null)
          .gte('created_at', monthStartISO)
          .lt('created_at', monthEndISO);

        let canceledQuery = supabase
          .from('rncs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'canceled')
          .is('deleted_at', null);
        if (hasDateFilter) {
          canceledQuery = canceledQuery.gte('created_at', filterStartISO!).lt('created_at', filterEndISO!);
        }
        const { count: canceledCount } = await canceledQuery;

        const { count: canceledMonthlyCount } = await supabase
          .from('rncs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'canceled')
          .is('deleted_at', null)
          .gte('created_at', monthStartISO)
          .lt('created_at', monthEndISO);

        let collectedQuery = supabase
          .from('rncs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'collect')
          .is('deleted_at', null);
        if (hasDateFilter) {
          collectedQuery = collectedQuery.gte('created_at', filterStartISO!).lt('created_at', filterEndISO!);
        }
        const { count: collectedCount } = await collectedQuery;

        const { count: collectedMonthlyCount } = await supabase
          .from('rncs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'collect')
          .is('deleted_at', null)
          .gte('created_at', monthStartISO)
          .lt('created_at', monthEndISO);

        let concludedQuery = supabase
          .from('rncs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'concluded')
          .is('deleted_at', null);
        if (hasDateFilter) {
          concludedQuery = concludedQuery.gte('created_at', filterStartISO!).lt('created_at', filterEndISO!);
        }
        const { count: concludedCount } = await concludedQuery;

        const { count: concludedMonthlyCount } = await supabase
          .from('rncs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'concluded')
          .is('deleted_at', null)
          .gte('created_at', monthStartISO)
          .lt('created_at', monthEndISO);

        let typeStats: TypeQualityStats[] | null = null;
        let departmentStats: DepartmentQualityStats[] | null = null;
        let responsibleStats: ResponsibleQualityStats[] | null = null;
        let companyStats: CompanyQualityStats[] | null = null;

        if (hasDateFilter) {
          const { data: rncRows, error: rncErr } = await supabase
            .from('rncs')
            .select('type, department, responsible, company')
            .is('deleted_at', null)
            .gte('created_at', filterStartISO!)
            .lt('created_at', filterEndISO!);

          if (rncErr) throw rncErr;
          const rows = (rncRows ?? []) as RncChartRow[];
          typeStats = buildTypeStats(rows);
          departmentStats = buildDepartmentStats(rows);
          responsibleStats = buildResponsibleStats(rows);
          companyStats = buildCompanyStats(rows);
        } else {
          const { data: typeStatsRaw } = await supabase
            .from('type_quality_dashboard_stats')
            .select('*') as { data: TypeQualityStats[] | null };

          const { data: departmentStatsRaw } = await supabase
            .from('department_quality_dashboard_stats')
            .select('*') as { data: DepartmentQualityStats[] | null };

          const { data: responsibleStatsRaw } = await supabase
            .from('responsible_quality_dashboard_stats')
            .select('*') as { data: ResponsibleQualityStats[] | null };

          const { data: companyStatsRaw } = await supabase
            .from('company_quality_dashboard_stats')
            .select('*') as { data: CompanyQualityStats[] | null };

          typeStats = typeStatsRaw;
          departmentStats = departmentStatsRaw;
          responsibleStats = responsibleStatsRaw;
          companyStats = companyStatsRaw;
        }

        const { data: resolutionRowsRaw, error: resErr } = await supabase
          .from('rnc_resolution_time')
          .select('*')
          .gte('closed_at', monthStartISO)
          .lt('closed_at', monthEndISO);

        if (resErr) throw resErr;

        const resolutionRows: ResolutionTimeStats[] = (resolutionRowsRaw ?? []).map(r => ({
          ...r,
          created_at: r.created_at,
          closed_at: r.closed_at,
        }));

        // client-side analytics
        const resolutionSeries = buildSeries(resolutionRows, group);
        const resolutionKpis = buildKpis(resolutionRows);

        // TOP slow / fast
        const topSorted = [...resolutionRows].sort((a, b) => (b.duration_hours ?? 0) - (a.duration_hours ?? 0));
        const resolutionTopSlow: ResolutionTopItem[] = topSorted.slice(0, topN);

        const topFastSorted = [...resolutionRows]
          .filter(r => (r.duration_hours ?? 0) > 0)
          .sort((a, b) => (a.duration_hours ?? 0) - (b.duration_hours ?? 0));
        const resolutionTopFast: ResolutionTopItem[] = topFastSorted.slice(0, topN);

        setStats({
          totalRNCs: totalCount || 0,
          totalMonthlyRNCs: totalMonthlyCount || 0,
          pendingRNCs: pendingCount || 0,
          pendingMonthlyRNCs: pendingMonthlyCount || 0,
          canceledRNCs: canceledCount || 0,
          canceledMonthlyRNCs: canceledMonthlyCount || 0,
          collectedRNCs: collectedCount || 0,
          collectedMonthlyRNCs: collectedMonthlyCount || 0,
          concludedRNCs: concludedCount || 0,
          concludedMonthlyRNCs: concludedMonthlyCount || 0,
          typeStats: typeStats || [],
          departmentStats: departmentStats || [],
          responsibleStats: responsibleStats || [],
          companyStats: companyStats || [],
          resolutionTime: resolutionRowsRaw || [],
          resolutionSeries,
          resolutionTopSlow,
          resolutionTopFast,
          resolutionKpis,
        });
      } catch (error) {
        const err = error as Error;
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [filterStartISO, filterEndISO, monthStartISO, monthEndISO, group, topN, hasDateFilter]);

  return { stats, loading, error };
};
