import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Wind, ShoppingCart, ArrowRight, Save } from 'lucide-react';
import CalculatorForm from '../components/calculator/CalculatorForm';
import type { CalculatorFormInitialValues } from '../components/calculator/CalculatorForm';
import ResultsDisplay from '../components/calculator/ResultsDisplay';
import ProductionChart from '../components/calculator/ProductionChart';
import SaveSimulationButton from '../components/calculator/SaveSimulationButton';
import { calculateProduction, getDepartments } from '../services/calculatorService';
import { simulationService } from '../services/simulationService';
import { useAuth } from '../context/AuthContext';
import type { CalculatorInputs, CalculatorResults } from '../types/calculator';
import type { PendingSimulation } from '../types/simulation';

const PENDING_SIMULATION_KEY = 'eolia_pending_simulation';
const PENDING_EXPIRATION_MS = 30 * 60 * 1000; // 30 minutes

export default function Calculator() {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<CalculatorResults | null>(null);
  const [currentInputs, setCurrentInputs] = useState<CalculatorInputs | null>(null);
  const [currentDepartmentName, setCurrentDepartmentName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showPendingSavePrompt, setShowPendingSavePrompt] = useState(false);
  const [isSavingPending, setIsSavingPending] = useState(false);
  const pendingProcessedRef = useRef(false);

  // Parse URL params for pre-filling the form
  const initialValues = useMemo<CalculatorFormInitialValues | undefined>(() => {
    const dept = searchParams.get('dept');
    if (!dept) return undefined;

    const values: CalculatorFormInitialValues = {
      departmentCode: dept,
    };

    const power = searchParams.get('power');
    if (power) {
      const powerNum = parseFloat(power);
      if (!isNaN(powerNum)) values.powerKwc = powerNum;
    }

    const count = searchParams.get('count');
    if (count) {
      const countNum = parseInt(count, 10);
      if (!isNaN(countNum)) values.turbineCount = countNum;
    }

    const anemoSpeed = searchParams.get('anemoSpeed');
    if (anemoSpeed) {
      const speedNum = parseFloat(anemoSpeed);
      if (!isNaN(speedNum)) values.anemometerSpeed = speedNum;
    }

    const anemoMonth = searchParams.get('anemoMonth');
    if (anemoMonth) {
      const monthNum = parseInt(anemoMonth, 10);
      if (!isNaN(monthNum)) values.anemometerMonth = monthNum;
    }

    return values;
  }, [searchParams]);

  // Determine if we should auto-calculate (when URL params are present)
  const shouldAutoCalculate = !!initialValues?.departmentCode;

  // Check for pending simulation on mount
  useEffect(() => {
    if (pendingProcessedRef.current) return;

    const pendingData = localStorage.getItem(PENDING_SIMULATION_KEY);
    if (!pendingData) return;

    try {
      const pending: PendingSimulation = JSON.parse(pendingData);
      
      // Check if expired (30 minutes)
      if (Date.now() - pending.timestamp > PENDING_EXPIRATION_MS) {
        localStorage.removeItem(PENDING_SIMULATION_KEY);
        return;
      }

      // Restore the simulation results
      setResults(pending.results);
      setCurrentInputs(pending.inputs);
      setCurrentDepartmentName(pending.departmentName);
      pendingProcessedRef.current = true;

      // If user is authenticated, show save prompt
      if (isAuthenticated) {
        setShowPendingSavePrompt(true);
      }
    } catch {
      localStorage.removeItem(PENDING_SIMULATION_KEY);
    }
  }, [isAuthenticated]);

  // Auto-save pending simulation when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && showPendingSavePrompt && currentInputs && results) {
      // Clear the pending simulation from localStorage
      localStorage.removeItem(PENDING_SIMULATION_KEY);
    }
  }, [isAuthenticated, showPendingSavePrompt, currentInputs, results]);

  const handleCalculate = (inputs: CalculatorInputs) => {
    try {
      setError(null);
      setShowPendingSavePrompt(false);
      const calculationResults = calculateProduction(inputs);
      setResults(calculationResults);
      setCurrentInputs(inputs);
      
      // Get department name
      const departments = getDepartments();
      const dept = departments.find(d => d.code === inputs.departmentCode);
      setCurrentDepartmentName(dept?.name || inputs.departmentCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setResults(null);
      setCurrentInputs(null);
    }
  };

  const handleSavePending = async () => {
    if (!currentInputs || !results) return;

    setIsSavingPending(true);
    try {
      await simulationService.saveSimulation(currentInputs, results, currentDepartmentName);
      setShowPendingSavePrompt(false);
      localStorage.removeItem(PENDING_SIMULATION_KEY);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setIsSavingPending(false);
    }
  };

  const handleDismissPendingPrompt = () => {
    setShowPendingSavePrompt(false);
    localStorage.removeItem(PENDING_SIMULATION_KEY);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section - Compact on desktop */}
      <section className="bg-primary text-white py-4 lg:py-5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-1">
            <Wind className="h-7 w-7 lg:h-8 lg:w-8" />
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">Calculateur de Production</h1>
          </div>
          <p className="text-sm lg:text-base text-white/90 max-w-2xl">
            Estimez la production annuelle de votre éolienne Tulipe en fonction de votre localisation
            et de la puissance choisie.
          </p>
        </div>
      </section>

      {/* Main Content - Reduced padding on desktop */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Pending Save Prompt */}
        {showPendingSavePrompt && isAuthenticated && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Save className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-900">Simulation restaurée</p>
                <p className="text-sm text-green-700">
                  Voulez-vous sauvegarder cette simulation dans votre espace client ?
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={handleDismissPendingPrompt}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Non merci
              </button>
              <button
                onClick={handleSavePending}
                disabled={isSavingPending}
                className="px-4 py-2 text-sm bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isSavingPending ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div>
            <CalculatorForm 
              onCalculate={handleCalculate}
              initialValues={initialValues}
              autoCalculate={shouldAutoCalculate}
            />

            {/* Error Message */}
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {results ? (
              <>
                <ResultsDisplay results={results} />
                
                {/* Save Button - only show if not showing pending prompt */}
                {currentInputs && !showPendingSavePrompt && (
                  <SaveSimulationButton
                    inputs={currentInputs}
                    results={results}
                    departmentName={currentDepartmentName}
                  />
                )}
                
                <ProductionChart monthlyProduction={results.monthlyProduction} />
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Votre parcours vers l'autonomie
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Estimez votre production</p>
                      <p className="text-xs text-gray-500">Utilisez le calculateur ci-contre</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-sm font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Affinez avec l'anémomètre</p>
                      <p className="text-xs text-gray-500">Prêt gratuit 1 mois, mesurez le vent réel</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-sm font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Validez votre configuration</p>
                      <p className="text-xs text-gray-500">On vous conseille sur le bon dimensionnement</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-sm font-bold">4</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">On s'occupe de tout</p>
                      <p className="text-xs text-gray-500">Livraison, installateur, démarches Consuel</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center">
                    Une question ? <Link to="/faq" className="text-primary hover:underline">Consultez notre FAQ</Link>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CTA Boutique */}
          <Link
            to="/produits"
            className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4 hover:shadow-xl transition-shadow group"
          >
            <div className="bg-primary/10 rounded-full p-4">
              <ShoppingCart className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                Découvrir notre gamme Tulipe
              </h3>
              <p className="text-gray-600 text-sm">
                Éoliennes de 1 à 10 kWc, onduleurs et accessoires
              </p>
            </div>
            <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-primary transition-colors" />
          </Link>

          {/* CTA Anémomètre */}
          <Link
            to="/anemometre"
            className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4 hover:shadow-xl transition-shadow group"
          >
            <div className="bg-blue-100 rounded-full p-4">
              <Wind className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                Anémomètre en prêt gratuit
              </h3>
              <p className="text-gray-600 text-sm">
                Mesurez le vent sur votre site pendant 1 mois
              </p>
            </div>
            <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </Link>
        </div>
      </section>
    </div>
  );
}
