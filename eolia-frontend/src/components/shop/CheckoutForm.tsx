import { useState } from 'react'
import { MapPin, Zap, Cable } from 'lucide-react'

export type TGBTDistance = '<30m' | '30-60m' | '60-100m' | '>100m'
export type InstallationType = 'mono' | 'tri'

export interface CheckoutFormData {
  // Address
  firstName: string
  lastName: string
  email: string
  phone: string
  addressLine1: string
  addressLine2: string
  postalCode: string
  city: string
  // Installation details
  installationType: InstallationType
  meterPower: number
  tgbtDistance: TGBTDistance
}

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void
  isLoading?: boolean
}

const TGBT_FORFAITS: Record<TGBTDistance, { label: string; price: number | null }> = {
  '<30m': { label: 'Moins de 30 mètres', price: 2490 },
  '30-60m': { label: '30 à 60 mètres', price: 3290 },
  '60-100m': { label: '60 à 100 mètres', price: 4490 },
  '>100m': { label: 'Plus de 100 mètres', price: null },
}

const METER_POWERS = [3, 6, 9, 12, 15, 18, 24, 36]

export default function CheckoutForm({ onSubmit, isLoading }: CheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    postalCode: '',
    city: '',
    installationType: 'mono',
    meterPower: 6,
    tgbtDistance: '<30m',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof CheckoutFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {}

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  const selectedForfait = TGBT_FORFAITS[formData.tgbtDistance]
  const isOverDistance = formData.tgbtDistance === '>100m'

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Informations de livraison
        </h3>
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

        <div className="mt-4">
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
        <div className="mt-4">
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
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
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
      </div>

      {/* Installation Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Détails de l'installation
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="installationType" className="block text-sm font-medium text-gray-700 mb-1">
              Type d'installation *
            </label>
            <select
              id="installationType"
              name="installationType"
              value={formData.installationType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="mono">Monophasé</option>
              <option value="tri">Triphasé</option>
            </select>
          </div>
          <div>
            <label htmlFor="meterPower" className="block text-sm font-medium text-gray-700 mb-1">
              Puissance compteur (kVA) *
            </label>
            <select
              id="meterPower"
              name="meterPower"
              value={formData.meterPower}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {METER_POWERS.map(power => (
                <option key={power} value={power}>{power} kVA</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* TGBT Distance */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Cable className="h-5 w-5 text-primary" />
          Distance au TGBT
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Distance entre l'éolienne et le Tableau Général Basse Tension (TGBT) de votre installation.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {(Object.entries(TGBT_FORFAITS) as [TGBTDistance, { label: string; price: number | null }][]).map(
            ([key, { label, price }]) => (
              <label
                key={key}
                className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.tgbtDistance === key
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="tgbtDistance"
                  value={key}
                  checked={formData.tgbtDistance === key}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="flex-1">
                  <span className="font-medium text-gray-900">{label}</span>
                  {price ? (
                    <span className="block text-sm text-primary mt-1">
                      Forfait pose : {price.toLocaleString('fr-FR')} €
                    </span>
                  ) : (
                    <span className="block text-sm text-amber-600 mt-1">
                      Nous consulter
                    </span>
                  )}
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.tgbtDistance === key ? 'border-primary' : 'border-gray-300'
                  }`}
                >
                  {formData.tgbtDistance === key && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  )}
                </div>
              </label>
            )
          )}
        </div>

        {isOverDistance && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              Pour les distances supérieures à 100 mètres, un devis personnalisé est nécessaire.
              Veuillez nous contacter pour étudier votre projet.
            </p>
          </div>
        )}

        {!isOverDistance && selectedForfait.price && (
          <p className="mt-4 text-sm text-gray-600">
            Le forfait pose inclut : déclaration préalable mairie, demande raccordement Enedis,
            attestation Consuel, mise en service et formation utilisateur.
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading || isOverDistance}
        className={`w-full py-3 px-4 rounded-full font-medium transition-colors ${
          isOverDistance
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-primary text-white hover:bg-primary-dark'
        }`}
      >
        {isLoading ? 'Chargement...' : isOverDistance ? 'Nous consulter' : 'Continuer vers le paiement'}
      </button>
    </form>
  )
}

export { TGBT_FORFAITS }
