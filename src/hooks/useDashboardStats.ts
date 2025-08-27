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
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
          .lt('created_at', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString());

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
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
          .lt('created_at', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString());

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
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
          .lt('created_at', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString());

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
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
          .lt('created_at', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString());

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
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
          .lt('created_at', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString());

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
          companyStats: companyStats || []
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};
