import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wind, ShoppingCart, ArrowRight } from 'lucide-react';
import CalculatorForm from '../components/calculator/CalculatorForm';
import ResultsDisplay from '../components/calculator/ResultsDisplay';
import ProductionChart from '../components/calculator/ProductionChart';
import { calculateProduction } from '../services/calculatorService';
import type { CalculatorInputs, CalculatorResults } from '../types/calculator';

export default function Calculator() {
  const [results, setResults] = useState<CalculatorResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = (inputs: CalculatorInputs) => {
    try {
      setError(null);
      const calculationResults = calculateProduction(inputs);
      setResults(calculationResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setResults(null);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Wind className="h-10 w-10" />
            <h1 className="text-3xl md:text-4xl font-bold">Calculateur de Production</h1>
          </div>
          <p className="text-lg text-white/90 max-w-2xl">
            Estimez la production annuelle de votre éolienne Tulipe en fonction de votre localisation
            et de la puissance choisie.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div>
            <CalculatorForm onCalculate={handleCalculate} />

            {/* Error Message */}
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="space-y-8">
            {results ? (
              <>
                <ResultsDisplay results={results} />
                <ProductionChart monthlyProduction={results.monthlyProduction} />
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Wind className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Prêt à calculer ?
                </h3>
                <p className="text-gray-500">
                  Sélectionnez votre département et la puissance souhaitée pour obtenir
                  une estimation de production.
                </p>
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
