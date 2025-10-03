import { Button } from "@/components/ui/button";
import { CompanyQualityStats, DepartmentQualityStats, ResponsibleQualityStats, TypeQualityStats } from '@/hooks/useDashboardStats';
import type { ResolutionTopItem, ResolutionKpis } from '@/hooks/useDashboardStats';
import { getDepartmentDisplayName, getTypeDisplayName } from '@/pages/quality/home/utils/colors';
import { RncDepartmentEnum, RncTypeEnum } from '@/types/rnc';
import { Card } from '@/ui/card';
import { ChartContainer } from '@/ui/chart';
import * as React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

/* ==============================
   Types & Props
================================*/

interface RNCStatsProps {
  stats: {
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

    // Resolution analytics (without the line chart now)
    resolutionTopSlow?: ResolutionTopItem[];
    resolutionTopFast?: ResolutionTopItem[];
    resolutionKpis?: ResolutionKpis | null;
  } | null;
  isLoading: boolean;
  error: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    value: number;
    name: string;
    dataKey: string;
    payload: {
      type?: string;
      department?: string;
      count: number;
    };
  }[];
  total: number;
  label?: string;
}

/* ==============================
   Display Names & Colors
================================*/

const TYPE_NAMES = {
  [RncTypeEnum.company_complaint]: getTypeDisplayName(RncTypeEnum.company_complaint),
  [RncTypeEnum.supplier]: getTypeDisplayName(RncTypeEnum.supplier),
  [RncTypeEnum.dispatch]: getTypeDisplayName(RncTypeEnum.dispatch),
  [RncTypeEnum.logistics]: getTypeDisplayName(RncTypeEnum.logistics),
  [RncTypeEnum.commercial]: getTypeDisplayName(RncTypeEnum.commercial),
};

const DEPARTMENT_NAMES = {
  [RncDepartmentEnum.logistics]: getDepartmentDisplayName(RncDepartmentEnum.logistics),
  [RncDepartmentEnum.quality]: getDepartmentDisplayName(RncDepartmentEnum.quality),
  [RncDepartmentEnum.financial]: getDepartmentDisplayName(RncDepartmentEnum.financial),
  [RncDepartmentEnum.tax]: getDepartmentDisplayName(RncDepartmentEnum.tax),
};

const COMPANY_COLOR_PALETTE = [
  '#9b87f5', // Primary Purple
  '#F97316', // Bright Orange
  '#0EA5E9', // Ocean Blue
  '#D946EF', // Magenta Pink
  '#8B5CF6', // Vivid Purple
  '#33C3F0', // Sky Blue
  '#1EAEDB', // Bright Blue
  '#ff6900', // Current Orange
  '#f0b100', // Current Yellow
  '#00bc7d', // Green
  '#e12afb', // Pink
  '#0084d1', // Blue
  '#155dfc', // Bright Blue
  '#fe9a00', // Orange
];

const CHART_COLORS = {
  types: {
    company_complaint: '#615fff',
    supplier: '#00b8db',
    dispatch: '#8e51ff',
    logistics: '#7ccf00',
    commercial: '#00bba7',
  },
  departments: {
    logistics: '#7ccf00',
    quality: '#ad46ff',
    financial: '#ff2056',
    tax: '#f6339a',
  },
  responsibles: {
    'Arthur oliveira': '#7ccf00',
    Pedro: '#00bc7d',
    Rafaela: '#e12afb',
    'Rodrigo mistura': '#155dfc',
    'Fabiana Meletti': '#fe9a00',
  },
};

