import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Address, AddressFormData } from '../../types/address';

interface AddressFormProps {
  address?: Address;
  onSave: (data: AddressFormData) => Promise<void>;
  onCancel: () => void;
}

export default function AddressForm({ address, onSave, onCancel }: AddressFormProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    label: '',
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    postalCode: '',
    city: '',
    country: 'France',
    phone: '',
    isDefault: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (address) {
      setFormData({
        label: address.label,
        firstName: address.firstName,
        lastName: address.lastName,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || '',
        postalCode: address.postalCode,
        city: address.city,
        country: address.country,
        phone: address.phone,
        isDefault: address.isDefault,
      });
    }
  }, [address]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.label.trim()) {
      newErrors.label = 'Le libellé est obligatoire';
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est obligatoire';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est obligatoire';
    }
    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = 'L\'adresse est obligatoire';
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Le code postal est obligatoire';
    } else if (!/^\d{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Le code postal doit contenir 5 chiffres';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'La ville est obligatoire';
    }
    if (!formData.country.trim()) {
      newErrors.country = 'Le pays est obligatoire';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est obligatoire';
    } else if (!/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(formData.phone)) {
      newErrors.phone = 'Format de téléphone invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {address ? 'Modifier l\'adresse' : 'Ajouter une adresse'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Label */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Libellé *
              </label>
              <input
                type="text"
                name="label"
                value={formData.label}
                onChange={handleChange}
                placeholder="Maison, Bureau, etc."
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none ${
                  errors.label ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.label && (
                <p className="text-red-500 text-sm mt-1">{errors.label}</p>
              )}
            </div>

            {/* Prénom et Nom */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Adresse ligne 1 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Adresse *
              </label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                placeholder="Numéro et nom de rue"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none ${
                  errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.addressLine1 && (
                <p className="text-red-500 text-sm mt-1">{errors.addressLine1}</p>
              )}
            </div>

            {/* Adresse ligne 2 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Complément d'adresse
              </label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                placeholder="Appartement, bâtiment, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none"
              />
            </div>

            {/* Code postal et Ville */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Code postal *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  maxLength={5}
                  placeholder="75001"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none ${
                    errors.postalCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ville *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>
            </div>

            {/* Pays */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pays *
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none ${
                  errors.country ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Suisse">Suisse</option>
                <option value="Luxembourg">Luxembourg</option>
              </select>
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country}</p>
              )}
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Téléphone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="06 12 34 56 78"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Adresse par défaut */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                id="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-600"
              />
              <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                Définir comme adresse par défaut
              </label>
            </div>

            {/* Boutons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-emerald-700 text-white py-3 px-6 rounded-full hover:bg-emerald-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-full hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
