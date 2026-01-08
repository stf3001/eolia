import { useState } from 'react'
import { Link } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import {
  Wind,
  CheckCircle,
  Package,
  ArrowRight,
  Info,
  Shield,
  Clock,
  Truck,
  RotateCcw,
  AlertCircle,
} from 'lucide-react'
import AnemometerPaymentForm from '../components/anemometer/AnemometerPaymentForm'

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder')

const CAUTION_AMOUNT = 100

interface AnemometerFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  addressLine1: string
  addressLine2: string
  postalCode: string
  city: string
}

type AnemometerStep = 'info' | 'form' | 'payment' | 'confirmation'

export default function Anemometer() {
  const [step, setStep] = useState<AnemometerStep>('info')
  const [formData, setFormData] = useState<AnemometerFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    postalCode: '',
    city: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof AnemometerFormData, string>>>({})
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof AnemometerFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof AnemometerFormData, string>> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'Prénom requis'
    if (!formData.lastName.trim()) newErrors.lastName = 'Nom requis'
    if (!formData.email.trim()) {
      newErrors.email = 'Email requis'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Téléphone requis'
    } else if (!/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Numéro de téléphone invalide'
    }
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Adresse requise'
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Code postal requis'
    } else if (!/^\d{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Code postal invalide'
    }
    if (!formData.city.trim()) newErrors.city = 'Ville requise'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    setApiError(null)

    try {
      // Call backend to create PaymentIntent for caution
      const apiUrl = import.meta.env.VITE_API_URL || ''
      const response = await fetch(`${apiUrl}/payments/create-anemometer-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: CAUTION_AMOUNT,
          type: 'anemometer_loan',
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            postalCode: formData.postalCode,
            city: formData.city,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création du paiement')
      }

      const { clientSecret: secret } = await response.json()
      setClientSecret(secret)
      setStep('payment')
    } catch {
      // Demo mode - simulate client secret
      console.warn('API not available, using demo mode')
      setClientSecret('demo_client_secret')
      setStep('payment')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    setStep('confirmation')
  }

  const handlePaymentError = (errorMessage: string) => {
    setApiError(errorMessage)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  // Confirmation step
  if (step === 'confirmation') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-lg mx-auto text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Demande de prêt confirmée !
          </h1>
          <p className="text-gray-600 mb-4">
            Merci {formData.firstName} ! Votre demande de prêt d'anémomètre a bien été enregistrée.
          </p>
          <p className="text-gray-600 mb-8">
            Vous recevrez un email de confirmation à <strong>{formData.email}</strong> avec
            les instructions de mise en place et le suivi de livraison.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-green-800">
              <strong>Rappel :</strong> La caution de {formatPrice(CAUTION_AMOUNT)} sera
              automatiquement remboursée à réception de l'anémomètre en bon état.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/calculateur"
              className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors"
            >
              Accéder au calculateur
            </Link>
            <Link
              to="/"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <Wind className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Prêt d'Anémomètre Gratuit
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Mesurez précisément le potentiel éolien de votre site avant d'investir.
          Nous vous prêtons un anémomètre professionnel pendant 1 mois.
        </p>
      </div>

      {step === 'info' && (
        <>
          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">1 mois de prêt</h3>
              <p className="text-sm text-gray-600">
                Durée suffisante pour obtenir des données représentatives de votre site.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Caution remboursable</h3>
              <p className="text-sm text-gray-600">
                {formatPrice(CAUTION_AMOUNT)} de caution, intégralement remboursée au retour.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-4">
                <RotateCcw className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Retour prépayé</h3>
              <p className="text-sm text-gray-600">
                Bon de retour prépayé inclus. Aucun frais supplémentaire.
              </p>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Comment ça marche ?
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">
                  1
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Commandez</h4>
                <p className="text-sm text-gray-600">
                  Remplissez le formulaire et payez la caution de {formatPrice(CAUTION_AMOUNT)}.
                </p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">
                  2
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Recevez</h4>
                <p className="text-sm text-gray-600">
                  L'anémomètre est livré chez vous sous 3-5 jours ouvrés.
                </p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">
                  3
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Mesurez</h4>
                <p className="text-sm text-gray-600">
                  Installez-le et relevez les données pendant 1 mois.
                </p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">
                  4
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Retournez</h4>
                <p className="text-sm text-gray-600">
                  Renvoyez-le avec le bon prépayé et récupérez votre caution.
                </p>
              </div>
            </div>
          </div>

          {/* Info box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex gap-4">
              <Info className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Pourquoi mesurer le vent sur votre site ?
                </h3>
                <p className="text-sm text-blue-800">
                  Les données météo générales donnent une estimation, mais chaque site est unique.
                  La topographie, les bâtiments environnants et la végétation influencent fortement
                  le potentiel éolien. Une mesure sur site vous permet d'affiner votre estimation
                  de production et de valider votre projet en toute confiance.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={() => setStep('form')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-semibold text-lg hover:bg-primary-dark transition-colors"
            >
              Commander mon anémomètre
              <ArrowRight className="h-5 w-5" />
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Caution de {formatPrice(CAUTION_AMOUNT)} • Remboursée au retour
            </p>
          </div>
        </>
      )}

      {step === 'form' && (
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-medium">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">Vos coordonnées</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-200 mx-4" />
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-medium">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Paiement caution</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Adresse de livraison
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="06 12 34 56 78"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse *
                </label>
                <input
                  type="text"
                  id="addressLine1"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                    errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.addressLine1 && <p className="text-red-500 text-sm mt-1">{errors.addressLine1}</p>}
              </div>

              <div>
                <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">
                  Complément d'adresse
                </label>
                <input
                  type="text"
                  id="addressLine2"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Code postal *
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    maxLength={5}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                      errors.postalCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    Ville *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
              </div>

              {/* Summary box */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Package className="h-5 w-5 text-primary" />
                  <span className="font-medium text-gray-900">Récapitulatif</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Prêt d'anémomètre professionnel (1 mois)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Livraison gratuite sous 3-5 jours
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Bon de retour prépayé inclus
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Guide d'installation fourni
                  </li>
                </ul>
                <hr className="my-3 border-gray-200" />
                <div className="flex justify-between font-semibold text-gray-900">
                  <span>Caution (remboursable)</span>
                  <span>{formatPrice(CAUTION_AMOUNT)}</span>
                </div>
              </div>

              {/* Prepaid return notice */}
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <Truck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">
                  <strong>Bon de retour prépayé inclus :</strong> À la fin de la période de prêt,
                  utilisez simplement l'étiquette de retour fournie. Aucun frais d'expédition à votre charge.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep('info')}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Chargement...' : 'Continuer vers le paiement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {step === 'payment' && clientSecret && (
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-medium">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">Vos coordonnées</span>
            </div>
            <div className="w-16 h-0.5 bg-primary mx-4" />
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-medium">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">Paiement caution</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Paiement de la caution
            </h2>

            {apiError && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{apiError}</p>
              </div>
            )}

            {/* Caution info */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-amber-800">
                <strong>Caution de {formatPrice(CAUTION_AMOUNT)} :</strong> Ce montant sera
                automatiquement remboursé sur votre carte bancaire à réception de l'anémomètre
                en bon état de fonctionnement.
              </p>
            </div>

            {clientSecret === 'demo_client_secret' ? (
              // Demo mode
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Mode démo :</strong> Le backend de paiement n'est pas encore configuré.
                    Cliquez sur le bouton ci-dessous pour simuler le paiement de la caution.
                  </p>
                </div>
                <button
                  onClick={handlePaymentSuccess}
                  className="w-full py-4 px-6 bg-primary text-white rounded-full font-semibold text-lg hover:bg-primary-dark transition-colors"
                >
                  Simuler le paiement de {formatPrice(CAUTION_AMOUNT)}
                </button>
              </div>
            ) : (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#065f46',
                    },
                  },
                }}
              >
                <AnemometerPaymentForm
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  amount={CAUTION_AMOUNT}
                />
              </Elements>
            )}

            <button
              onClick={() => setStep('form')}
              className="mt-4 w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              Modifier mes informations
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
