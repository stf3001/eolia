import { useState, useEffect } from 'react';
import { Battery, Euro, AlertTriangle, Zap } from 'lucide-react';
import { BATTERY_CAPACITIES, ELECTRICITY_PRICE } from '../../types/calculator';
import type { BatteryResults } from '../../types/calculator';
import { calculateBatteryImpact, isBatteryFullyUtilized } from '../../services/batteryService';

interface BatterySelectorProps {
  onCapacityChange: (capacity: number | null) => void;
  naturalAutoconsumption: number;
  annualProduction: number;
  annualConsumption: number;
}

export default function BatterySelector({
  onCapacityChange,
  naturalAutoconsumption,
  annualProduction,
  annualConsumption,
}: BatterySelectorProps) {
  const [selectedCapacity, setSelectedCapacity] = useState<number | null>(null);
  const [results, setResults] = useState<BatteryResults | null>(null);

  // Calculate battery impact when capacity changes
  useEffect(() => {
    if (selectedCapacity !== null) {
      const batteryResults = calculateBatteryImpact(
        selectedCapacity,
        naturalAutoconsumption,
        annualProduction,
        annualConsumption
      );
      setResults(batteryResults);
    } else {
      setResults(null);
    }
  }, [selectedCapacity, naturalAutoconsumption, annualProduction, annualConsumption]);

  // Notify parent of capacity change
  useEffect(() => {
    onCapacityChange(selectedCapacity);
  }, [selectedCapacity, onCapacityChange]);

  const handleCapacitySelect = (capacity: number) => {
    setSelectedCapacity(selectedCapacity === capacity ? null : capacity);
  };

  // Check if battery is capped (not fully utilized)
  const isCapped = selectedCapacity !== null && results !== null && !isBatteryFullyUtilized(selectedCapacity, results);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-100 rounded-lg">
          <Battery className="h-6 w-6 text-amber-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Simulation batterie</h3>
          <p className="text-sm text-gray-600">Estimez le gain avec un stockage</p>
        </div>
      </div>

      {/* Capacity Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Capacité de stockage (kWh)
        </label>
        <div className="flex flex-wrap gap-2">
          {BATTERY_CAPACITIES.map((capacity) => (
            <button
              key={capacity}
              type="button"
              onClick={() => handleCapacitySelect(capacity)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                selectedCapacity === capacity
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {capacity} kWh
            </button>
          ))}
        </div>
      </div>

      {/* Results Display */}
      {results && selectedCapacity !== null && (
        <div className="space-y-4">
          {/* Capping Warning */}
          {isCapped && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">Capacité plafonnée</p>
                <p className="text-amber-700 mt-1">
                  Le gain est limité par votre production ou consommation. 
                  Une batterie plus petite pourrait suffire.
                </p>
              </div>
            </div>
          )}

          {/* Battery Gain and Savings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Battery Gain */}
            <div className="bg-amber-50 rounded-xl p-5 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-amber-600" />
                <span className="text-sm font-medium text-gray-600">Gain batterie</span>
              </div>
              <p className="text-3xl font-bold text-amber-600">
                +{results.batteryGain.toLocaleString('fr-FR')}
              </p>
              <p className="text-sm text-gray-600">kWh/an autoconsommés</p>
            </div>

            {/* Additional Savings */}
            <div className="bg-green-50 rounded-xl p-5 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Euro className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Économies supplémentaires</span>
              </div>
              <p className="text-3xl font-bold text-green-600">
                +{results.additionalSavings.toLocaleString('fr-FR')}
              </p>
              <p className="text-sm text-gray-600">€/an</p>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Autoconsommation totale</p>
                <p className="text-xl font-bold text-gray-900">
                  {results.totalAutoconsumption.toLocaleString('fr-FR')} kWh
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Taux d'autoconsommation</p>
                <p className="text-xl font-bold text-primary">
                  {results.autoconsumptionRate}%
                </p>
              </div>
            </div>
          </div>

          {/* Price Info */}
          <p className="text-xs text-gray-500 text-center">
            Calcul basé sur {ELECTRICITY_PRICE} €/kWh et 300 cycles/an
          </p>
        </div>
      )}

      {/* No Selection State */}
      {selectedCapacity === null && (
        <div className="text-center py-4 text-gray-500">
          <p className="text-sm">Sélectionnez une capacité pour voir l'impact sur votre autoconsommation</p>
        </div>
      )}
    </div>
  );
}
