import { Gift, Lock, CheckCircle } from 'lucide-react';
import { B2C_REWARDS, B2C_REFERRAL_LIMIT } from '../../types/affiliate';

interface RewardsProgressProps {
  referralCount: number;
  totalEarned: number;
}

export default function RewardsProgress({ referralCount, totalEarned }: RewardsProgressProps) {
  const progressPercentage = (referralCount / B2C_REFERRAL_LIMIT) * 100;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Gift className="w-5 h-5 text-emerald-600" />
        Vos récompenses
      </h3>

      {/* Total earned */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg p-4 mb-6 text-white">
        <p className="text-sm opacity-90">Total des bons d'achat gagnés</p>
        <p className="text-3xl font-bold">{totalEarned} €</p>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{referralCount} filleul{referralCount > 1 ? 's' : ''}</span>
          <span>Limite: {B2C_REFERRAL_LIMIT}/an</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Rewards grid */}
      <div className="grid grid-cols-5 gap-2">
        {B2C_REWARDS.map((reward, index) => {
          const isEarned = index < referralCount;
          const isNext = index === referralCount;
          
          return (
            <div
              key={index}
              className={`relative p-3 rounded-lg text-center transition-all ${
                isEarned
                  ? 'bg-emerald-100 border-2 border-emerald-500'
                  : isNext
                  ? 'bg-emerald-50 border-2 border-dashed border-emerald-300'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              {isEarned && (
                <CheckCircle className="w-4 h-4 text-emerald-600 absolute -top-1 -right-1 bg-white rounded-full" />
              )}
              {!isEarned && !isNext && (
                <Lock className="w-3 h-3 text-gray-400 absolute top-1 right-1" />
              )}
              <p className={`text-xs font-medium ${isEarned ? 'text-emerald-700' : 'text-gray-500'}`}>
                #{reward.referralNumber}
              </p>
              <p className={`text-sm font-bold ${isEarned ? 'text-emerald-700' : 'text-gray-700'}`}>
                {reward.amount}€
              </p>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          <span className="font-medium">Comment ça marche :</span> Gagnez un bon d'achat pour chaque filleul 
          qui effectue son premier achat. 200€ pour le 1er, 250€ pour le 2ème, puis 300€ pour les suivants.
        </p>
      </div>
    </div>
  );
}
