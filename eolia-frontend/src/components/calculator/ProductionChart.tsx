import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { getMonthNames } from '../../services/calculatorService';

interface ProductionChartProps {
  monthlyProduction: number[];
}

const monthNames = getMonthNames();

export default function ProductionChart({ monthlyProduction }: ProductionChartProps) {
  const data = monthlyProduction.map((production, index) => ({
    month: monthNames[index].substring(0, 3),
    fullMonth: monthNames[index],
    production,
  }));

  const maxProduction = Math.max(...monthlyProduction);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Production mensuelle estimée</h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              width={50}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                      <p className="font-medium text-gray-900">{data.fullMonth}</p>
                      <p className="text-primary font-bold">
                        {data.production.toLocaleString('fr-FR')} kWh
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="production" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.production === maxProduction ? '#065f46' : '#10b981'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-sm text-gray-500 mt-4 text-center">
        Production en kWh par mois
      </p>
    </div>
  );
}
