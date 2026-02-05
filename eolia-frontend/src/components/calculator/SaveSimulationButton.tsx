import { useState } from 'react';
import { Save, Check, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { simulationService } from '../../services/simulationService';
import type { CalculatorInputs, CalculatorResults, ConsumptionData, BatteryResults } from '../../types/calculator';
import type { PendingSimulation, SimulationConsumptionData, SimulationBatteryData, SimulationAutoconsumptionResults } from '../../types/simulation';
import AuthRequiredModal from './AuthRequiredModal';

interface SaveSimulationButtonProps {
  inputs: CalculatorInputs;
  results: CalculatorResults;
  departmentName: string;
  onSaved?: () => void;
  // Extended props for consumption and battery
  consumptionData?: ConsumptionData;
  batteryCapacity?: number | null;
  batteryResults?: BatteryResults | null;
  autoconsumptionResults?: {
    annualAutoconsumption: number;
    annualSurplus: number;
    autoconsumptionRate: number;
  } | null;
}

type ButtonState = 'default' | 'loading' | 'saved' | 'error';

const PENDING_SIMULATION_KEY = 'eolia_pending_simulation';

export default function SaveSimulationButton({
  inputs,
  results,
  departmentName,
  onSaved,
  consumptionData,
  batteryCapacity,
  batteryResults,
  autoconsumptionResults,
}: SaveSimulationButtonProps) {
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState<ButtonState>('default');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Build consumption data for saving
  const buildConsumptionPayload = (): SimulationConsumptionData | undefined => {
    if (!consumptionData) return undefined;
    
    const annualTotal = consumptionData.annualTotal || 
      (consumptionData.monthlyValues?.reduce((sum, val) => sum + val, 0)) || 
      0;
    
    if (annualTotal === 0) return undefined;

    return {
      mode: consumptionData.mode,
      annualTotal,
      monthlyValues: consumptionData.monthlyValues || [],
    };
  };

  // Build battery data for saving
  const buildBatteryPayload = (): SimulationBatteryData | undefined => {
    if (batteryCapacity === null || batteryCapacity === undefined) return undefined;
    return { capacity: batteryCapacity };
  };

  // Build autoconsumption results for saving
  const buildAutoconsumptionPayload = (): SimulationAutoconsumptionResults | undefined => {
    if (!autoconsumptionResults) return undefined;
    
    return {
      natural: autoconsumptionResults.annualAutoconsumption,
      withBattery: batteryResults ? 
        autoconsumptionResults.annualAutoconsumption + batteryResults.batteryGain : 
        undefined,
      rate: autoconsumptionResults.autoconsumptionRate,
      surplus: autoconsumptionResults.annualSurplus,
    };
  };

  const handleSave = async () => {
    const consumptionPayload = buildConsumptionPayload();
    const batteryPayload = buildBatteryPayload();
    const autoconsumptionPayload = buildAutoconsumptionPayload();

    if (!isAuthenticated) {
      // Save to localStorage before showing modal
      const pendingSimulation: PendingSimulation = {
        inputs,
        results,
        departmentName,
        timestamp: Date.now(),
        consumption: consumptionPayload,
        battery: batteryPayload,
        autoconsumption: autoconsumptionPayload,
      };
      localStorage.setItem(PENDING_SIMULATION_KEY, JSON.stringify(pendingSimulation));
      setShowAuthModal(true);
      return;
    }

    setState('loading');
    setErrorMessage(null);

    try {
      await simulationService.saveSimulation(
        inputs, 
        results, 
        departmentName,
        consumptionPayload,
        batteryPayload,
        autoconsumptionPayload
      );
      setState('saved');
      onSaved?.();
    } catch (error) {
      setState('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Une erreur est survenue lors de la sauvegarde'
      );
    }
  };

  const getButtonContent = () => {
    switch (state) {
      case 'loading':
        return (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Sauvegarde en cours...</span>
          </>
        );
      case 'saved':
        return (
          <>
            <Check className="h-5 w-5" />
            <span>Simulation sauvegardée !</span>
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="h-5 w-5" />
            <span>Réessayer</span>
          </>
        );
      default:
        return (
          <>
            <Save className="h-5 w-5" />
            <span>Sauvegarder ma simulation</span>
          </>
        );
    }
  };

  const getButtonClasses = () => {
    const baseClasses =
      'w-full px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors';

    switch (state) {
      case 'saved':
        return `${baseClasses} bg-green-600 text-white cursor-default`;
      case 'error':
        return `${baseClasses} bg-red-100 text-red-700 hover:bg-red-200`;
      case 'loading':
        return `${baseClasses} bg-gray-100 text-gray-500 cursor-wait`;
      default:
        return `${baseClasses} bg-primary/10 text-primary hover:bg-primary/20`;
    }
  };

  return (
    <>
      <div className="space-y-2">
        <button
          onClick={handleSave}
          disabled={state === 'loading' || state === 'saved'}
          className={getButtonClasses()}
        >
          {getButtonContent()}
        </button>

        {state === 'error' && errorMessage && (
          <p className="text-sm text-red-600 text-center">{errorMessage}</p>
        )}

        {state === 'saved' && (
          <p className="text-sm text-green-600 text-center">
            Retrouvez cette simulation dans votre espace client.
          </p>
        )}
      </div>

      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        redirectPath="/calculateur"
      />
    </>
  );
}
