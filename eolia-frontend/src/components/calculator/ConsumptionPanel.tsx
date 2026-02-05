import { useState, useEffect, useCallback } from 'react';
import { Zap, Calendar, Database, Info } from 'lucide-react';
import type { ConsumptionData, ConsumptionMode } from '../../types/calculator';
import { SEASONAL_PROFILE, DEFAULT_ANNUAL_CONSUMPTION } from '../../types/calculator';
import { applySeasonalProfile, validateConsumption } from '../../services/consumptionService';

interface ConsumptionPanelProps {
  onConsumptionChange: (consumption: ConsumptionData) => void;
  initialData?: ConsumptionData;
  onEnedisClick?: () => void;
  hasEnedisData?: boolean;
}

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const TABS: { mode: ConsumptionMode; label: string; icon: React.ReactNode }[] = [
  { mode: 'simple', label: 'Simple', icon: <Zap className="h-4 w-4" /> },
  { mode: 'precise', label: 'Précis', icon: <Calendar className="h-4 w-4" /> },
  { mode: 'enedis', label: 'Enedis', icon: <Database className="h-4 w-4" /> },
];

export default function ConsumptionPanel({
  onConsumptionChange,
  initialData,
  onEnedisClick,
  hasEnedisData = false,
}: ConsumptionPanelProps) {
  const [mode, setMode] = useState<ConsumptionMode>(initialData?.mode || 'simple');
  const [annualTotal, setAnnualTotal] = useState<number>(
    initialData?.annualTotal || DEFAULT_ANNUAL_CONSUMPTION
  );
  const [monthlyValues, setMonthlyValues] = useState<number[]>(
    initialData?.monthlyValues || applySeasonalProfile(DEFAULT_ANNUAL_CONSUMPTION)
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  // Calculate total from monthly values
  const monthlyTotal = monthlyValues.reduce((sum, val) => sum + val, 0);

  // Notify parent of consumption changes
  const notifyChange = useCallback((newMode: ConsumptionMode, newAnnual: number, newMonthly: number[]) => {
    const data: ConsumptionData = { mode: newMode };
    
    if (newMode === 'simple') {
      data.annualTotal = newAnnual;
      data.monthlyValues = applySeasonalProfile(newAnnual);
    } else if (newMode === 'precise') {
      data.monthlyValues = newMonthly;
      data.annualTotal = newMonthly.reduce((sum, val) => sum + val, 0);
    }
    
    onConsumptionChange(data);
  }, [onConsumptionChange]);

  // Handle mode change
  const handleModeChange = (newMode: ConsumptionMode) => {
    if (newMode === 'enedis') {
      onEnedisClick?.();
      return;
    }
    
    setMode(newMode);
    setValidationError(null);
    
    if (newMode === 'simple') {
      notifyChange(newMode, annualTotal, monthlyValues);
    } else if (newMode === 'precise') {
      // Initialize monthly values from annual if switching from simple
      const newMonthly = mode === 'simple' ? applySeasonalProfile(annualTotal) : monthlyValues;
      setMonthlyValues(newMonthly);
      notifyChange(newMode, annualTotal, newMonthly);
    }
  };

  // Handle annual total change (simple mode)
  const handleAnnualChange = (value: number) => {
    setAnnualTotal(value);
    
    if (value < 1000 || value > 50000) {
      setValidationError('La consommation doit être entre 1 000 et 50 000 kWh/an');
    } else {
      setValidationError(null);
      notifyChange('simple', value, monthlyValues);
    }
  };

  // Handle monthly value change (precise mode)
  const handleMonthlyChange = (index: number, value: number) => {
    const newValues = [...monthlyValues];
    newValues[index] = Math.max(0, value);
    setMonthlyValues(newValues);
    
    const validation = validateConsumption(newValues);
    if (!validation.valid) {
      setValidationError(validation.message || null);
    } else {
      setValidationError(null);
      notifyChange('precise', annualTotal, newValues);
    }
  };

  // Initial notification on mount
  useEffect(() => {
    if (mode !== 'enedis') {
      notifyChange(mode, annualTotal, monthlyValues);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Zap className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Ma consommation</h3>
          <p className="text-sm text-gray-600">Personnalisez votre simulation</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.mode}
            type="button"
            onClick={() => handleModeChange(tab.mode)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              mode === tab.mode
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.mode === 'enedis' && hasEnedisData && (
              <span className="ml-1 w-2 h-2 bg-green-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Simple Mode */}
      {mode === 'simple' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="annualConsumption" className="block text-sm font-medium text-gray-700 mb-2">
              Consommation annuelle (kWh)
            </label>
            <input
              type="number"
              id="annualConsumption"
              min={1000}
              max={50000}
              step={100}
              value={annualTotal}
              onChange={(e) => handleAnnualChange(parseInt(e.target.value, 10) || 0)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-lg"
              placeholder="Ex: 10000"
            />
          </div>
          
          <div className="flex items-start gap-2 bg-blue-50 rounded-lg p-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              La consommation sera répartie automatiquement sur 12 mois selon le profil saisonnier français standard.
            </p>
          </div>

          {/* Preview of seasonal distribution */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Répartition mensuelle estimée</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 text-center">
              {MONTHS.map((month, index) => (
                <div key={month} className="bg-white rounded-lg p-2 shadow-sm">
                  <p className="text-xs text-gray-500">{month.slice(0, 3)}</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {Math.round(annualTotal * SEASONAL_PROFILE[index]).toLocaleString('fr-FR')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Precise Mode */}
      {mode === 'precise' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Saisissez votre consommation mensuelle pour un calcul plus précis.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {MONTHS.map((month, index) => (
              <div key={month}>
                <label 
                  htmlFor={`month-${index}`} 
                  className="block text-xs font-medium text-gray-600 mb-1"
                >
                  {month}
                </label>
                <input
                  type="number"
                  id={`month-${index}`}
                  min={0}
                  max={10000}
                  value={monthlyValues[index]}
                  onChange={(e) => handleMonthlyChange(index, parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm"
                  placeholder="kWh"
                />
              </div>
            ))}
          </div>

          {/* Total display */}
          <div className="flex items-center justify-between bg-gray-100 rounded-lg p-4">
            <span className="text-sm font-medium text-gray-700">Total annuel</span>
            <span className={`text-xl font-bold ${
              monthlyTotal < 1000 || monthlyTotal > 50000 ? 'text-red-600' : 'text-primary'
            }`}>
              {monthlyTotal.toLocaleString('fr-FR')} kWh
            </span>
          </div>
        </div>
      )}

      {/* Enedis Mode Placeholder */}
      {mode === 'enedis' && (
        <div className="text-center py-6">
          <Database className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">
            Connectez votre compteur Linky pour récupérer automatiquement vos données de consommation.
          </p>
          <button
            type="button"
            onClick={onEnedisClick}
            className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            Connecter mon compteur Linky
          </button>
        </div>
      )}

      {/* Validation Error */}
      {validationError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">{validationError}</p>
        </div>
      )}
    </div>
  );
}
