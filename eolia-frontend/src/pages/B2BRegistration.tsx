import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { affiliateService } from '../services/affiliateService';
import { Building2, CheckCircle, AlertCircle, ArrowLeft, Wind } from 'lucide-react';
import ContractPreview from '../components/ambassador/ContractPreview';
import { B2B_COMMISSION_TIERS } from '../types/affiliate';

type RegistrationStep = 'form' | 'contract' | 'success';

export default function B2BRegistration() {
  const [step, setStep] = useState<RegistrationStep>('form');
  const [formData, setFormData] = useState({
    companyName: '',
    siret: '',
    professionalEmail: '',
    professionalPhone: '',
    professionalAddress: '',
    contractAccepted: false,
    consentGiven: false,
  });
  const [ambassadorCode, setAmbassadorCode] = useState('');
  const [userIp, setUserIp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [siretError, setSiretError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        setUserIp(ipData.ip);

        const profile = await affiliateService.getProfile();
        setAmbassadorCode(profile.affiliate.code);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setUserIp('Unknown');
      }
    };

    fetchUserData();
  }, []);

  const validateSiret = (siret: string): boolean => {
    const cleaned = siret.replace(/\s/g, '');
    if (!/^\d{14}$/.test(cleaned)) {
      setSiretError('Le SIRET doit contenir exactement 14 chiffres');
      return false;
    }
    setSiretError('');
    return true;
  };

  const validateEmail = (email: string): boolean => {
    if (!email) return true;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true;
    const regex = /^(\+33|0)[1-9](\d{2}){4}$/;
    return regex.test(phone.replace(/\s/g, ''));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = 'checked' in e.target ? e.target.checked : false;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    if (name === 'siret' && value.length === 14) {
      validateSiret(value);
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.companyName.trim()) {
      setError("Le nom de l'entreprise est requis");
      return;
    }

    if (!validateSiret(formData.siret)) {
      setError('SIRET invalide');
      return;
    }

    if (formData.professionalEmail && !validateEmail(formData.professionalEmail)) {
      setError('Email professionnel invalide');
      return;
    }

    if (formData.professionalPhone && !validatePhone(formData.professionalPhone)) {
      setError('Téléphone professionnel invalide (ex: 0612345678 ou +33612345678)');
      return;
    }

    setStep('contract');
    window.scrollTo(0, 0);
  };

  const handleValidateContract = async () => {
    setError('');

    if (!formData.contractAccepted) {
      setError("Vous devez accepter le contrat d'apporteur d'affaires");
      return;
    }

    if (!formData.consentGiven) {
      setError('Vous devez confirmer avoir obtenu le consentement des filleuls');
      return;
    }

    setIsLoading(true);

    try {
      await affiliateService.registerB2B({
        companyName: formData.companyName.trim(),
        siret: formData.siret.replace(/\s/g, ''),
        professionalEmail: formData.professionalEmail.trim() || undefined,
        professionalPhone: formData.professionalPhone.replace(/\s/g, '') || undefined,
        professionalAddress: formData.professionalAddress.trim() || undefined,
        contractAccepted: formData.contractAccepted,
        consentGiven: formData.consentGiven,
      });

      setStep('success');
      setTimeout(() => {
        window.location.href = '/espace-client';
      }, 2000);
    } catch (err) {
      console.error('Erreur inscription B2B:', err);
      setError((err as Error).message || "Une erreur est survenue lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep('form');
    setError('');
  };

  // Success state
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Inscription réussie !
            </h2>
            <p className="text-gray-600 mb-4">
              Votre compte ambassadeur B2B a été créé avec succès.
            </p>
            <p className="text-sm text-gray-500">
              Redirection vers votre tableau de bord...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mt-4"></div>
          </div>
        </div>
      </div>
    );
  }

  // Contract preview state
  if (step === 'contract') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <nav className="mb-8 text-sm">
            <ol className="flex items-center space-x-2 text-gray-600">
              <li>
                <Link to="/" className="hover:text-emerald-600">Accueil</Link>
              </li>
              <li><span className="mx-2">/</span></li>
              <li>
                <button onClick={handleBack} className="hover:text-emerald-600">
                  Inscription Ambassadeur B2B
                </button>
              </li>
              <li><span className="mx-2">/</span></li>
              <li className="text-gray-900 font-medium">Validation du contrat</li>
            </ol>
          </nav>

          <button
            onClick={handleBack}
            className="mb-6 flex items-center text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour au formulaire
          </button>

          <ContractPreview
            companyName={formData.companyName}
            siret={formData.siret}
            professionalEmail={formData.professionalEmail}
            professionalPhone={formData.professionalPhone}
            professionalAddress={formData.professionalAddress}
            ambassadorCode={ambassadorCode}
            currentDate={new Date().toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
            userIp={userIp}
            userAgent={navigator.userAgent}
          />

          <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <input
                  id="contractAccepted"
                  name="contractAccepted"
                  type="checkbox"
                  checked={formData.contractAccepted}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="contractAccepted" className="ml-3 text-sm text-gray-700">
                  J'accepte le contrat d'apporteur d'affaires et m'engage à respecter les conditions du programme *
                </label>
              </div>

              <div className="flex items-start">
                <input
                  id="consentGiven"
                  name="consentGiven"
                  type="checkbox"
                  checked={formData.consentGiven}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="consentGiven" className="ml-3 text-sm text-gray-700">
                  Je certifie avoir obtenu le consentement explicite des filleuls avant de transmettre leurs coordonnées (RGPD) *
                </label>
              </div>
            </div>

            <button
              onClick={handleValidateContract}
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Validation en cours...' : 'Valider et devenir ambassadeur B2B'}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">* Champs obligatoires</p>
          </div>
        </div>
      </div>
    );
  }

  // Form state (default)
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li>
              <Link to="/" className="hover:text-emerald-600">Accueil</Link>
            </li>
            <li><span className="mx-2">/</span></li>
            <li className="text-gray-900 font-medium">Inscription Ambassadeur B2B</li>
          </ol>
        </nav>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Devenir Ambassadeur Professionnel
          </h1>
          <p className="text-gray-600">
            Rejoignez notre programme B2B et percevez des commissions sur vos apports d'affaires
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleContinue} className="space-y-6">
            <div>
              <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">
                Nom de l'entreprise *
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="ACME Corporation"
              />
            </div>

            <div>
              <label htmlFor="siret" className="block text-sm font-semibold text-gray-700 mb-2">
                SIRET *
              </label>
              <input
                id="siret"
                name="siret"
                type="text"
                value={formData.siret}
                onChange={handleChange}
                required
                maxLength={14}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="12345678901234"
              />
              {siretError && <p className="text-xs text-red-600 mt-1">{siretError}</p>}
              <p className="text-xs text-gray-500 mt-1">14 chiffres sans espaces</p>
            </div>

            <div>
              <label htmlFor="professionalEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                Email professionnel (optionnel)
              </label>
              <input
                id="professionalEmail"
                name="professionalEmail"
                type="email"
                value={formData.professionalEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="contact@entreprise.com"
              />
              <p className="text-xs text-gray-500 mt-1">Si différent de votre email de compte</p>
            </div>

            <div>
              <label htmlFor="professionalPhone" className="block text-sm font-semibold text-gray-700 mb-2">
                Téléphone professionnel (optionnel)
              </label>
              <input
                id="professionalPhone"
                name="professionalPhone"
                type="tel"
                value={formData.professionalPhone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="0612345678"
              />
              <p className="text-xs text-gray-500 mt-1">Format: 0612345678 ou +33612345678</p>
            </div>

            <div>
              <label htmlFor="professionalAddress" className="block text-sm font-semibold text-gray-700 mb-2">
                Adresse professionnelle (optionnel)
              </label>
              <textarea
                id="professionalAddress"
                name="professionalAddress"
                value={formData.professionalAddress}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="123 Rue de l'Entreprise, 75001 Paris"
              />
            </div>

            {/* Commission tiers grid */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Grille des commissions</h3>
              <div className="space-y-2 text-sm">
                {B2B_COMMISSION_TIERS.map((tier) => (
                  <div key={tier.rate} className="flex justify-between">
                    <span className="text-gray-700">{tier.label} :</span>
                    <span className="font-bold text-emerald-600">{tier.rate}%</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-emerald-700 transition-colors"
            >
              Continuer
            </button>

            <p className="text-xs text-gray-500 text-center">
              * Champs obligatoires - Vous pourrez consulter le contrat à l'étape suivante
            </p>
          </form>
        </div>

        {/* B2B advantages */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Wind className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Commissions cash</h3>
            <p className="text-sm text-gray-600">Jusqu'à 12,5% sur chaque vente</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Sans limite</h3>
            <p className="text-sm text-gray-600">Aucun plafond de filleuls</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Paliers progressifs</h3>
            <p className="text-sm text-gray-600">Plus vous vendez, plus vous gagnez</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Déjà inscrit ?{' '}
            <Link to="/espace-client" className="text-emerald-600 hover:underline font-medium">
              Accéder à mon tableau de bord
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
