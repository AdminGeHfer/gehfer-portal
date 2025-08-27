import { CompanyQualityStats, DepartmentQualityStats, ResponsibleQualityStats, TypeQualityStats } from '@/hooks/useDashboardStats';
import { getDepartmentDisplayName, getTypeDisplayName } from '@/pages/quality/home/utils/colors';
import { RncDepartmentEnum, RncTypeEnum } from '@/types/rnc';
import { Card } from '@/ui/card';
import { ChartContainer } from '@/ui/chart';
import * as React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, Tooltip, XAxis, YAxis } from 'recharts';

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
  [RncDepartmentEnum.tax]: getDepartmentDisplayName(RncDepartmentEnum.tax)
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
  '#fe9a00'  // Orange
];

const getCompanyColor = (companyName: string): string => {
  // Simple hash function
  const hash = companyName.split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Use the hash to pick a color from the palette
  return COMPANY_COLOR_PALETTE[hash % COMPANY_COLOR_PALETTE.length];
};

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
    tax: '#f6339a'
  },
  responsibles: {
    "Arthur": "#7ccf00",
    "Pedro": "#00bc7d",
    "Rafaela": "#e12afb",
    "Rodrigo Mistura": "#155dfc",
    "Fabiana Meletti": "#fe9a00"
  }
};

// Custom tooltip formatter for percentages
const CustomToolTip: React.FC<CustomTooltipProps> = ({ active, payload, total }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0];
  const typeName = data.payload.type ? TYPE_NAMES[data.payload.type] : 
                  data.payload.department ? DEPARTMENT_NAMES[data.payload.department] : '';
  const value = data.value;
  const percentage = ((value / total) * 100).toFixed(1);
    
  return (
    <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
      <p className="text-sm text-gray-600 dark:text-gray-300">{typeName}</p>
      <p className="font-semibold text-gray-900 dark:text-white">
        {value} ({percentage}%)
      </p>
    </div>
  );
};

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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
        <div className="bg-slate-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-400">Total</h3>
          <p className="text-2xl font-bold text-slate-600 dark:text-slate-300">{stats.totalRNCs}</p>
        </div>
        <div className="bg-yellow-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-yellow-700  dark:text-yellow-500">Pendentes</h3>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pendingRNCs}</p>
        </div>
        <div className="bg-blue-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-blue-700  dark:text-blue-500">Coletadas</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.collectedRNCs}</p>
        </div>
        <div className="bg-green-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-green-700 dark:text-green-500">Solucionadas</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.concludedRNCs}</p>
        </div>
        <div className="bg-red-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-red-700 dark:text-red-500">Canceladas</h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.canceledRNCs}</p>
        </div>
        <div className="bg-slate-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-400">Total (mês)</h3>
          <p className="text-2xl font-bold text-slate-600 dark:text-slate-300">{stats.totalMonthlyRNCs}</p>
        </div>
        <div className="bg-yellow-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-yellow-700  dark:text-yellow-500">Pendentes (mês)</h3>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pendingMonthlyRNCs}</p>
        </div>
        <div className="bg-blue-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-blue-700  dark:text-blue-500">Coletadas (mês)</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.collectedMonthlyRNCs}</p>
        </div>
        <div className="bg-green-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-green-700 dark:text-green-500">Solucionadas (mês)</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.concludedMonthlyRNCs}</p>
        </div>
        <div className="bg-red-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-red-700 dark:text-red-500">Canceladas (mês)</h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.canceledMonthlyRNCs}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
        {/* Bar Chart (Type) */}
        <Card className="w-full p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            RNCs por Tipo
          </h3>
          <div className="w-full h-[300px] sm:h-[400px]">
            <ChartContainer 
              className="w-full min-h-[300px] md:min-h-[400px]"
              config={{
                type: { 
                  theme: {
                    light: "hsl(222.2 47.4% 11.2%)",
                    dark: "hsl(210 40% 98%)"
                  } 
                }
              }}
            >
              <BarChart 
                data={stats?.typeStats?.filter(stat => stat.type !== null)}
                margin={{ top: 20, right: 30, left: 40, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="type"
                  tickFormatter={(value) => TYPE_NAMES[value] || value}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis domain={[0, stats.totalRNCs]} allowDecimals={false} tickCount={5} />
                <Tooltip 
                  content={<CustomToolTip total={typeTotal} />}
                />
                <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]}>
                  {stats?.typeStats?.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CHART_COLORS.types[entry.type]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </Card>
        {/* Bar Chart (Department) */}
        <Card className="w-full p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            RNCs por Departamento
          </h3>
          <div className="w-full h-[300px] sm:h-[400px]">
            <ChartContainer 
              className="w-full min-h-[300px] md:min-h-[400px]"
              config={{
                department: { 
                  theme: {
                    light: "hsl(222.2 47.4% 11.2%)",
                    dark: "hsl(210 40% 98%)"
                  } 
                }
              }}
            >
              <BarChart 
                data={stats?.departmentStats?.filter(stat => stat.department !== null)}
                margin={{ top: 20, right: 30, left: 40, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="department"
                  tickFormatter={(value) => DEPARTMENT_NAMES[value] || value}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis domain={[0, stats.totalRNCs]} allowDecimals={false} tickCount={5} />
                <Tooltip 
                  content={<CustomToolTip total={deptTotal} />}
                />
                <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]}>
                  {stats?.departmentStats?.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CHART_COLORS.departments[entry.department]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </Card>
        {/* Pie Chart (Responsible) */}
        <Card className="w-full p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            RNCs por Responsável
          </h3>
          <div className="w-full h-[300px] sm:h-[400px]">
            <ChartContainer 
              className="w-full min-h-[300px] md:min-h-[400px]"
              config={{
                responsible: { 
                  theme: {
                    light: "hsl(222.2 47.4% 11.2%)",
                    dark: "hsl(210 40% 98%)"
                  }
                }
              }}
            >
              <PieChart>
                <Pie
                  data={stats?.responsibleStats?.filter(stat => stat.responsible !== null)}
                  dataKey="count"
                  nameKey="responsible"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={0}
                  fill="#8884d8"
                >
                  {stats?.responsibleStats?.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CHART_COLORS.responsibles[entry.responsible]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomToolTip total={deptTotal} />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                />
              </PieChart>
            </ChartContainer>
          </div>
        </Card>
        {/* Pie Chart (Company) */}
        <Card className="w-full p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            RNCs por Empresa
          </h3>
          <div className="w-full h-[300px] sm:h-[400px]">
            <ChartContainer 
              className="w-full min-h-[300px] md:min-h-[400px]"
              config={{
                company: { 
                  theme: {
                    light: "hsl(222.2 47.4% 11.2%)",
                    dark: "hsl(210 40% 98%)"
                  }
                }
              }}
            >
              <PieChart>
                <Pie
                  data={stats?.companyStats?.filter(stat => stat.company !== null)}
                  dataKey="count"
                  nameKey="company"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={0}
                  fill="#8884d8"
                >
                  {stats?.companyStats?.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getCompanyColor(entry.company)}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomToolTip total={deptTotal} />} />
                <Legend 
                  verticalAlign="bottom"
                  height={36}
                />
              </PieChart>
            </ChartContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
