import { useState } from 'react';
import { MapPin, Zap, Wind, Calendar, Calculator } from 'lucide-react';
import { getDepartments, getAvailablePowers } from '../../services/calculatorService';
import type { CalculatorInputs } from '../../types/calculator';

interface CalculatorFormProps {
  onCalculate: (inputs: CalculatorInputs) => void;
}

const departments = getDepartments();
const availablePowers = getAvailablePowers();

const months = [
  { value: 1, label: 'Janvier' },
  { value: 2, label: 'Février' },
  { value: 3, label: 'Mars' },
  { value: 4, label: 'Avril' },
  { value: 5, label: 'Mai' },
  { value: 6, label: 'Juin' },
  { value: 7, label: 'Juillet' },
  { value: 8, label: 'Août' },
  { value: 9, label: 'Septembre' },
  { value: 10, label: 'Octobre' },
  { value: 11, label: 'Novembre' },
  { value: 12, label: 'Décembre' },
];

export default function CalculatorForm({ onCalculate }: CalculatorFormProps) {
  const [departmentCode, setDepartmentCode] = useState('');
  const [powerKwc, setPowerKwc] = useState<number>(3);
  const [turbineCount, setTurbineCount] = useState<number>(1);
  const [showAnemometer, setShowAnemometer] = useState(false);
  const [anemometerSpeed, setAnemometerSpeed] = useState<string>('');
  const [anemometerMonth, setAnemometerMonth] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!departmentCode) {
      return;
    }

    const inputs: CalculatorInputs = {
      departmentCode,
      powerKwc,
      turbineCount,
    };

    // Add anemometer data if provided
    if (showAnemometer && anemometerSpeed && anemometerMonth) {
      inputs.anemometerSpeed = parseFloat(anemometerSpeed);
      inputs.anemometerMonth = parseInt(anemometerMonth, 10);
    }

    onCalculate(inputs);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <Calculator className="h-6 w-6 text-primary" />
        Calculez votre production
      </h2>

      {/* Department Selection */}
      <div>
        <label htmlFor="department" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <MapPin className="h-4 w-4 text-primary" />
          Département
        </label>
        <select
          id="department"
          value={departmentCode}
          onChange={(e) => setDepartmentCode(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
          required
        >
          <option value="">Sélectionnez votre département</option>
          {departments.map((dept) => (
            <option key={dept.code} value={dept.code}>
              {dept.code} - {dept.name}
            </option>
          ))}
        </select>
      </div>

      {/* Power Selection */}
      <div>
        <label htmlFor="power" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Zap className="h-4 w-4 text-primary" />
          Puissance (kWc)
        </label>
        <select
          id="power"
          value={powerKwc}
          onChange={(e) => setPowerKwc(Number(e.target.value))}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
        >
          {availablePowers.map((power) => (
            <option key={power} value={power}>
              {power} kWc
            </option>
          ))}
        </select>
      </div>

      {/* Turbine Count */}
      <div>
        <label htmlFor="turbineCount" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Wind className="h-4 w-4 text-primary" />
          Nombre d'éoliennes
        </label>
        <input
          type="number"
          id="turbineCount"
          min={1}
          max={10}
          value={turbineCount}
          onChange={(e) => setTurbineCount(Math.max(1, Math.min(10, parseInt(e.target.value, 10) || 1)))}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
        />
        {turbineCount > 1 && (
          <p className="mt-1 text-sm text-primary">
            ✓ Bonus grappe +5% appliqué (effet venturi)
          </p>
        )}
      </div>

      {/* Anemometer Toggle */}
      <div className="border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={() => setShowAnemometer(!showAnemometer)}
          className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
        >
          <Wind className="h-4 w-4" />
          {showAnemometer ? 'Masquer les données anémomètre' : 'J\'ai des données anémomètre (optionnel)'}
        </button>
      </div>

      {/* Anemometer Fields */}
      {showAnemometer && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <p className="text-sm text-gray-600">
            Si vous avez mesuré la vitesse du vent sur votre site, entrez vos données pour un calcul plus précis.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="anemometerSpeed" className="block text-sm font-medium text-gray-700 mb-2">
                Vitesse mesurée (m/s)
              </label>
              <input
                type="number"
                id="anemometerSpeed"
                step="0.1"
                min="0"
                max="30"
                value={anemometerSpeed}
                onChange={(e) => setAnemometerSpeed(e.target.value)}
                placeholder="Ex: 5.2"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label htmlFor="anemometerMonth" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4" />
                Mois de mesure
              </label>
              <select
                id="anemometerMonth"
                value={anemometerMonth}
                onChange={(e) => setAnemometerMonth(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              >
                <option value="">Sélectionnez le mois</option>
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full px-6 py-4 rounded-full bg-primary text-white font-semibold text-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
      >
        <Calculator className="h-5 w-5" />
        Calculer ma production
      </button>
    </form>
  );
}
