import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { fetchAuthSession } from 'aws-amplify/auth'
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
  User,
  MapPin,
  Plus,
  Save,
  BarChart3,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { addressService } from '../services/addressService'
import AddressForm from '../components/dashboard/AddressForm'
import AnemometerPaymentForm from '../components/anemometer/AnemometerPaymentForm'
import type { Address, AddressFormData } from '../types/address'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder')
const CAUTION_AMOUNT = 100

type AnemometerStep = 'info' | 'account' | 'address' | 'payment' | 'confirmation'

export default function Anemometer() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [step, setStep] = useState<AnemometerStep>('info')
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const selectedAddress = addresses.find(a => a.addressId === selectedAddressId)

  const getToken = async (): Promise<string> => {
    const session = await fetchAuthSession()
    return session.tokens?.idToken?.toString() || ''
  }

  const loadAddresses = async () => {
    if (!isAuthenticated) return
    try {
      setIsLoadingAddresses(true)
      const token = await getToken()
      const data = await addressService.getAddresses(token)
      setAddresses(data)
      const defaultAddr = data.find(a => a.isDefault)
      if (defaultAddr) setSelectedAddressId(defaultAddr.addressId)
      else if (data.length > 0) setSelectedAddressId(data[0].addressId)
    } catch (error) {
      console.error('Erreur chargement adresses:', error)
    } finally {
      setIsLoadingAddresses(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && step === 'address') {
      loadAddresses()
    }
  }, [isAuthenticated, step])

  const handleStartOrder = () => {
    if (isAuthenticated) {
      setStep('address')
    } else {
      setStep('account')
    }
  }

  const handleAddressSubmit = async () => {
    if (!selectedAddress) return
    setIsLoading(true)
    setApiError(null)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || ''
      const token = await getToken()
      const response = await fetch(`${apiUrl}/payments/create-anemometer-intent`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: CAUTION_AMOUNT,
          type: 'anemometer_loan',
          shippingAddress: {
            firstName: selectedAddress.firstName,
            lastName: selectedAddress.lastName,
            email: user?.email,
            phone: selectedAddress.phone,
            addressLine1: selectedAddress.addressLine1,
            addressLine2: selectedAddress.addressLine2,
            postalCode: selectedAddress.postalCode,
            city: selectedAddress.city,
          },
        }),
      })
      if (!response.ok) throw new Error('Erreur lors de la création du paiement')
      const { clientSecret: secret } = await response.json()
      setClientSecret(secret)
      setStep('payment')
    } catch {
      console.warn('API not available, using demo mode')
      setClientSecret('demo_client_secret')
      setStep('payment')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveAddress = async (data: AddressFormData) => {
    try {
      const token = await getToken()
      const newAddress = await addressService.createAddress(data, token)
      await loadAddresses()
      setSelectedAddressId(newAddress.addressId)
      setShowAddressForm(false)
    } catch (error) {
      console.error('Erreur création adresse:', error)
      throw error
    }
  }

  const handlePaymentSuccess = () => setStep('confirmation')
  const handlePaymentError = (msg: string) => setApiError(msg)

  const formatPrice = (price: number) => 
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)

  // Confirmation step
  if (step === 'confirmation') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-lg mx-auto text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Demande de prêt confirmée !</h1>
          <p className="text-gray-600 mb-4">
            Merci {user?.name || selectedAddress?.firstName} ! Votre demande de prêt d'anémomètre a bien été enregistrée.
          </p>
          <p className="text-gray-600 mb-8">
            Vous recevrez un email de confirmation à <strong>{user?.email}</strong> avec
            les instructions de mise en place et le suivi de livraison.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-green-800">
              <strong>Rappel :</strong> La caution de {formatPrice(CAUTION_AMOUNT)} sera
              automatiquement remboursée à réception de l'anémomètre en bon état.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/mon-compte" className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors">
              Suivre ma demande
            </Link>
            <Link to="/calculateur" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors">
              Accéder au calculateur
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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Prêt d'Anémomètre Gratuit</h1>
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
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Comment ça marche ?</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">1</div>
                <h4 className="font-medium text-gray-900 mb-1">Créez votre compte</h4>
                <p className="text-sm text-gray-600">Gratuit et sans engagement, pour suivre votre demande.</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">2</div>
                <h4 className="font-medium text-gray-900 mb-1">Commandez</h4>
                <p className="text-sm text-gray-600">Choisissez votre adresse et payez la caution de {formatPrice(CAUTION_AMOUNT)}.</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">3</div>
                <h4 className="font-medium text-gray-900 mb-1">Mesurez</h4>
                <p className="text-sm text-gray-600">Installez-le et relevez les données pendant 1 mois.</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">4</div>
                <h4 className="font-medium text-gray-900 mb-1">Retournez</h4>
                <p className="text-sm text-gray-600">Renvoyez-le avec le bon prépayé et récupérez votre caution.</p>
              </div>
            </div>
          </div>

          {/* Info box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex gap-4">
              <Info className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Pourquoi mesurer le vent sur votre site ?</h3>
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
              onClick={handleStartOrder}
              disabled={authLoading}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-semibold text-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
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

      {/* Account step - shown when not authenticated */}
      {step === 'account' && (
        <div className="max-w-lg mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4">
                <User className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Créez votre espace client gratuit</h2>
              <p className="text-gray-600">Pour commander votre anémomètre</p>
            </div>

            {/* Reassurance box */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-emerald-800 mb-3">
                ✨ Aucun engagement ! Votre espace client vous permet de :
              </p>
              <ul className="space-y-2 text-sm text-emerald-700">
                <li className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-emerald-600" />
                  Suivre votre demande de prêt d'anémomètre
                </li>
                <li className="flex items-center gap-2">
                  <Save className="h-4 w-4 text-emerald-600" />
                  Sauvegarder vos simulations de production
                </li>
                <li className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-emerald-600" />
                  Affiner vos estimations grâce aux données réelles de l'anémomètre
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <Link
                to="/inscription"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-colors"
              >
                Créer mon compte gratuit
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/connexion?redirect=/anemometre"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
              >
                J'ai déjà un compte
              </Link>
            </div>

            <p className="text-center text-xs text-gray-500 mt-4">
              Après inscription, accédez au prêt d'anémomètre depuis votre espace client.
            </p>

            <button
              onClick={() => setStep('info')}
              className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700"
            >
              ← Retour aux informations
            </button>
          </div>
        </div>
      )}

      {/* Address selection step */}
      {step === 'address' && (
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-medium">✓</div>
              <span className="ml-2 text-sm font-medium text-gray-900">Compte</span>
            </div>
            <div className="w-12 h-0.5 bg-primary mx-3" />
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-medium">2</div>
              <span className="ml-2 text-sm font-medium text-gray-900">Adresse</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-200 mx-3" />
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-medium">3</div>
              <span className="ml-2 text-sm font-medium text-gray-500">Paiement</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Adresse de livraison</h2>
              <button
                onClick={() => setShowAddressForm(true)}
                className="flex items-center gap-2 text-primary hover:text-primary-dark font-medium text-sm"
              >
                <Plus className="h-4 w-4" />
                Nouvelle adresse
              </button>
            </div>

            {isLoadingAddresses ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                <p className="text-gray-600 mt-4">Chargement des adresses...</p>
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Aucune adresse enregistrée</p>
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Ajouter une adresse
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <label
                    key={address.addressId}
                    className={`block border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedAddressId === address.addressId
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === address.addressId}
                        onChange={() => setSelectedAddressId(address.addressId)}
                        className="mt-1 text-primary focus:ring-primary"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{address.label}</span>
                          {address.isDefault && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Par défaut</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {address.firstName} {address.lastName}<br />
                          {address.addressLine1}<br />
                          {address.addressLine2 && <>{address.addressLine2}<br /></>}
                          {address.postalCode} {address.city}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* Summary box */}
            {addresses.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 mt-6">
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
                </ul>
                <hr className="my-3 border-gray-200" />
                <div className="flex justify-between font-semibold text-gray-900">
                  <span>Caution (remboursable)</span>
                  <span>{formatPrice(CAUTION_AMOUNT)}</span>
                </div>
              </div>
            )}

            {/* Prepaid return notice */}
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg mt-6">
              <Truck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">
                <strong>Bon de retour prépayé inclus :</strong> À la fin de la période de prêt,
                utilisez simplement l'étiquette de retour fournie. Aucun frais d'expédition à votre charge.
              </p>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => setStep('info')}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
              >
                Retour
              </button>
              <button
                onClick={handleAddressSubmit}
                disabled={isLoading || !selectedAddressId}
                className="flex-1 py-3 px-4 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Chargement...' : 'Continuer vers le paiement'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment step */}
      {step === 'payment' && clientSecret && (
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-medium">✓</div>
              <span className="ml-2 text-sm font-medium text-gray-900">Compte</span>
            </div>
            <div className="w-12 h-0.5 bg-green-500 mx-3" />
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-medium">✓</div>
              <span className="ml-2 text-sm font-medium text-gray-900">Adresse</span>
            </div>
            <div className="w-12 h-0.5 bg-primary mx-3" />
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-medium">3</div>
              <span className="ml-2 text-sm font-medium text-gray-900">Paiement</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Paiement de la caution</h2>

            {apiError && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{apiError}</p>
              </div>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-amber-800">
                <strong>Caution de {formatPrice(CAUTION_AMOUNT)} :</strong> Ce montant sera
                automatiquement remboursé sur votre carte bancaire à réception de l'anémomètre
                en bon état de fonctionnement.
              </p>
            </div>

            {clientSecret === 'demo_client_secret' ? (
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
                  appearance: { theme: 'stripe', variables: { colorPrimary: '#065f46' } },
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
              onClick={() => setStep('address')}
              className="mt-4 w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              Modifier mon adresse
            </button>
          </div>
        </div>
      )}

      {/* Address Form Modal */}
      {showAddressForm && (
        <AddressForm
          onSave={handleSaveAddress}
          onCancel={() => setShowAddressForm(false)}
        />
      )}
    </div>
  )
}
