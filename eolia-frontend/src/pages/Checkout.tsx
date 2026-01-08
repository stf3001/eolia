import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { ArrowLeft, ShoppingBag, AlertTriangle, CheckCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'
import CheckoutForm, { TGBT_FORFAITS } from '../components/shop/CheckoutForm'
import type { CheckoutFormData, TGBTDistance } from '../components/shop/CheckoutForm'
import PaymentForm from '../components/shop/PaymentForm'

// Initialize Stripe (use env variable in production)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder')

type CheckoutStep = 'details' | 'payment' | 'confirmation'

export default function Checkout() {
  const navigate = useNavigate()
  const { items, totalPrice, totalKwc, isOverLimit, clearCart } = useCart()
  const [step, setStep] = useState<CheckoutStep>('details')
  const [formData, setFormData] = useState<CheckoutFormData | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculate installation forfait price
  const installationPrice = formData?.tgbtDistance
    ? TGBT_FORFAITS[formData.tgbtDistance as TGBTDistance]?.price || 0
    : 0

  const grandTotal = totalPrice + installationPrice

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && step !== 'confirmation') {
      navigate('/panier')
    }
  }, [items, navigate, step])

  const handleFormSubmit = async (data: CheckoutFormData) => {
    setFormData(data)
    setIsLoading(true)
    setError(null)

    try {
      // In production, this would call your backend to create a PaymentIntent
      // For now, we'll simulate the API call
      const apiUrl = import.meta.env.VITE_API_URL || ''
      const response = await fetch(`${apiUrl}/payments/create-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: grandTotal,
          items: items.map(item => ({
            productId: item.product.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
          installationDetails: {
            installationType: data.installationType,
            meterPower: data.meterPower,
            tgbtDistance: data.tgbtDistance,
          },
          shippingAddress: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            addressLine1: data.addressLine1,
            addressLine2: data.addressLine2,
            postalCode: data.postalCode,
            city: data.city,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création du paiement')
      }

      const { clientSecret: secret } = await response.json()
      setClientSecret(secret)
      setStep('payment')
    } catch (err) {
      // For demo purposes, simulate a client secret
      // In production, remove this and handle the error properly
      console.warn('API not available, using demo mode')
      setClientSecret('demo_client_secret')
      setStep('payment')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    clearCart()
    setStep('confirmation')
  }

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage)
  }

  // Redirect if over kWc limit
  if (isOverLimit) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-lg mx-auto text-center">
          <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Puissance supérieure à 36 kWc
          </h1>
          <p className="text-gray-600 mb-8">
            Votre panier contient {totalKwc} kWc de puissance totale.
            Pour les installations de plus de 36 kWc, veuillez nous contacter pour un devis personnalisé.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/diagnostic"
              className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors"
            >
              Nous consulter
            </Link>
            <Link
              to="/panier"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              Retour au panier
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Confirmation step
  if (step === 'confirmation') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-lg mx-auto text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Commande confirmée !
          </h1>
          <p className="text-gray-600 mb-8">
            Merci pour votre commande. Vous recevrez un email de confirmation avec les détails
            de votre commande et les prochaines étapes.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Notre équipe vous contactera sous 48h pour valider les détails techniques
            de votre installation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/espace-client"
              className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors"
            >
              Voir mes commandes
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
      <div className="mb-8">
        <Link
          to="/panier"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au panier
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Finaliser ma commande</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
              step === 'details' ? 'bg-primary text-white' : 'bg-green-500 text-white'
            }`}
          >
            {step === 'details' ? '1' : '✓'}
          </div>
          <span className="ml-2 text-sm font-medium text-gray-900">Informations</span>
        </div>
        <div className="w-16 h-0.5 bg-gray-200 mx-4" />
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
              step === 'payment' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
            }`}
          >
            2
          </div>
          <span className={`ml-2 text-sm font-medium ${step === 'payment' ? 'text-gray-900' : 'text-gray-500'}`}>
            Paiement
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {step === 'details' && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <CheckoutForm onSubmit={handleFormSubmit} isLoading={isLoading} />
            </div>
          )}

          {step === 'payment' && clientSecret && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              {clientSecret === 'demo_client_secret' ? (
                // Demo mode - show a simulated payment form
                <div className="space-y-6">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <strong>Mode démo :</strong> Le backend de paiement n'est pas encore configuré.
                      Cliquez sur le bouton ci-dessous pour simuler un paiement réussi.
                    </p>
                  </div>
                  <button
                    onClick={handlePaymentSuccess}
                    className="w-full py-4 px-6 bg-primary text-white rounded-full font-semibold text-lg hover:bg-primary-dark transition-colors"
                  >
                    Simuler le paiement de {formatPrice(grandTotal)}
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
                  <PaymentForm
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    totalAmount={grandTotal}
                  />
                </Elements>
              )}

              <button
                onClick={() => setStep('details')}
                className="mt-4 w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
              >
                Modifier mes informations
              </button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Récapitulatif
            </h2>

            {/* Items */}
            <ul className="space-y-3 mb-6">
              {items.map((item) => (
                <li key={item.product.productId} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <hr className="border-gray-200 mb-4" />

            {/* Subtotals */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sous-total produits</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              {formData && installationPrice > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Forfait pose ({TGBT_FORFAITS[formData.tgbtDistance as TGBTDistance]?.label})
                  </span>
                  <span>{formatPrice(installationPrice)}</span>
                </div>
              )}
              {totalKwc > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Puissance totale</span>
                  <span className="text-primary font-medium">{totalKwc} kWc</span>
                </div>
              )}
            </div>

            <hr className="border-gray-200 mb-4" />

            {/* Total */}
            <div className="flex justify-between text-lg font-semibold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              TVA incluse. Livraison calculée à la prochaine étape.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
