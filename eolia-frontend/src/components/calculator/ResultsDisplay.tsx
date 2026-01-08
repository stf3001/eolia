import { Zap, Euro, Wind, Info } from 'lucide-react';
import type { CalculatorResults } from '../../types/calculator';

interface ResultsDisplayProps {
  results: CalculatorResults;
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const { annualProduction, annualSavings, usedAnemometerData, scalingFactor } = results;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Résultats de votre estimation</h2>

      {/* Main Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Annual Production */}
        <div className="bg-primary/5 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium text-gray-600">Production annuelle</span>
          </div>
          <p className="text-4xl font-bold text-primary">
            {annualProduction.toLocaleString('fr-FR')}
          </p>
          <p className="text-lg text-gray-600">kWh/an</p>
        </div>

        {/* Annual Savings */}
        <div className="bg-green-50 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Euro className="h-6 w-6 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Économie estimée</span>
          </div>
          <p className="text-4xl font-bold text-green-600">
            {annualSavings.toLocaleString('fr-FR')}
          </p>
          <p className="text-lg text-gray-600">€/an</p>
        </div>
      </div>

      {/* Anemometer Data Notice */}
      {usedAnemometerData && scalingFactor && (
        <div className="flex items-start gap-3 bg-blue-50 rounded-lg p-4">
          <Wind className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              Calcul personnalisé avec vos données anémomètre
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Facteur d'ajustement appliqué : {scalingFactor.toFixed(2)}x
              {scalingFactor > 1 
                ? ' (votre site est plus venté que la moyenne)'
                : scalingFactor < 1 
                  ? ' (votre site est moins venté que la moyenne)'
                  : ' (conforme à la moyenne)'}
            </p>
          </div>
        </div>
      )}

      {/* Info Notice */}
      <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
        <Info className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-600">
          <p>
            Cette estimation est basée sur les données de vent historiques de votre département
            et la courbe de puissance de l'éolienne Tulipe.
          </p>
          <p className="mt-2">
            Prix de l'électricité utilisé : <strong>0,26 €/kWh</strong>
          </p>
          {!usedAnemometerData && (
            <p className="mt-2 text-primary">
              💡 Pour une estimation plus précise, utilisez notre anémomètre en prêt gratuit !
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