// Distinct palettes for the Top 5 charts
const TOP_SLOW_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16'];    // warm -> attention
const TOP_FAST_COLORS = ['#22c55e', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6'];    // cool -> “fast/success”

/* ==============================
   Utils
================================*/

const fmtHours = (v?: number | null) => (v == null ? '—' : (Math.round(v * 10) / 10).toLocaleString('pt-BR'));

function toTopN<T extends { company: string | null; count: number | null }>(rows: T[], N = 12) {
  const ordered = [...rows]
    .filter((r) => r.company !== null)
    .sort((a, b) => (b.count ?? 0) - (a.count ?? 0));
  const head = ordered.slice(0, N);
  const tail = ordered.slice(N);
  const others = tail.reduce((s, r) => s + (r.count ?? 0), 0);
  return others > 0 ? [...head, { company: 'Outros', count: others } as T] : head;
}

type ClickableLegendProps = {
  payload?: any[];
  activeName: string | null;
  onToggle: (name: string) => void;
};

const ClickableLegend: React.FC<ClickableLegendProps> = ({ payload = [], activeName, onToggle }) => {
  return (
    <ul className="flex flex-wrap gap-2 justify-center px-2 py-1">
      {payload.map((item) => {
        const name = item.value as string;
        const color = item.color as string;
        const active = !activeName || activeName === name;
        return (
          <li key={name}>
            <button
              type="button"
              onClick={() => onToggle(name)}
              className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-sm transition
                ${active ? 'opacity-100' : 'opacity-50'}
                hover:opacity-100`}
              title={name}
            >
              <span className="w-3 h-3 rounded-sm" style={{ background: color }} />
              <span className="max-w-[14ch] truncate">{name}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

// Custom tooltip formatter for percentages (Type/Department charts)
const CustomToolTip: React.FC<CustomTooltipProps> = ({ active, payload, total }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0];
  const typeName = data.payload.type
    ? TYPE_NAMES[data.payload.type as keyof typeof TYPE_NAMES]
    : data.payload.department
    ? DEPARTMENT_NAMES[data.payload.department as keyof typeof DEPARTMENT_NAMES]
    : '';
  const value = data.value;
  const percentage = total ? ((value / total) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
      <p className="text-sm text-gray-600 dark:text-gray-300">{typeName}</p>
      <p className="font-semibold text-gray-900 dark:text-white">
        {value} ({percentage}%)
      </p>
    </div>
  );
};

// Full list/modal table content
const CompanyFullList: React.FC<{ rows: { company: string; count: number }[] }> = ({ rows }) => {
  const [q, setQ] = React.useState('');
  const data = React.useMemo(
    () =>
      [...rows]
        .filter((r) => r.company && r.company.toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) => (b.count ?? 0) - (a.count ?? 0)),
    [rows, q],
  );

  return (
    <>
      <div className="pb-2">
        <input
          placeholder="Buscar empresa…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="
            w-full px-3 py-1.5 rounded-lg
            bg-background text-foreground
            placeholder:text-muted-foreground
            border border-input
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
          "
        />
      </div>
      <div className="overflow-auto max-h-[60vh] pr-1">
        <table className="w-full text-sm">
          <thead className="text-neutral-400">
            <tr>
              <th className="text-left py-2">#</th>
              <th className="text-left">Empresa</th>
              <th className="text-right">RNCs</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={`${r.company}-${i}`} className="border-t border-neutral-800">
                <td className="py-2">{i + 1}</td>
                <td className="truncate pr-4">{r.company}</td>
                <td className="text-right">{r.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

/* ==============================
   Component
================================*/

export function RNCStats({ stats, isLoading, error }: RNCStatsProps) {
  const typeTotal = stats?.typeStats?.reduce((sum, stat) => sum + (stat.count || 0), 0) || 0;
  const deptTotal = stats?.departmentStats?.reduce((sum, stat) => sum + (stat.count || 0), 0) || 0;

  if (isLoading) {
    return <div>Carregando estatísticas...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {/* ===== KPI CARDS (Status) ===== */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
        <div className="bg-slate-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-400">Total</h3>
          <p className="text-2xl font-bold text-slate-600 dark:text-slate-300">{stats?.totalRNCs ?? 0}</p>
        </div>
        <div className="bg-yellow-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-yellow-700  dark:text-yellow-500">Pendentes</h3>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats?.pendingRNCs ?? 0}</p>
        </div>
        <div className="bg-blue-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-blue-700  dark:text-blue-500">Coletadas</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats?.collectedRNCs ?? 0}</p>
        </div>
        <div className="bg-green-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-green-700 dark:text-green-500">Solucionadas</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats?.concludedRNCs ?? 0}</p>
        </div>
        <div className="bg-red-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-red-700 dark:text-red-500">Canceladas</h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats?.canceledRNCs ?? 0}</p>
        </div>
        <div className="bg-slate-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-400">Total (mês)</h3>
          <p className="text-2xl font-bold text-slate-600 dark:text-slate-300">{stats?.totalMonthlyRNCs ?? 0}</p>
        </div>
        <div className="bg-yellow-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-yellow-700  dark:text-yellow-500">Pendentes (mês)</h3>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats?.pendingMonthlyRNCs ?? 0}</p>
        </div>
        <div className="bg-blue-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-blue-700  dark:text-blue-500">Coletadas (mês)</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats?.collectedMonthlyRNCs ?? 0}</p>
        </div>
        <div className="bg-green-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-green-700 dark:text-green-500">Solucionadas (mês)</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats?.concludedMonthlyRNCs ?? 0}</p>
        </div>
        <div className="bg-red-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-red-700 dark:text-red-500">Canceladas (mês)</h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats?.canceledMonthlyRNCs ?? 0}</p>
        </div>
      </div>

      {/* ===== Resolution KPI Cards (kept) ===== */}
      {stats?.resolutionKpis && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-5">
          <div className="bg-slate-100 dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-400">Tempo médio (h)</h3>
            <p className="text-2xl font-bold text-slate-600 dark:text-slate-300">
              {fmtHours(stats.resolutionKpis.avg_hours)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Mediana {fmtHours(stats.resolutionKpis.p50_hours)} · P90 {fmtHours(stats.resolutionKpis.p90_hours)}
            </p>
          </div>
          <div className="bg-slate-100 dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-400">Min / Max (h)</h3>
            <p className="text-2xl font-bold text-slate-600 dark:text-slate-300">
              {fmtHours(stats.resolutionKpis.min_hours)} / {fmtHours(stats.resolutionKpis.max_hours)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fechadas no período: {stats.resolutionKpis.qtd}
            </p>
          </div>
        </div>
      )}

      {/* ===== Main Charts (Type / Department / Responsible / Company) ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
        {/* Bar Chart (Type) */}
        <Card className="w-full p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">RNCs por Tipo</h3>
          <div className="w-full h-[300px] sm:h-[400px]">
            <ChartContainer
              className="w-full min-h-[300px] md:min-h-[400px]"
              config={{
                type: {
                  theme: {
                    light: 'hsl(222.2 47.4% 11.2%)',
                    dark: 'hsl(210 40% 98%)',
                  },
                },
              }}
            >
              <BarChart data={stats?.typeStats?.filter((stat) => stat.type !== null)} margin={{ top: 20, right: 30, left: 40, bottom: 70 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="type"
                  tickFormatter={(value) => TYPE_NAMES[value as keyof typeof TYPE_NAMES] || (value as string)}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis domain={[0, stats?.totalRNCs ?? 0]} allowDecimals={false} tickCount={5} />
                <Tooltip content={<CustomToolTip total={typeTotal} />} />
                <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]}>
                  {stats?.typeStats?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS.types[entry.type as keyof typeof CHART_COLORS.types]} />
                  ))}
                  <LabelList dataKey="count" position="top" />
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </Card>

        {/* Bar Chart (Department) */}
        <Card className="w-full p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">RNCs por Departamento</h3>
          <div className="w-full h-[300px] sm:h-[400px]">
            <ChartContainer
              className="w-full min-h-[300px] md:min-h-[400px]"
              config={{
                department: {
                  theme: {
                    light: 'hsl(222.2 47.4% 11.2%)',
                    dark: 'hsl(210 40% 98%)',
                  },
                },
              }}
            >
              <BarChart
                data={stats?.departmentStats?.filter((stat) => stat.department !== null)}
                margin={{ top: 20, right: 30, left: 40, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="department"
                  tickFormatter={(value) => DEPARTMENT_NAMES[value as keyof typeof DEPARTMENT_NAMES] || (value as string)}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis domain={[0, stats?.totalRNCs ?? 0]} allowDecimals={false} tickCount={5} />
                <Tooltip content={<CustomToolTip total={deptTotal} />} />
                <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]}>
                  {stats?.departmentStats?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS.departments[entry.department as keyof typeof CHART_COLORS.departments]}
                    />
                  ))}
                  <LabelList dataKey="count" position="top" />
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </Card>

        {/* Pie Chart (Responsible) with interactive legend */}
        <Card className="w-full p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">RNCs por Responsável</h3>
          <div className="w-full h-[300px] sm:h-[400px]">
            <ChartContainer
              className="w-full min-h-[300px] md:min-h-[400px]"
              config={{
                responsible: {
                  theme: {
                    light: 'hsl(222.2 47.4% 11.2%)',
                    dark: 'hsl(210 40% 98%)',
                  },
                },
              }}
            >
              {(() => {
                const [focusName, setFocusName] = React.useState<string | null>(null);
                const data = (stats?.responsibleStats ?? []).filter((s) => s.responsible !== null);

                return (
                  <PieChart>
                    <Pie data={data} dataKey="count" nameKey="responsible" cx="50%" cy="50%" outerRadius={110} innerRadius={0} isAnimationActive>
                      {data.map((entry, index) => {
                        const color =
                          CHART_COLORS.responsibles[(entry.responsible as keyof typeof CHART_COLORS.responsibles) || ''] ??
                          '#8884d8';
                        const dim = focusName && entry.responsible !== focusName;
                        return (
                          <Cell
                            key={`cell-resp-${index}`}
                            fill={color}
                            fillOpacity={dim ? 0.35 : 1}
                            stroke="#ffffff33"
                            strokeWidth={dim ? 1 : 2}
                          />
                        );
                      })}
                    </Pie>
                    <Tooltip
                      formatter={(val: number, _name: string, p: any) => {
                        const total = data.reduce((s, r) => s + (r.count ?? 0), 0);
                        const pct = total ? ((val / total) * 100).toFixed(1) : '0.0';
                        return [`${val} (${pct}%)`, p.payload.responsible];
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={48}
                      content={(props) => (
                        <ClickableLegend
                          {...props}
                          activeName={focusName}
                          onToggle={(name) => setFocusName((prev) => (prev === name ? null : name))}
                        />
                      )}
                    />
                  </PieChart>
                );
              })()}
            </ChartContainer>
          </div>
        </Card>

        {/* Company: Horizontal Bar Top-N + "Outros" + modal "Ver todas" */}
        <Card className="w-full p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">RNCs por Empresa</h3>
          {(() => {
            const [open, setOpen] = React.useState(false);
            const raw = (stats?.companyStats ?? []).filter((s) => s.company !== null);
            const top = toTopN(raw as any[], 12);
            const total = raw.reduce((s, r) => s + (r.count ?? 0), 0);
            return (
              <div className="w-full h-[360px] relative">
                <ChartContainer
                  className="w-full h-full"
                  config={{
                    company: {
                      theme: {
                        light: 'hsl(222.2 47.4% 11.2%)',
                        dark: 'hsl(210 40% 98%)',
                      },
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={top.map((r) => ({ company: r.company, count: r.count }))} layout="vertical" margin={{ top: 8, right: 16, bottom: 8, left: 140 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" allowDecimals={false} />
                      <YAxis
                        type="category"
                        dataKey="company"
                        width={140}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(v: string) => (v?.length > 26 ? `${v.slice(0, 26)}…` : v)}
                      />
                      <Tooltip formatter={(val: number, _n: string, p: any) => [`${val}`, p.payload.company]} />
                      <Bar dataKey="count" barSize={18} radius={[4, 4, 4, 4]}>
                        {top.map((_, i) => (
                          <Cell key={`cell-comp-${i}`} fill={COMPANY_COLOR_PALETTE[i % COMPANY_COLOR_PALETTE.length]} />
                        ))}
                        <LabelList dataKey="count" position="right" className="fill-current" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>

                <div className="absolute top-2 right-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 px-3"
                    onClick={() => setOpen(true)}
                    title="Ver ranking completo"
                  >
                    Ver todas
                  </Button>
                </div>

                {open && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* overlay sem depender do tema */}
                    <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />

                    {/* conteúdo do modal */}
                    <div
                      className="
                        relative z-10 w-[880px] max-w-[96vw] max-h-[80vh] overflow-hidden
                        bg-background text-foreground
                        border border-border
                        rounded-2xl shadow-xl
                        p-4
                      "
                      role="dialog"
                      aria-modal="true"
                      aria-label="RNCs por Empresa — todas"
                    >
                      <div className="flex items-center justify-between gap-3 pb-2">
                        <h4 className="text-base font-semibold">
                          RNCs por Empresa — todas ({total})
                        </h4>

                        {/* pode usar Button do shadcn aqui também */}
                        <button
                          onClick={() => setOpen(false)}
                          className="
                            px-2 py-1 rounded-md text-sm
                            bg-muted hover:bg-muted/80
                            border border-border
                            transition-colors
                          "
                        >
                          Fechar
                        </button>
                      </div>

                      <CompanyFullList rows={raw as any[]} />
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </Card>
      </div>

      {/* ===== Top Slow / Fast (Top 5 + colored bars) ===== */}
      {Boolean((stats?.resolutionTopSlow?.length ?? 0) || (stats?.resolutionTopFast?.length ?? 0)) && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 p-4">
          <Card className="w-full p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              RNCs que levaram MAIS tempo (Top 5)
            </h3>
            <div className="w-full h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={(stats?.resolutionTopSlow ?? [])
                    .slice(0, 5)
                    .map((r) => ({
                      key: `${r.rnc_number} · ${r.company ?? '-'}`,
                      hours: r.duration_hours ?? 0,
                    }))}
                  layout="vertical"
                  margin={{ top: 8, right: 16, bottom: 8, left: 220 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    type="category"
                    dataKey="key"
                    width={220}
                    tickFormatter={(v: string) => (v.length > 34 ? v.slice(0, 34) + '…' : v)}
                  />
                  <Tooltip formatter={(v: number) => [`${fmtHours(v)} h`, 'Duração']} />
                  <Bar dataKey="hours" barSize={18} radius={[6, 6, 6, 6]}>
                    {Array.from({ length: Math.min(5, stats?.resolutionTopSlow?.length ?? 0) }).map((_, i) => (
                      <Cell key={`slow-${i}`} fill={TOP_SLOW_COLORS[i % TOP_SLOW_COLORS.length]} />
                    ))}
                    <LabelList dataKey="hours" position="right" formatter={(v: number) => `${fmtHours(v)} h`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="w-full p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              RNCs que levaram MENOS tempo (Top 5)
            </h3>
            <div className="w-full h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={(stats?.resolutionTopFast ?? [])
                    .slice(0, 5)
                    .map((r) => ({
                      key: `${r.rnc_number} · ${r.company ?? '-'}`,
                      hours: r.duration_hours ?? 0,
                    }))}
                  layout="vertical"
                  margin={{ top: 8, right: 16, bottom: 8, left: 220 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    type="category"
                    dataKey="key"
                    width={220}
                    tickFormatter={(v: string) => (v.length > 34 ? v.slice(0, 34) + '…' : v)}
                  />
                  <Tooltip formatter={(v: number) => [`${fmtHours(v)} h`, 'Duração']} />
                  <Bar dataKey="hours" barSize={18} radius={[6, 6, 6, 6]}>
                    {Array.from({ length: Math.min(5, stats?.resolutionTopFast?.length ?? 0) }).map((_, i) => (
                      <Cell key={`fast-${i}`} fill={TOP_FAST_COLORS[i % TOP_FAST_COLORS.length]} />
                    ))}
                    <LabelList dataKey="hours" position="right" formatter={(v: number) => `${fmtHours(v)} h`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
