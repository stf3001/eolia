import { Users, CheckCircle, Clock, UserPlus } from 'lucide-react';
import type { Referral, ReferralStatus } from '../../types/affiliate';

interface ReferralsListProps {
  referrals: Referral[];
  isLoading?: boolean;
}

const statusConfig: Record<ReferralStatus, { label: string; color: string; icon: typeof Clock }> = {
  submitted: { label: 'En attente', color: 'text-yellow-600 bg-yellow-50', icon: Clock },
  registered: { label: 'Inscrit', color: 'text-blue-600 bg-blue-50', icon: UserPlus },
  first_purchase: { label: '1er achat', color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle },
  active: { label: 'Actif', color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle },
};

export default function ReferralsList({ referrals, isLoading }: ReferralsListProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-600" />
          Vos filleuls
        </h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-emerald-600" />
        Vos filleuls ({referrals.length})
      </h3>

      {referrals.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucun filleul pour le moment</p>
          <p className="text-sm text-gray-400 mt-1">
            Partagez votre code pour commencer à parrainer
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {referrals.map((referral) => {
            const status = statusConfig[referral.status];
            const StatusIcon = status.icon;
            
            return (
              <div
                key={referral.referralId}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-700 font-semibold">
                      {(referral.firstName?.[0] || referral.email[0]).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {referral.firstName && referral.lastName
                        ? `${referral.firstName} ${referral.lastName}`
                        : referral.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(referral.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  {status.label}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
