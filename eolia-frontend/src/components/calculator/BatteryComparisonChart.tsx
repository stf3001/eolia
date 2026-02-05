import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { useState } from 'react';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface BatteryComparisonChartProps {
  autoconsumptionWithoutBattery: number;
  autoconsumptionWithBattery: number;
  annualProduction: number;
  batteryCapacity: number;
}

type ChartType = 'bar' | 'donut';

export default function BatteryComparisonChart({
  autoconsumptionWithoutBattery,
  autoconsumptionWithBattery,
  annualProduction,
  batteryCapacity,
}: BatteryComparisonChartProps) {
  const [chartType, setChartType] = useState<ChartType>('bar');

  // Calculate rates
  const rateWithout = annualProduction > 0 
    ? Math.round((autoconsumptionWithoutBattery / annualProduction) * 100) 
    : 0;
  const rateWith = annualProduction > 0 
    ? Math.round((autoconsumptionWithBattery / annualProduction) * 100) 
    : 0;
  const gainRate = rateWith - rateWithout;
  const batteryGain = autoconsumptionWithBattery - autoconsumptionWithoutBattery;

  // Bar chart data
  const barData = [
    {
      name: 'Sans batterie',
      autoconsommation: autoconsumptionWithoutBattery,
      taux: rateWithout,
      color: '#94a3b8',
    },
    {
      name: `Avec batterie ${batteryCapacity} kWh`,
      autoconsommation: autoconsumptionWithBattery,
      taux: rateWith,
      color: '#10b981',
    },
  ];

  // Donut chart data - before battery
  const donutDataBefore = [
    { name: 'Autoconsommé', value: autoconsumptionWithoutBattery, color: '#94a3b8' },
    { name: 'Surplus', value: annualProduction - autoconsumptionWithoutBattery, color: '#e2e8f0' },
  ];

  // Donut chart data - after battery
  const donutDataAfter = [
    { name: 'Autoconsommé naturel', value: autoconsumptionWithoutBattery, color: '#10b981' },
    { name: 'Gain batterie', value: batteryGain, color: '#f59e0b' },
    { name: 'Surplus', value: annualProduction - autoconsumptionWithBattery, color: '#e2e8f0' },
  ];

  // Custom tooltip for bar chart
  const BarTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof barData[0] }> }) => {
    if (!active || !payload || !payload.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="font-medium text-gray-900 mb-2">{d.name}</p>
        <p className="text-sm">
          <span className="text-gray-600">Autoconsommation : </span>
          <span className="font-semibold">{d.autoconsommation.toLocaleString('fr-FR')} kWh</span>
        </p>
        <p className="text-sm">
          <span className="text-gray-600">Taux : </span>
          <span className="font-bold text-primary">{d.taux}%</span>
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Impact de la batterie</h2>
          <p className="text-sm text-gray-600">Comparaison avant/après stockage</p>
        </div>
        
        {/* Chart type toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setChartType('bar')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              chartType === 'bar' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Barres
          </button>
          <button
            type="button"
            onClick={() => setChartType('donut')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              chartType === 'donut' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <PieChartIcon className="h-4 w-4" />
            Donut
          </button>
        </div>
      </div>

      {/* Bar Chart View */}
      {chartType === 'bar' && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical" margin={{ top: 10, right: 30, left: 100, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={true} vertical={false} />
              <XAxis
                type="number"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(value) => `${value.toLocaleString('fr-FR')}`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: '#374151', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={100}
              />
              <Tooltip content={<BarTooltip />} />
              <Bar dataKey="autoconsommation" radius={[0, 4, 4, 0]} barSize={40}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Donut Chart View */}
      {chartType === 'donut' && (
        <div className="grid grid-cols-2 gap-4">
          {/* Before battery */}
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">Sans batterie</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutDataBefore}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {donutDataBefore.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-2xl font-bold text-gray-500">{rateWithout}%</p>
            <p className="text-xs text-gray-500">d'autoconsommation</p>
          </div>

          {/* After battery */}
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">Avec batterie {batteryCapacity} kWh</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutDataAfter}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {donutDataAfter.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{rateWith}%</p>
            <p className="text-xs text-gray-500">d'autoconsommation</p>
          </div>
        </div>
      )}

      {/* Summary stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">Gain</p>
          <p className="text-xl font-bold text-emerald-600">+{gainRate}%</p>
        </div>
        <div className="text-center border-x border-gray-200">
          <p className="text-sm text-gray-600">kWh supplémentaires</p>
          <p className="text-xl font-bold text-amber-600">+{batteryGain.toLocaleString('fr-FR')}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Taux final</p>
          <p className="text-xl font-bold text-primary">{rateWith}%</p>
        </div>
      </div>

      {/* Legend for donut */}
      {chartType === 'donut' && (
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-gray-600">Autoconsommé</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-gray-600">Gain batterie</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-200" />
            <span className="text-gray-600">Surplus</span>
          </div>
        </div>
      )}
    </div>
  );
}
