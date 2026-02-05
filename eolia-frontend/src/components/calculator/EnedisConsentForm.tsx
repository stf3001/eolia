import { useState, useEffect } from 'react';
import { Database, CheckCircle, AlertCircle, Loader2, User, MapPin, Hash } from 'lucide-react';
import type { EnedisConsent } from '../../types/enedis';
import { isValidPDL } from '../../types/enedis';

interface EnedisConsentFormProps {
  onConsentSubmit: (consent: EnedisConsent) => void;
  existingConsent?: EnedisConsent;
  isLoading?: boolean;
  error?: string | null;
}

interface FormErrors {
  pdl?: string;
  lastName?: string;
  address?: string;
}

export default function EnedisConsentForm({
  onConsentSubmit,
  existingConsent,
  isLoading = false,
  error = null,
}: EnedisConsentFormProps) {
  const [pdl, setPdl] = useState(existingConsent?.pdl || '');
  const [lastName, setLastName] = useState(existingConsent?.lastName || '');
  const [address, setAddress] = useState(existingConsent?.address || '');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Update form when existingConsent changes
  useEffect(() => {
    if (existingConsent) {
      setPdl(existingConsent.pdl);
      setLastName(existingConsent.lastName);
      setAddress(existingConsent.address);
    }
  }, [existingConsent]);

  // Validate PDL field
  const validatePdl = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Le numéro PDL est requis';
    }
    if (!isValidPDL(value)) {
      return 'Le PDL doit contenir exactement 14 chiffres';
    }
    return undefined;
  };

  // Validate lastName field
  const validateLastName = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Le nom est requis';
    }
    if (value.trim().length < 2) {
      return 'Le nom doit contenir au moins 2 caractères';
    }
    return undefined;
  };

  // Validate address field
  const validateAddress = (value: string): string | undefined => {
    if (!value.trim()) {
      return "L'adresse est requise";
    }
    if (value.trim().length < 5) {
      return "L'adresse doit contenir au moins 5 caractères";
    }
    return undefined;
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const errors: FormErrors = {
      pdl: validatePdl(pdl),
      lastName: validateLastName(lastName),
      address: validateAddress(address),
    };
    setFormErrors(errors);
    return !errors.pdl && !errors.lastName && !errors.address;
  };

  // Handle field blur for validation
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    const errors = { ...formErrors };
    if (field === 'pdl') errors.pdl = validatePdl(pdl);
    if (field === 'lastName') errors.lastName = validateLastName(lastName);
    if (field === 'address') errors.address = validateAddress(address);
    setFormErrors(errors);
  };

  // Handle PDL input - only allow digits
  const handlePdlChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 14);
    setPdl(digitsOnly);
    if (touched.pdl) {
      setFormErrors((prev) => ({ ...prev, pdl: validatePdl(digitsOnly) }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({ pdl: true, lastName: true, address: true });
    
    if (validateForm()) {
      onConsentSubmit({
        pdl: pdl.trim(),
        lastName: lastName.trim(),
        address: address.trim(),
      });
    }
  };

  // Check if consent is active
  const hasActiveConsent = existingConsent?.status === 'active';

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Database className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Connexion Enedis</h3>
          <p className="text-sm text-gray-600">Récupérez vos données Linky</p>
        </div>
      </div>

      {/* Existing Consent Status */}
      {existingConsent && (
        <div className={`flex items-start gap-3 rounded-lg p-4 ${
          hasActiveConsent ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
        }`}>
          {hasActiveConsent ? (
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="text-sm">
            <p className={`font-medium ${hasActiveConsent ? 'text-green-800' : 'text-amber-800'}`}>
              {hasActiveConsent ? 'Données Linky synchronisées' : 'Consentement en attente'}
            </p>
            {existingConsent.consentDate && (
              <p className={hasActiveConsent ? 'text-green-700' : 'text-amber-700'}>
                Dernière mise à jour : {new Date(existingConsent.consentDate).toLocaleDateString('fr-FR')}
              </p>
            )}
            <p className={`mt-1 ${hasActiveConsent ? 'text-green-700' : 'text-amber-700'}`}>
              PDL : {existingConsent.pdl}
            </p>
          </div>
        </div>
      )}

      {/* API Error */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-red-800">Erreur de connexion</p>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Consent Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* PDL Field */}
        <div>
          <label htmlFor="pdl" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Hash className="h-4 w-4" />
            Point de Livraison (PDL)
          </label>
          <input
            type="text"
            id="pdl"
            value={pdl}
            onChange={(e) => handlePdlChange(e.target.value)}
            onBlur={() => handleBlur('pdl')}
            placeholder="14 chiffres (ex: 12345678901234)"
            disabled={isLoading}
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              touched.pdl && formErrors.pdl
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-primary focus:border-primary'
            } focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed`}
            aria-describedby={formErrors.pdl ? 'pdl-error' : 'pdl-hint'}
            aria-invalid={touched.pdl && !!formErrors.pdl}
          />
          {touched.pdl && formErrors.pdl ? (
            <p id="pdl-error" className="mt-1 text-sm text-red-600">{formErrors.pdl}</p>
          ) : (
            <p id="pdl-hint" className="mt-1 text-xs text-gray-500">
              Trouvez votre PDL sur votre facture d'électricité ou sur votre compteur Linky
            </p>
          )}
        </div>

        {/* Last Name Field */}
        <div>
          <label htmlFor="lastName" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <User className="h-4 w-4" />
            Nom du titulaire
          </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              if (touched.lastName) {
                setFormErrors((prev) => ({ ...prev, lastName: validateLastName(e.target.value) }));
              }
            }}
            onBlur={() => handleBlur('lastName')}
            placeholder="Nom figurant sur le contrat"
            disabled={isLoading}
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              touched.lastName && formErrors.lastName
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-primary focus:border-primary'
            } focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed`}
            aria-invalid={touched.lastName && !!formErrors.lastName}
          />
          {touched.lastName && formErrors.lastName && (
            <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
          )}
        </div>

        {/* Address Field */}
        <div>
          <label htmlFor="address" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <MapPin className="h-4 w-4" />
            Adresse du compteur
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              if (touched.address) {
                setFormErrors((prev) => ({ ...prev, address: validateAddress(e.target.value) }));
              }
            }}
            onBlur={() => handleBlur('address')}
            placeholder="Adresse complète du point de livraison"
            disabled={isLoading}
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              touched.address && formErrors.address
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-primary focus:border-primary'
            } focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed`}
            aria-invalid={touched.address && !!formErrors.address}
          />
          {touched.address && formErrors.address && (
            <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Connexion en cours...
            </>
          ) : hasActiveConsent ? (
            <>
              <Database className="h-5 w-5" />
              Mettre à jour le consentement
            </>
          ) : (
            <>
              <Database className="h-5 w-5" />
              Donner mon consentement
            </>
          )}
        </button>
      </form>

      {/* Info Section */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <p className="text-sm font-medium text-gray-700">À propos du consentement Enedis</p>
        <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
          <li>Vos données de consommation sont récupérées via l'API officielle Enedis DataConnect</li>
          <li>Le consentement est valable 12 mois et peut être révoqué à tout moment</li>
          <li>Seules les données de consommation sont collectées, jamais vos informations personnelles</li>
        </ul>
      </div>
    </div>
  );
}
