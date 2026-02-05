import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from 'recharts';

interface SuperpositionChartProps {
  monthlyProduction: number[];
  monthlyConsumption: number[];
  monthlyAutoconsumption: number[];
  monthlyBatteryGain?: number[];
  monthlySurplus: number[];
}

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const MONTH_SHORT = MONTHS.map(m => m.slice(0, 3));

export default function SuperpositionChart({
  monthlyProduction,
  monthlyConsumption,
  monthlyAutoconsumption,
  monthlyBatteryGain,
  monthlySurplus,
}: SuperpositionChartProps) {
  // Build chart data with stacked areas
  const data = MONTHS.map((month, index) => ({
    month: MONTH_SHORT[index],
    fullMonth: month,
    autoconsommation: monthlyAutoconsumption[index] || 0,
    gainBatterie: monthlyBatteryGain?.[index] || 0,
    surplus: monthlySurplus[index] || 0,
    consommation: monthlyConsumption[index] || 0,
    production: monthlyProduction[index] || 0,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof data[0] }> }) => {
    if (!active || !payload || !payload.length) return null;
    
    const d = payload[0].payload;
    const totalAutoconso = d.autoconsommation + d.gainBatterie;
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[200px]">
        <p className="font-bold text-gray-900 mb-3 border-b pb-2">{d.fullMonth}</p>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Production</span>
            <span className="font-semibold text-gray-900">{d.production.toLocaleString('fr-FR')} kWh</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Consommation</span>
            <span className="font-semibold text-gray-900">{d.consommation.toLocaleString('fr-FR')} kWh</span>
          </div>
          
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-emerald-500" />
                Autoconsommation
              </span>
              <span className="font-semibold text-emerald-600">{d.autoconsommation.toLocaleString('fr-FR')} kWh</span>
            </div>
            
            {d.gainBatterie > 0 && (
              <div className="flex justify-between mt-1">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-amber-500" />
                  Gain batterie
                </span>
                <span className="font-semibold text-amber-600">+{d.gainBatterie.toLocaleString('fr-FR')} kWh</span>
              </div>
            )}
            
            <div className="flex justify-between mt-1">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-blue-400" />
                Surplus
              </span>
              <span className="font-semibold text-blue-600">{d.surplus.toLocaleString('fr-FR')} kWh</span>
            </div>
          </div>
          
          {d.gainBatterie > 0 && (
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-medium">
                <span className="text-gray-700">Total autoconsommé</span>
                <span className="text-primary">{totalAutoconso.toLocaleString('fr-FR')} kWh</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Production vs Consommation</h2>
      <p className="text-sm text-gray-600 mb-6">
        Superposition mensuelle de votre production éolienne et consommation
      </p>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
            <Tooltip content={<CustomTooltip />} />
            
            {/* Stacked areas: autoconsommation + batterie + surplus */}
            <Area
              type="monotone"
              dataKey="autoconsommation"
              stackId="1"
              fill="#10b981"
              stroke="#059669"
              fillOpacity={0.8}
              name="Autoconsommation"
            />
            <Area
              type="monotone"
              dataKey="gainBatterie"
              stackId="1"
              fill="#f59e0b"
              stroke="#d97706"
              fillOpacity={0.8}
              name="Gain batterie"
            />
            <Area
              type="monotone"
              dataKey="surplus"
              stackId="1"
              fill="#60a5fa"
              stroke="#3b82f6"
              fillOpacity={0.6}
              name="Surplus"
            />
            
            {/* Consumption line overlay */}
            <Line
              type="monotone"
              dataKey="consommation"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#ef4444', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: '#ef4444' }}
              name="Consommation"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-4 h-3 rounded-sm bg-emerald-500" />
          <span className="text-gray-600">Autoconsommation naturelle</span>
        </div>
        {monthlyBatteryGain && monthlyBatteryGain.some(v => v > 0) && (
          <div className="flex items-center gap-2">
            <span className="w-4 h-3 rounded-sm bg-amber-500" />
            <span className="text-gray-600">Gain batterie</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="w-4 h-3 rounded-sm bg-blue-400" />
          <span className="text-gray-600">Surplus réinjecté</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-1 bg-red-500 rounded" />
          <span className="text-gray-600">Consommation</span>
        </div>
      </div>
    </div>
  );
}
