/**
 * Service de validation du formulaire VT (Visite Technique)
 * Requirements: 4.6, 5.2
 */

// Types de toiture valides
export const VALID_ROOF_TYPES = ['flat', 'sloped_tiles', 'sloped_slate', 'metal', 'other'] as const;

// Distances électriques valides
export const VALID_ELECTRICAL_DISTANCES = ['<30m', '30-60m', '60-100m', '>100m'] as const;

// Nombre minimum de photos requis
export const MIN_PHOTOS_REQUIRED = 3;

export interface VTFormInput {
  roofType?: string;
  mountingHeight?: number;
  electricalDistance?: string;
  obstacles?: string[];
  comments?: string;
  photoIds?: string[];
}

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Valide les données du formulaire VT
 */
export function validateVTForm(data: VTFormInput): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validation du type de toiture
  if (!data.roofType) {
    errors.push({ field: 'roofType', message: 'Le type de toiture est requis' });
  } else if (!VALID_ROOF_TYPES.includes(data.roofType as typeof VALID_ROOF_TYPES[number])) {
    errors.push({ field: 'roofType', message: 'Type de toiture invalide' });
  }

  // Validation de la hauteur de montage
  if (data.mountingHeight === undefined || data.mountingHeight === null) {
    errors.push({ field: 'mountingHeight', message: 'La hauteur de montage est requise' });
  } else if (typeof data.mountingHeight !== 'number' || data.mountingHeight < 0) {
    errors.push({ field: 'mountingHeight', message: 'La hauteur de montage doit être un nombre positif' });
  }

  // Validation de la distance au tableau électrique
  if (!data.electricalDistance) {
    errors.push({ field: 'electricalDistance', message: 'La distance au tableau électrique est requise' });
  } else if (!VALID_ELECTRICAL_DISTANCES.includes(data.electricalDistance as typeof VALID_ELECTRICAL_DISTANCES[number])) {
    errors.push({ field: 'electricalDistance', message: 'Distance au tableau électrique invalide' });
  }

  // Validation des obstacles (doit être un tableau)
  if (!Array.isArray(data.obstacles)) {
    errors.push({ field: 'obstacles', message: 'Les obstacles doivent être un tableau' });
  }

  // Validation des photos
  if (!data.photoIds || !Array.isArray(data.photoIds)) {
    errors.push({ field: 'photoIds', message: 'Les IDs de photos sont requis' });
  } else if (data.photoIds.length < MIN_PHOTOS_REQUIRED) {
    errors.push({ 
      field: 'photoIds', 
      message: `Au moins ${MIN_PHOTOS_REQUIRED} photos sont requises (${data.photoIds.length} fournie(s))` 
    });
  }

  return errors;
}

/**
 * Vérifie si le formulaire VT est valide
 */
export function isVTFormValid(data: VTFormInput): boolean {
  return validateVTForm(data).length === 0;
}
