import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gift, Users, TrendingUp, Wind, ChevronRight, Loader2, Building2, Euro } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { affiliateService } from '../services/affiliateService';
import AmbassadorCodeCard from '../components/ambassador/AmbassadorCodeCard';
import ReferralsList from '../components/ambassador/ReferralsList';
import RewardsProgress from '../components/ambassador/RewardsProgress';
import CommissionsTable from '../components/ambassador/CommissionsTable';
import CommissionTiers from '../components/ambassador/CommissionTiers';
import type { AffiliateProfile, Referral, Commission } from '../types/affiliate';
import { B2C_REWARDS } from '../types/affiliate';

export default function Ambassador() {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<AffiliateProfile | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadAmbassadorData();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadAmbassadorData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [profileData, referralsData] = await Promise.all([
        affiliateService.getProfile(),
        affiliateService.getReferrals(),
      ]);
      
      setProfile(profileData);
      setReferrals(referralsData.referrals);

      // Load commissions for B2B affiliates
      if (profileData.affiliate.type === 'B2B') {
        const commissionsData = await affiliateService.getCommissions();
        setCommissions(commissionsData.commissions);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total earned based on referral count
  const calculateTotalEarned = (referralCount: number): number => {
    return B2C_REWARDS.slice(0, referralCount).reduce((sum, r) => sum + r.amount, 0);
  };

  // Show presentation for non-authenticated users
  if (!isAuthenticated) {
    return <AmbassadorPresentation />;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadAmbassadorData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // No profile found - show presentation with CTA
  if (!profile) {
    return <AmbassadorPresentation showLoginCTA />;
  }

  const referralCount = profile.affiliate.referralCount || 0;
  const totalEarned = calculateTotalEarned(referralCount);
  const isB2B = profile.affiliate.type === 'B2B';

  // B2B Dashboard
  if (isB2B) {
    const cumulativeRevenue = profile.affiliate.cumulativeRevenue || 0;
    const currentTier = profile.affiliate.currentTier || 5;
    const totalCommissions = profile.stats.totalCommissions || 0;
    const pendingCommissions = profile.stats.pendingCommissions || 0;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-8 h-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">Programme Ambassadeur B2B</h1>
          </div>
          <p className="text-gray-600">
            {profile.affiliate.companyName} - SIRET: {profile.affiliate.siret}
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Filleuls</p>
                <p className="text-2xl font-bold text-gray-900">{referrals.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Euro className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">CA généré</p>
                <p className="text-2xl font-bold text-gray-900">
                  {cumulativeRevenue.toLocaleString('fr-FR')} €
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Gift className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Commissions totales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalCommissions.toLocaleString('fr-FR')} €
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">En attente</p>
                <p className="text-2xl font-bold text-orange-600">
                  {pendingCommissions.toLocaleString('fr-FR')} €
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Code card */}
          <div className="lg:col-span-1 space-y-6">
            <AmbassadorCodeCard affiliate={profile.affiliate} />
            <CommissionTiers cumulativeRevenue={cumulativeRevenue} currentTier={currentTier} />
          </div>

          {/* Right column - Referrals and Commissions */}
          <div className="lg:col-span-2 space-y-6">
            <ReferralsList referrals={referrals} />
            <CommissionsTable commissions={commissions} type="B2B" />
          </div>
        </div>
      </div>
    );
  }

  // B2C Dashboard (default)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Programme Ambassadeur</h1>
        <p className="text-gray-600">
          Parrainez vos proches et gagnez des bons d'achat EOLIA
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Filleuls</p>
              <p className="text-2xl font-bold text-gray-900">{referralCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Gift className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Bons gagnés</p>
              <p className="text-2xl font-bold text-gray-900">{totalEarned} €</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Statut</p>
              <p className="text-2xl font-bold text-emerald-600 capitalize">
                {profile.affiliate.status === 'active' ? 'Actif' : 'Inactif'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Code card */}
        <div className="lg:col-span-1">
          <AmbassadorCodeCard affiliate={profile.affiliate} />
        </div>

        {/* Right column - Rewards and Referrals */}
        <div className="lg:col-span-2 space-y-6">
          <RewardsProgress referralCount={referralCount} totalEarned={totalEarned} />
          <ReferralsList referrals={referrals} />
        </div>
      </div>

      {/* B2B CTA */}
      <div className="mt-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold mb-1">Vous êtes professionnel ?</h3>
            <p className="text-gray-300">
              Découvrez notre programme B2B avec des commissions jusqu'à 12,5%
            </p>
          </div>
          <Link
            to="/ambassadeur-b2b"
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            Devenir apporteur d'affaires
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Presentation component for non-authenticated users
function AmbassadorPresentation({ showLoginCTA = false }: { showLoginCTA?: boolean }) {
  const advantages = [
    {
      icon: Gift,
      title: '200€ à 300€ par filleul',
      description: 'Gagnez un bon d\'achat pour chaque proche qui achète une éolienne Tulipe',
    },
    {
      icon: Users,
      title: 'Jusqu\'à 10 parrainages/an',
      description: 'Parrainez jusqu\'à 10 personnes par an et cumulez vos récompenses',
    },
    {
      icon: TrendingUp,
      title: 'Récompenses progressives',
      description: '200€ pour le 1er filleul, 250€ pour le 2ème, puis 300€ pour les suivants',
    },
  ];

  const steps = [
    { number: '1', title: 'Inscrivez-vous', description: 'Créez votre compte EOLIA gratuitement' },
    { number: '2', title: 'Partagez votre code', description: 'Envoyez votre code unique à vos proches' },
    { number: '3', title: 'Gagnez des bons', description: 'Recevez un bon d\'achat à chaque achat de filleul' },
  ];

  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Programme Ambassadeur EOLIA
            </h1>
            <p className="text-xl text-emerald-100 mb-8">
              Parrainez vos proches et gagnez jusqu'à 3 000€ de bons d'achat par an. 
              Partagez votre passion pour l'énergie éolienne et soyez récompensé.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/inscription"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-700 rounded-full font-semibold hover:bg-emerald-50 transition-colors"
              >
                Devenir ambassadeur
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
              {showLoginCTA && (
                <Link
                  to="/connexion"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-colors"
                >
                  J'ai déjà un compte
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Advantages */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Les avantages du programme
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <advantage.icon className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{advantage.title}</h3>
              <p className="text-gray-600">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Comment ça marche ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rewards table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Grille des récompenses
        </h2>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-emerald-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">
                    Filleul
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-emerald-800">
                    Bon d'achat
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-4 text-gray-900">1er filleul</td>
                  <td className="px-6 py-4 text-right font-semibold text-emerald-600">200 €</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-900">2ème filleul</td>
                  <td className="px-6 py-4 text-right font-semibold text-emerald-600">250 €</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-900">3ème filleul et suivants</td>
                  <td className="px-6 py-4 text-right font-semibold text-emerald-600">300 €</td>
                </tr>
              </tbody>
              <tfoot className="bg-emerald-600 text-white">
                <tr>
                  <td className="px-6 py-4 font-semibold">Maximum annuel (10 filleuls)</td>
                  <td className="px-6 py-4 text-right font-bold text-xl">2 850 €</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Wind className="w-16 h-16 text-emerald-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à devenir ambassadeur ?
          </h2>
          <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté d'ambassadeurs et participez à la transition énergétique 
            tout en étant récompensé.
          </p>
          <Link
            to="/inscription"
            className="inline-flex items-center px-8 py-4 bg-white text-emerald-700 rounded-full font-semibold hover:bg-emerald-50 transition-colors"
          >
            Créer mon compte
            <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
