import { useState } from 'react';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { dossierService, type SubmitVTRequest } from '../../services/dossierService';
import PhotoUploader from '../../components/tracking/PhotoUploader';
import type { Dossier, VTFormData } from '../../types/dossier';
import { roofTypeOptions, electricalDistanceOptions, obstacleOptions } from '../../types/dossier';

interface VTFormProps {
  orderId: string;
  onSubmitSuccess: (dossier: Dossier) => void;
}

export default function VTForm({ orderId, onSubmitSuccess }: VTFormProps) {
  const [formData, setFormData] = useState<Partial<VTFormData>>({
    roofType: undefined,
    mountingHeight: undefined,
    electricalDistance: undefined,
    obstacles: [],
    comments: '',
    photoIds: [],
  });
  
  const [photoIds, setPhotoIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof VTFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleObstacleToggle = (obstacle: string) => {
    setFormData(prev => {
      const currentObstacles = prev.obstacles || [];
      const newObstacles = currentObstacles.includes(obstacle)
        ? currentObstacles.filter(o => o !== obstacle)
        : [...currentObstacles, obstacle];
      return { ...prev, obstacles: newObstacles };
    });
  };

  const handlePhotosChange = (ids: string[]) => {
    setPhotoIds(ids);
    // Clear photo validation error
    if (validationErrors.photos) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.photos;
        return newErrors;
      });
    }
  };

  // Requirement 5.2: Validation des champs obligatoires
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.roofType) {
      errors.roofType = 'Veuillez sélectionner le type de toiture';
    }

    if (!formData.mountingHeight || formData.mountingHeight <= 0) {
      errors.mountingHeight = 'Veuillez indiquer la hauteur du point de fixation';
    }

    if (!formData.electricalDistance) {
      errors.electricalDistance = 'Veuillez sélectionner la distance au tableau électrique';
    }

    // Requirement 4.6: Minimum 3 photos
    if (photoIds.length < 3) {
      errors.photos = `Minimum 3 photos requises (actuellement : ${photoIds.length})`;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const vtData: SubmitVTRequest = {
        roofType: formData.roofType!,
        mountingHeight: formData.mountingHeight!,
        electricalDistance: formData.electricalDistance!,
        obstacles: formData.obstacles || [],
        comments: formData.comments,
        photoIds: photoIds,
      };

      const updatedDossier = await dossierService.submitVT(orderId, vtData);
      onSubmitSuccess(updatedDossier);
    } catch (err) {
      console.error('Erreur soumission VT:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la soumission');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Erreur</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Requirement 5.1: Type de toiture */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type de toiture <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.roofType || ''}
          onChange={(e) => handleInputChange('roofType', e.target.value || undefined)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
            validationErrors.roofType ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Sélectionnez...</option>
          {roofTypeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {validationErrors.roofType && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.roofType}</p>
        )}
      </div>

      {/* Requirement 5.1: Hauteur estimée */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hauteur estimée du point de fixation (en mètres) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          min="0"
          step="0.5"
          value={formData.mountingHeight || ''}
          onChange={(e) => handleInputChange('mountingHeight', parseFloat(e.target.value) || undefined)}
          placeholder="Ex: 8.5"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
            validationErrors.mountingHeight ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {validationErrors.mountingHeight && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.mountingHeight}</p>
        )}
      </div>

      {/* Requirement 5.1: Distance au tableau électrique */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Distance au tableau électrique <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.electricalDistance || ''}
          onChange={(e) => handleInputChange('electricalDistance', e.target.value || undefined)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
            validationErrors.electricalDistance ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Sélectionnez...</option>
          {electricalDistanceOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {validationErrors.electricalDistance && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.electricalDistance}</p>
        )}
      </div>

      {/* Requirement 5.1: Présence d'obstacles */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Présence d'obstacles à proximité
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {obstacleOptions.map(option => (
            <label
              key={option.value}
              className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                formData.obstacles?.includes(option.value)
                  ? 'bg-orange-50 border-orange-500'
                  : 'bg-white border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.obstacles?.includes(option.value) || false}
                onChange={() => handleObstacleToggle(option.value)}
                className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Requirement 5.1: Commentaires libres */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Commentaires (optionnel)
        </label>
        <textarea
          value={formData.comments || ''}
          onChange={(e) => handleInputChange('comments', e.target.value)}
          rows={3}
          placeholder="Informations complémentaires sur le site d'installation..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
        />
      </div>

      {/* Requirement 5.3: Upload photos avec PhotoUploader */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photos du site <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-500 mb-3">
          Prenez des photos de l'emplacement prévu pour l'éolienne, du tableau électrique, 
          et de l'environnement proche (minimum 3 photos).
        </p>
        <PhotoUploader
          orderId={orderId}
          dossierType="installation_vt"
          maxPhotos={10}
          minPhotos={3}
          onUploadComplete={handlePhotosChange}
          existingPhotos={[]}
        />
        {validationErrors.photos && (
          <p className="mt-2 text-sm text-red-600">{validationErrors.photos}</p>
        )}
      </div>

      {/* Submit button */}
      <div className="pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Enregistrer la visite technique
            </>
          )}
        </button>
        <p className="text-xs text-gray-500 text-center mt-2">
          Vous pourrez valider et envoyer au bureau d'études après l'enregistrement.
        </p>
      </div>
    </form>
  );
}
