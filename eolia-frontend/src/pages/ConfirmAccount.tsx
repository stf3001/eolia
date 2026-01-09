import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Mail, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function ConfirmAccount() {
  const location = useLocation()
  const { confirmSignUp, resendCode, isLoading, error, clearError } = useAuth()

  // Get email and redirect from location state
  const emailFromState = (location.state as { email?: string })?.email || ''
  const redirectFromState = (location.state as { redirect?: string })?.redirect

  const [email, setEmail] = useState(emailFromState)
  const [code, setCode] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  // Clear resend success message after 5 seconds
  useEffect(() => {
    if (resendSuccess) {
      const timer = setTimeout(() => setResendSuccess(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [resendSuccess])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    clearError()

    // Validation
    if (!email.trim()) {
      setLocalError('Veuillez entrer votre email')
      return
    }
    if (!code.trim()) {
      setLocalError('Veuillez entrer le code de vérification')
      return
    }
    if (!/^\d{6}$/.test(code)) {
      setLocalError('Le code doit contenir 6 chiffres')
      return
    }

    try {
      await confirmSignUp(email, code)
      setIsConfirmed(true)
    } catch {
      // Error is handled by AuthContext
    }
  }

  const handleResendCode = async () => {
    if (!email.trim()) {
      setLocalError('Veuillez entrer votre email')
      return
    }

    setIsResending(true)
    setLocalError(null)
    clearError()

    try {
      await resendCode(email)
      setResendSuccess(true)
    } catch {
      // Error is handled by AuthContext
    } finally {
      setIsResending(false)
    }
  }

  const displayError = localError || error

  // Success state
  if (isConfirmed) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Compte confirmé !</h1>
          <p className="text-gray-600 mb-8">
            Votre compte a été vérifié avec succès. Vous pouvez maintenant vous connecter.
          </p>
          <Link
            to={redirectFromState ? `/connexion?redirect=${redirectFromState}` : '/connexion'}
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vérifiez votre email</h1>
          <p className="text-gray-600">
            Nous avons envoyé un code de vérification à 6 chiffres à votre adresse email.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {displayError && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{displayError}</p>
              </div>
            )}

            {resendSuccess && (
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700">
                  Un nouveau code a été envoyé à votre adresse email.
                </p>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="votre@email.com"
                autoComplete="email"
              />
            </div>

            {/* Verification Code */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Code de vérification
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => {
                  // Only allow digits
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                  setCode(value)
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-center text-2xl tracking-widest font-mono"
                placeholder="000000"
                maxLength={6}
                autoComplete="one-time-code"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading ? (
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
                  Vérification...
                </span>
              ) : (
                'Vérifier mon compte'
              )}
            </button>
          </form>

          {/* Resend code */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Vous n'avez pas reçu le code ?</p>
            <button
              onClick={handleResendCode}
              disabled={isResending}
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline disabled:text-gray-400 disabled:no-underline"
            >
              <RefreshCw className={`h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
              {isResending ? 'Envoi en cours...' : 'Renvoyer le code'}
            </button>
          </div>

          {/* Back to login */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm">
            <Link to={redirectFromState ? `/connexion?redirect=${redirectFromState}` : '/connexion'} className="text-gray-600 hover:text-primary">
              ← Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
