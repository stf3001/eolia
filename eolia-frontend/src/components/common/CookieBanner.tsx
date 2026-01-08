import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X, Cookie, Settings } from 'lucide-react'

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

const COOKIE_CONSENT_KEY = 'eolia_consent'

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false
  })

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      setIsVisible(true)
    } else {
      try {
        const saved = JSON.parse(consent)
        setPreferences(saved)
      } catch {
        setIsVisible(true)
      }
    }
  }, [])

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs))
    setPreferences(prefs)
    setIsVisible(false)
    
    // Ici on pourrait activer/désactiver les scripts analytics/marketing
    if (prefs.analytics) {
      // Activer Google Analytics
      console.log('Analytics enabled')
    }
    if (prefs.marketing) {
      // Activer cookies marketing
      console.log('Marketing enabled')
    }
  }

  const acceptAll = () => {
    savePreferences({ necessary: true, analytics: true, marketing: true })
  }

  const rejectAll = () => {
    savePreferences({ necessary: true, analytics: false, marketing: false })
  }

  const saveCustom = () => {
    savePreferences(preferences)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {!showSettings ? (
          // Vue principale
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Cookie className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Nous utilisons des cookies 🍪
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Ce site utilise des cookies pour améliorer votre expérience, analyser le trafic 
                  et personnaliser le contenu. Vous pouvez accepter tous les cookies ou personnaliser 
                  vos préférences.{' '}
                  <Link to="/politique-cookies" className="text-primary hover:underline">
                    En savoir plus
                  </Link>
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={acceptAll}
                    className="px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Tout accepter
                  </button>
                  <button
                    onClick={rejectAll}
                    className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Refuser
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="px-5 py-2.5 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Personnaliser
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Vue paramètres
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Paramètres des cookies</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              {/* Cookies nécessaires */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Cookies nécessaires</p>
                  <p className="text-sm text-gray-500">
                    Indispensables au fonctionnement du site
                  </p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="sr-only"
                  />
                  <div className="w-11 h-6 bg-primary rounded-full opacity-50 cursor-not-allowed">
                    <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full" />
                  </div>
                </div>
              </div>

              {/* Cookies analytiques */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Cookies analytiques</p>
                  <p className="text-sm text-gray-500">
                    Nous aident à comprendre comment vous utilisez le site
                  </p>
                </div>
                <button
                  onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                  className="relative"
                >
                  <div className={`w-11 h-6 rounded-full transition-colors ${
                    preferences.analytics ? 'bg-primary' : 'bg-gray-300'
                  }`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      preferences.analytics ? 'right-0.5' : 'left-0.5'
                    }`} />
                  </div>
                </button>
              </div>

              {/* Cookies marketing */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Cookies marketing</p>
                  <p className="text-sm text-gray-500">
                    Permettent d'afficher des publicités personnalisées
                  </p>
                </div>
                <button
                  onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                  className="relative"
                >
                  <div className={`w-11 h-6 rounded-full transition-colors ${
                    preferences.marketing ? 'bg-primary' : 'bg-gray-300'
                  }`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      preferences.marketing ? 'right-0.5' : 'left-0.5'
                    }`} />
                  </div>
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={saveCustom}
                className="flex-1 px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
              >
                Enregistrer mes préférences
              </button>
              <button
                onClick={acceptAll}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Tout accepter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
