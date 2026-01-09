import { useState } from 'react';
import { Save, Check, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { simulationService } from '../../services/simulationService';
import type { CalculatorInputs, CalculatorResults } from '../../types/calculator';
import type { PendingSimulation } from '../../types/simulation';
import AuthRequiredModal from './AuthRequiredModal';

interface SaveSimulationButtonProps {
  inputs: CalculatorInputs;
  results: CalculatorResults;
  departmentName: string;
  onSaved?: () => void;
}

type ButtonState = 'default' | 'loading' | 'saved' | 'error';

const PENDING_SIMULATION_KEY = 'eolia_pending_simulation';

export default function SaveSimulationButton({
  inputs,
  results,
  departmentName,
  onSaved,
}: SaveSimulationButtonProps) {
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState<ButtonState>('default');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSave = async () => {
    if (!isAuthenticated) {
      // Save to localStorage before showing modal
      const pendingSimulation: PendingSimulation = {
        inputs,
        results,
        departmentName,
        timestamp: Date.now(),
      };
      localStorage.setItem(PENDING_SIMULATION_KEY, JSON.stringify(pendingSimulation));
      setShowAuthModal(true);
      return;
    }

    setState('loading');
    setErrorMessage(null);

    try {
      await simulationService.saveSimulation(inputs, results, departmentName);
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
