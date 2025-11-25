import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const SCHEME_COLORS: Record<string, string> = {
  GL: '#1e40af',
  GJ: '#f59e0b',
  YN: '#10b981',
  SH: '#ec4899',
  AB: '#8b5cf6',
};

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  reviewing: '#3b82f6',
  verified: '#8b5cf6',
  processed: '#10b981',
  rejected: '#ef4444',
};

interface SchemeChartProps {
  data: { scheme: string; count: number }[];
}

export function SchemeBarChart({ data }: SchemeChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    fill: SCHEME_COLORS[d.scheme] || '#64748b',
  }));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="font-semibold text-slate-800 mb-4">Leads by Scheme</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="scheme" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface StatusChartProps {
  data: { status: string; count: number }[];
}

export function StatusPieChart({ data }: StatusChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    fill: STATUS_COLORS[d.status] || '#64748b',
  }));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="font-semibold text-slate-800 mb-4">Leads by Status</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="count"
              nameKey="status"
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {chartData.map((d) => (
          <div key={d.status} className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.fill }} />
            <span className="capitalize">{d.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface DailyChartProps {
  data: { date: string; count: number }[];
}

export function DailyLineChart({ data }: DailyChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="font-semibold text-slate-800 mb-4">Daily Submissions (Last 30 Days)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#1e40af"
              strokeWidth={2}
              dot={{ fill: '#1e40af', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
