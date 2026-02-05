import { Sparkles, Zap, Euro, Battery, ArrowUpRight, Wind } from 'lucide-react';

interface PersonalizedSummaryProps {
  annualProduction: number;
  annualAutoconsumption: number;
  annualSavings: number;
  batteryGain?: number;
  surplus: number;
}

export default function PersonalizedSummary({
  annualProduction,
  annualAutoconsumption,
  annualSavings,
  batteryGain,
  surplus,
}: PersonalizedSummaryProps) {
  const hasBattery = batteryGain !== undefined && batteryGain > 0;
  const totalAutoconsumption = annualAutoconsumption + (batteryGain || 0);
  const batterySavings = hasBattery ? batteryGain * 0.26 : 0;
  const totalSavings = annualSavings + batterySavings;

  return (
    <div className="bg-gradient-to-br from-primary/10 via-emerald-50 to-amber-50 rounded-xl shadow-lg p-6 space-y-6 border border-primary/20">
      {/* Header with sparkle icon */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Votre bilan personnalisé</h3>
          <p className="text-sm text-gray-600">Projection sur une année complète</p>
        </div>
      </div>

      {/* Main message */}
      <div className="bg-white/80 rounded-xl p-5 border border-primary/10">
        <p className="text-lg text-gray-800 leading-relaxed">
          <span className="font-semibold text-primary">Si vous aviez eu votre installation l'an dernier</span>, vous auriez produit{' '}
          <span className="font-bold text-primary">{annualProduction.toLocaleString('fr-FR')} kWh</span>, autoconsommé{' '}
          <span className="font-bold text-emerald-600">{totalAutoconsumption.toLocaleString('fr-FR')} kWh</span> et économisé{' '}
          <span className="font-bold text-green-600">{Math.round(totalSavings).toLocaleString('fr-FR')} €</span>.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Production */}
        <div className="bg-white/70 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-primary">
            {annualProduction.toLocaleString('fr-FR')}
          </p>
          <p className="text-xs text-gray-600">kWh produits</p>
        </div>

        {/* Autoconsumption */}
        <div className="bg-white/70 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Zap className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">
            {totalAutoconsumption.toLocaleString('fr-FR')}
          </p>
          <p className="text-xs text-gray-600">kWh autoconsommés</p>
        </div>

        {/* Savings */}
        <div className="bg-white/70 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Euro className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">
            {Math.round(totalSavings).toLocaleString('fr-FR')}
          </p>
          <p className="text-xs text-gray-600">€ économisés</p>
        </div>

        {/* Surplus */}
        <div className="bg-white/70 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <ArrowUpRight className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-500">
            {surplus.toLocaleString('fr-FR')}
          </p>
          <p className="text-xs text-gray-600">kWh surplus</p>
        </div>
      </div>

      {/* Battery mention if activated */}
      {hasBattery && (
        <div className="flex items-center gap-3 bg-amber-100/80 rounded-lg p-4 border border-amber-200">
          <Battery className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <span className="font-semibold">Dont {batteryGain.toLocaleString('fr-FR')} kWh</span> grâce à votre batterie, 
            soit <span className="font-semibold">{Math.round(batterySavings).toLocaleString('fr-FR')} €</span> d'économies supplémentaires.
          </p>
        </div>
      )}

      {/* Surplus info */}
      {surplus > 0 && (
        <div className="flex items-center gap-3 bg-blue-50/80 rounded-lg p-4 border border-blue-200">
          <ArrowUpRight className="h-5 w-5 text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            <span className="font-semibold">{surplus.toLocaleString('fr-FR')} kWh</span> de surplus réinjectés gratuitement sur le réseau.
          </p>
        </div>
      )}

      {/* Wind energy valorization message */}
      <div className="flex items-start gap-3 bg-white/60 rounded-lg p-4 border border-primary/10">
        <Wind className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-sm text-gray-700">
          <span className="font-medium text-primary">L'éolien produit souvent en phase avec votre consommation</span> (nuit/hiver), 
          maximisant votre autoconsommation naturelle par rapport au solaire.
        </p>
      </div>
    </div>
  );
}
