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

  const now = new Date();
  const defaultStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
  const defaultEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0));

  const startISO = (opts?.start ?? defaultStart).toISOString();
  const endISO = (opts?.end ?? defaultEnd).toISOString();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        
        const { count: totalCount } = await supabase
          .from('rncs')
          .select('*', { count: 'exact', head: true })
          .is('deleted_at', null);

        const { count: totalMonthlyCount } = await supabase
          .from('rncs')
          .select('*', { count: 'exact', head: true })
          .is('deleted_at', null)
          .gte('created_at', startISO)
          .lt('created_at', endISO);

        const { count: pendingCount } = await supabase
          .from('rncs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending')
          .is('deleted_at', null);

        const { count: pendingMonthlyCount } = await supabase
          .from('rncs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending')
          .is('deleted_at', null)
          .gte('created_at', startISO)
          .lt('created_at', endISO);

        const { count: canceledCount } = await supabase
          .from('rncs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'canceled')
          .is('deleted_at', null);

            const { count: canceledMonthlyCount } = await supabase
          .from('rncs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'canceled')
          .is('deleted_at', null)
          .gte('created_at', startISO)
          .lt('created_at', endISO);

        const { count: collectedCount } = await supabase
          .from('rncs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'collect')
          .is('deleted_at', null);

        const { count: collectedMonthlyCount } = await supabase
          .from('rncs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'collect')
          .is('deleted_at', null)
          .gte('created_at', startISO)
          .lt('created_at', endISO);

        const { count: concludedCount } = await supabase
          .from('rncs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'concluded')
          .is('deleted_at', null);

        const { count: concludedMonthlyCount } = await supabase
          .from('rncs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'concluded')
          .is('deleted_at', null)
          .gte('created_at', startISO)
          .lt('created_at', endISO);

        const { data: typeStats } = await supabase
          .from('type_quality_dashboard_stats')
          .select('*') as { data: TypeQualityStats[] | null };

        const { data: departmentStats } = await supabase
          .from('department_quality_dashboard_stats')
          .select('*') as { data: DepartmentQualityStats[] | null };

        const { data: responsibleStats } = await supabase
          .from('responsible_quality_dashboard_stats')
          .select('*') as { data: ResponsibleQualityStats[] | null };

        const { data: companyStats } = await supabase
          .from('company_quality_dashboard_stats')
          .select('*') as { data: CompanyQualityStats[] | null };

        const { data: resolutionRowsRaw, error: resErr } = await supabase
          .from('rnc_resolution_time')
          .select('*')
          .gte('closed_at', startISO)
          .lt('closed_at', endISO);

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
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [startISO, endISO, group, topN]);

  return { stats, loading, error };
};
