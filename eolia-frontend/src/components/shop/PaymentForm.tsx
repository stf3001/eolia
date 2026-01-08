import { useState } from 'react'
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { AlertCircle, Lock, CreditCard } from 'lucide-react'

interface PaymentFormProps {
  onSuccess: () => void
  onError: (error: string) => void
  totalAmount: number
}

export default function PaymentForm({ onSuccess, onError, totalAmount }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setErrorMessage(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/commande/confirmation`,
      },
    })

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setErrorMessage(error.message || 'Une erreur est survenue')
        onError(error.message || 'Une erreur est survenue')
      } else {
        setErrorMessage('Une erreur inattendue est survenue')
        onError('Une erreur inattendue est survenue')
      }
      setIsProcessing(false)
    } else {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Paiement sécurisé
        </h3>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <PaymentElement
            options={{
              layout: 'tabs',
            }}
          />
        </div>

        {errorMessage && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        )}
      </div>

      {/* Suspensive conditions notice */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Conditions suspensives :</strong> Cette commande est suspensive à la validation
          technique de votre installation et à l'accord de la mairie si nécessaire. En cas de
          refus, vous serez intégralement remboursé.
        </p>
      </div>

      {/* Security badges */}
      <div className="flex items-center justify-center gap-4 text-gray-500 text-sm">
        <div className="flex items-center gap-1">
          <Lock className="h-4 w-4" />
          <span>Paiement sécurisé</span>
        </div>
        <span>•</span>
        <span>3D Secure</span>
        <span>•</span>
        <span>Stripe</span>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-4 px-6 bg-primary text-white rounded-full font-semibold text-lg hover:bg-primary-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Traitement en cours...
          </span>
        ) : (
          `Payer ${formatPrice(totalAmount)}`
        )}
      </button>
    </form>
  )
}
