import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  MapPin, Home, Trees, Ruler, CheckCircle, ArrowRight, ArrowLeft,
  Wind, AlertTriangle, Phone, Mail
} from 'lucide-react'

type Step = 1 | 2 | 3 | 4 | 5

interface DiagnosticData {
  // Étape 1 - Localisation
  department: string
  postalCode: string
  city: string
  // Étape 2 - Type de support
  supportType: 'ground' | 'roof' | 'pole' | ''
  groundType: 'garden' | 'field' | 'concrete' | ''
  // Étape 3 - Environnement
  environment: 'open' | 'suburban' | 'urban' | ''
  obstacles: string[]
  // Étape 4 - Hauteur et espace
  availableHeight: string
  availableSpace: string
  distanceToHouse: string
}

const initialData: DiagnosticData = {
  department: '',
  postalCode: '',
  city: '',
  supportType: '',
  groundType: '',
  environment: '',
  obstacles: [],
  availableHeight: '',
  availableSpace: '',
  distanceToHouse: ''
}

export default function Diagnostic() {
  const [step, setStep] = useState<Step>(1)
  const [data, setData] = useState<DiagnosticData>(initialData)
  const [submitted, setSubmitted] = useState(false)

  const updateData = (field: keyof DiagnosticData, value: string | string[]) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const toggleObstacle = (obstacle: string) => {
    setData(prev => ({
      ...prev,
      obstacles: prev.obstacles.includes(obstacle)
        ? prev.obstacles.filter(o => o !== obstacle)
        : [...prev.obstacles, obstacle]
    }))
  }

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5) as Step)
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1) as Step)

  const handleSubmit = () => {
    setSubmitted(true)
  }

  const getScore = (): { score: number; label: string; color: string } => {
    let score = 100
    if (data.environment === 'urban') score -= 30
    else if (data.environment === 'suburban') score -= 15
    if (data.obstacles.length > 2) score -= 20
    else if (data.obstacles.length > 0) score -= 10
    if (data.availableHeight === 'less6') score -= 20
    if (data.supportType === 'roof') score -= 10
    
    if (score >= 80) return { score, label: 'Excellent', color: 'text-green-600' }
    if (score >= 60) return { score, label: 'Bon', color: 'text-primary' }
    if (score >= 40) return { score, label: 'Moyen', color: 'text-amber-600' }
    return { score, label: 'Difficile', color: 'text-red-600' }
  }


  if (submitted) {
    const result = getScore()
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${
                result.score >= 60 ? 'bg-green-100' : 'bg-amber-100'
              } mb-4`}>
                {result.score >= 60 ? (
                  <CheckCircle className="w-10 h-10 text-green-600" />
                ) : (
                  <AlertTriangle className="w-10 h-10 text-amber-600" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Résultat de votre diagnostic
              </h2>
              <p className="text-gray-600">
                Potentiel éolien de votre site
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700 font-medium">Score global</span>
                <span className={`text-2xl font-bold ${result.color}`}>
                  {result.score}/100 - {result.label}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${
                    result.score >= 80 ? 'bg-green-500' :
                    result.score >= 60 ? 'bg-primary' :
                    result.score >= 40 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${result.score}%` }}
                />
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-gray-900">Récapitulatif</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-500">Localisation</span>
                  <p className="font-medium">{data.city || data.postalCode} ({data.department})</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-500">Type de support</span>
                  <p className="font-medium">
                    {data.supportType === 'ground' ? 'Sol' : 
                     data.supportType === 'roof' ? 'Toiture' : 'Poteau'}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-500">Environnement</span>
                  <p className="font-medium">
                    {data.environment === 'open' ? 'Zone dégagée' :
                     data.environment === 'suburban' ? 'Péri-urbain' : 'Urbain'}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-500">Hauteur disponible</span>
                  <p className="font-medium">
                    {data.availableHeight === 'less6' ? '< 6m' :
                     data.availableHeight === '6to10' ? '6-10m' : '> 10m'}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Prochaines étapes</h3>
              <div className="space-y-3">
                <Link
                  to="/calculateur"
                  className="flex items-center justify-between p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <div className="flex items-center">
                    <Wind className="w-5 h-5 text-primary mr-3" />
                    <span className="font-medium text-gray-900">Estimer ma production</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary" />
                </Link>
                <Link
                  to="/anemometre"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <Wind className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="font-medium text-gray-900">Commander un anémomètre</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </Link>
              </div>
            </div>

            <div className="mt-8 p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-gray-700 mb-3">
                Besoin d'un avis personnalisé ? Contactez notre équipe technique.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="tel:+33123456789" className="flex items-center text-primary text-sm">
                  <Phone className="w-4 h-4 mr-1" /> 01 23 45 67 89
                </a>
                <a href="mailto:technique@eolia.fr" className="flex items-center text-primary text-sm">
                  <Mail className="w-4 h-4 mr-1" /> technique@eolia.fr
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Diagnostic éolien
          </h1>
          <p className="text-gray-600">
            Évaluez le potentiel de votre site en quelques minutes
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`flex items-center justify-center w-10 h-10 rounded-full font-medium ${
                  s < step ? 'bg-primary text-white' :
                  s === step ? 'bg-primary text-white' :
                  'bg-gray-200 text-gray-500'
                }`}
              >
                {s < step ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-primary rounded-full transition-all"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Étape 1 - Localisation */}
          {step === 1 && (
            <div>
              <div className="flex items-center mb-6">
                <MapPin className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Localisation</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Département
                  </label>
                  <select
                    value={data.department}
                    onChange={(e) => updateData('department', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Sélectionnez...</option>
                    <option value="29">29 - Finistère</option>
                    <option value="22">22 - Côtes-d'Armor</option>
                    <option value="56">56 - Morbihan</option>
                    <option value="35">35 - Ille-et-Vilaine</option>
                    <option value="44">44 - Loire-Atlantique</option>
                    <option value="85">85 - Vendée</option>
                    <option value="17">17 - Charente-Maritime</option>
                    <option value="33">33 - Gironde</option>
                    <option value="40">40 - Landes</option>
                    <option value="64">64 - Pyrénées-Atlantiques</option>
                    <option value="11">11 - Aude</option>
                    <option value="66">66 - Pyrénées-Orientales</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code postal
                  </label>
                  <input
                    type="text"
                    value={data.postalCode}
                    onChange={(e) => updateData('postalCode', e.target.value)}
                    placeholder="Ex: 29200"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={data.city}
                    onChange={(e) => updateData('city', e.target.value)}
                    placeholder="Ex: Brest"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}


          {/* Étape 2 - Type de support */}
          {step === 2 && (
            <div>
              <div className="flex items-center mb-6">
                <Home className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Type de support</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600 text-sm mb-4">
                  Où souhaitez-vous installer votre éolienne ?
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'ground', label: 'Au sol', desc: 'Jardin, terrain' },
                    { value: 'roof', label: 'Sur toiture', desc: 'Toit plat ou terrasse' },
                    { value: 'pole', label: 'Sur poteau', desc: 'Mât existant' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => updateData('supportType', option.value)}
                      className={`p-4 rounded-xl border-2 text-center transition-colors ${
                        data.supportType === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="block font-medium text-gray-900">{option.label}</span>
                      <span className="text-xs text-gray-500">{option.desc}</span>
                    </button>
                  ))}
                </div>
                
                {data.supportType === 'ground' && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de sol
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: 'garden', label: 'Jardin / Pelouse' },
                        { value: 'field', label: 'Terrain agricole' },
                        { value: 'concrete', label: 'Dalle béton' }
                      ].map(option => (
                        <button
                          key={option.value}
                          onClick={() => updateData('groundType', option.value)}
                          className={`p-3 rounded-lg border text-sm transition-colors ${
                            data.groundType === option.value
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Étape 3 - Environnement */}
          {step === 3 && (
            <div>
              <div className="flex items-center mb-6">
                <Trees className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Environnement</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de zone
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'open', label: 'Zone dégagée', desc: 'Campagne, bord de mer' },
                      { value: 'suburban', label: 'Péri-urbain', desc: 'Lotissement, village' },
                      { value: 'urban', label: 'Urbain', desc: 'Ville, centre-bourg' }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => updateData('environment', option.value)}
                        className={`p-4 rounded-xl border-2 text-center transition-colors ${
                          data.environment === option.value
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="block font-medium text-gray-900">{option.label}</span>
                        <span className="text-xs text-gray-500">{option.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Obstacles à proximité (dans un rayon de 50m)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Arbres hauts', 'Bâtiments', 'Colline/Relief', 'Lignes électriques', 'Aucun'].map(obstacle => (
                      <button
                        key={obstacle}
                        onClick={() => toggleObstacle(obstacle)}
                        className={`px-4 py-2 rounded-full text-sm transition-colors ${
                          data.obstacles.includes(obstacle)
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {obstacle}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Étape 4 - Hauteur et espace */}
          {step === 4 && (
            <div>
              <div className="flex items-center mb-6">
                <Ruler className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Hauteur et espace</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hauteur de mât envisageable
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'less6', label: '< 6 mètres' },
                      { value: '6to10', label: '6 à 10 mètres' },
                      { value: 'more10', label: '> 10 mètres' }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => updateData('availableHeight', option.value)}
                        className={`p-4 rounded-xl border-2 text-center transition-colors ${
                          data.availableHeight === option.value
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="font-medium text-gray-900">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Espace disponible au sol
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'small', label: '< 10 m²' },
                      { value: 'medium', label: '10 à 50 m²' },
                      { value: 'large', label: '> 50 m²' }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => updateData('availableSpace', option.value)}
                        className={`p-4 rounded-xl border-2 text-center transition-colors ${
                          data.availableSpace === option.value
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="font-medium text-gray-900">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distance à l'habitation la plus proche
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'less10', label: '< 10 mètres' },
                      { value: '10to30', label: '10 à 30 mètres' },
                      { value: 'more30', label: '> 30 mètres' }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => updateData('distanceToHouse', option.value)}
                        className={`p-4 rounded-xl border-2 text-center transition-colors ${
                          data.distanceToHouse === option.value
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="font-medium text-gray-900">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            {step > 1 ? (
              <button
                onClick={prevStep}
                className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Précédent
              </button>
            ) : (
              <div />
            )}
            
            {step < 4 ? (
              <button
                onClick={nextStep}
                className="flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
              >
                Suivant
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
              >
                Voir le résultat
                <CheckCircle className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
