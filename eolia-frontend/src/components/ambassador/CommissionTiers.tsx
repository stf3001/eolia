import { TrendingUp } from 'lucide-react';
import { B2B_COMMISSION_TIERS } from '../../types/affiliate';

interface CommissionTiersProps {
  cumulativeRevenue: number;
  currentTier: number;
}

export default function CommissionTiers({ cumulativeRevenue, currentTier }: CommissionTiersProps) {
  const getCurrentTierIndex = () => {
    return B2B_COMMISSION_TIERS.findIndex((tier) => tier.rate === currentTier);
  };

  const currentTierIndex = getCurrentTierIndex();
  const nextTier = B2B_COMMISSION_TIERS[currentTierIndex + 1];

  const getProgressToNextTier = () => {
    if (!nextTier) return 100;
    const currentThreshold = B2B_COMMISSION_TIERS[currentTierIndex].threshold;
    const nextThreshold = nextTier.threshold;
    const progress = ((cumulativeRevenue - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-emerald-600" />
        Paliers de commission
      </h3>

      {/* Current tier highlight */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-6 text-white mb-6">
        <div className="text-center mb-4">
          <div className="text-sm opacity-90 mb-1">Votre taux actuel</div>
          <div className="text-4xl font-bold">{currentTier}%</div>
          <div className="text-sm opacity-90 mt-1">
            CA généré : {formatCurrency(cumulativeRevenue)}
          </div>
        </div>

        {nextTier && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progression vers {nextTier.rate}%</span>
              <span>{formatCurrency(nextTier.threshold)}</span>
            </div>
            <div className="bg-white/20 rounded-full h-3">
              <div
                className="bg-white rounded-full h-3 transition-all duration-500"
                style={{ width: `${getProgressToNextTier()}%` }}
              />
            </div>
            <div className="text-xs text-center mt-2 opacity-90">
              Plus que {formatCurrency(nextTier.threshold - cumulativeRevenue)} pour atteindre le palier suivant
            </div>
          </div>
        )}
      </div>

      {/* Tiers grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {B2B_COMMISSION_TIERS.map((tier, index) => {
          const isActive = index === currentTierIndex;
          const isCompleted = index < currentTierIndex;

          return (
            <div
              key={tier.rate}
              className={`rounded-lg p-4 text-center transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : isCompleted
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <div className="text-2xl font-bold">{tier.rate}%</div>
              <div className="text-xs mt-1">{tier.label}</div>
              {isActive && <div className="text-xs mt-1 font-semibold">● Actuel</div>}
              {isCompleted && <div className="text-xs mt-1 font-semibold">✓ Atteint</div>}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          <span className="font-medium">Comment ça marche :</span> Votre taux de commission augmente 
          automatiquement en fonction du chiffre d'affaires cumulé généré par vos apports d'affaires.
        </p>
      </div>
    </div>
  );
}
