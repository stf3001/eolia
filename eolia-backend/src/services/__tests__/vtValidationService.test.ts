/**
 * Tests unitaires pour la validation du formulaire VT
 * Requirements: 4.6, 5.2
 */

import { describe, it, expect } from 'vitest';
import {
  validateVTForm,
  isVTFormValid,
  VALID_ROOF_TYPES,
  VALID_ELECTRICAL_DISTANCES,
  MIN_PHOTOS_REQUIRED,
  VTFormInput,
} from '../vtValidationService';

describe('vtValidationService', () => {
  // Valid form data for reuse
  const validFormData: VTFormInput = {
    roofType: 'flat',
    mountingHeight: 5,
    electricalDistance: '<30m',
    obstacles: ['trees'],
    photoIds: ['photo1', 'photo2', 'photo3'],
  };

  describe('validateVTForm', () => {
    describe('valid form', () => {
      it('should return no errors for valid form', () => {
        const errors = validateVTForm(validFormData);
        expect(errors).toHaveLength(0);
      });

      it('should accept all valid roof types', () => {
        for (const roofType of VALID_ROOF_TYPES) {
          const errors = validateVTForm({ ...validFormData, roofType });
          expect(errors.filter(e => e.field === 'roofType')).toHaveLength(0);
        }
      });

      it('should accept all valid electrical distances', () => {
        for (const distance of VALID_ELECTRICAL_DISTANCES) {
          const errors = validateVTForm({ ...validFormData, electricalDistance: distance });
          expect(errors.filter(e => e.field === 'electricalDistance')).toHaveLength(0);
        }
      });

      it('should accept empty obstacles array', () => {
        const errors = validateVTForm({ ...validFormData, obstacles: [] });
        expect(errors.filter(e => e.field === 'obstacles')).toHaveLength(0);
      });

      it('should accept optional comments', () => {
        const errors = validateVTForm({ ...validFormData, comments: 'Some comments' });
        expect(errors).toHaveLength(0);
      });
    });

    describe('roofType validation', () => {
      it('should require roofType', () => {
        const errors = validateVTForm({ ...validFormData, roofType: undefined });
        expect(errors).toContainEqual({
          field: 'roofType',
          message: 'Le type de toiture est requis',
        });
      });

      it('should reject invalid roofType', () => {
        const errors = validateVTForm({ ...validFormData, roofType: 'invalid_type' });
        expect(errors).toContainEqual({
          field: 'roofType',
          message: 'Type de toiture invalide',
        });
      });
    });

    describe('mountingHeight validation', () => {
      it('should require mountingHeight', () => {
        const errors = validateVTForm({ ...validFormData, mountingHeight: undefined });
        expect(errors).toContainEqual({
          field: 'mountingHeight',
          message: 'La hauteur de montage est requise',
        });
      });

      it('should reject negative mountingHeight', () => {
        const errors = validateVTForm({ ...validFormData, mountingHeight: -5 });
        expect(errors).toContainEqual({
          field: 'mountingHeight',
          message: 'La hauteur de montage doit être un nombre positif',
        });
      });

      it('should accept zero mountingHeight', () => {
        const errors = validateVTForm({ ...validFormData, mountingHeight: 0 });
        expect(errors.filter(e => e.field === 'mountingHeight')).toHaveLength(0);
      });

      it('should reject non-numeric mountingHeight', () => {
        const errors = validateVTForm({ ...validFormData, mountingHeight: 'five' as any });
        expect(errors.filter(e => e.field === 'mountingHeight')).toHaveLength(1);
      });
    });

    describe('electricalDistance validation', () => {
      it('should require electricalDistance', () => {
        const errors = validateVTForm({ ...validFormData, electricalDistance: undefined });
        expect(errors).toContainEqual({
          field: 'electricalDistance',
          message: 'La distance au tableau électrique est requise',
        });
      });

      it('should reject invalid electricalDistance', () => {
        const errors = validateVTForm({ ...validFormData, electricalDistance: '50m' });
        expect(errors).toContainEqual({
          field: 'electricalDistance',
          message: 'Distance au tableau électrique invalide',
        });
      });
    });

    describe('obstacles validation', () => {
      it('should require obstacles to be an array', () => {
        const errors = validateVTForm({ ...validFormData, obstacles: undefined });
        expect(errors).toContainEqual({
          field: 'obstacles',
          message: 'Les obstacles doivent être un tableau',
        });
      });

      it('should reject non-array obstacles', () => {
        const errors = validateVTForm({ ...validFormData, obstacles: 'trees' as any });
        expect(errors).toContainEqual({
          field: 'obstacles',
          message: 'Les obstacles doivent être un tableau',
        });
      });
    });

    describe('photoIds validation', () => {
      it('should require photoIds', () => {
        const errors = validateVTForm({ ...validFormData, photoIds: undefined });
        expect(errors).toContainEqual({
          field: 'photoIds',
          message: 'Les IDs de photos sont requis',
        });
      });

      it('should require minimum 3 photos', () => {
        const errors = validateVTForm({ ...validFormData, photoIds: ['photo1', 'photo2'] });
        expect(errors.some(e => 
          e.field === 'photoIds' && e.message.includes('Au moins 3 photos')
        )).toBe(true);
      });

      it('should accept exactly 3 photos', () => {
        const errors = validateVTForm({ ...validFormData, photoIds: ['p1', 'p2', 'p3'] });
        expect(errors.filter(e => e.field === 'photoIds')).toHaveLength(0);
      });

      it('should accept more than 3 photos', () => {
        const errors = validateVTForm({ 
          ...validFormData, 
          photoIds: ['p1', 'p2', 'p3', 'p4', 'p5'] 
        });
        expect(errors.filter(e => e.field === 'photoIds')).toHaveLength(0);
      });

      it('should reject empty photoIds array', () => {
        const errors = validateVTForm({ ...validFormData, photoIds: [] });
        expect(errors.some(e => e.field === 'photoIds')).toBe(true);
      });
    });

    describe('multiple errors', () => {
      it('should return all errors for completely invalid form', () => {
        const errors = validateVTForm({});
        expect(errors.length).toBeGreaterThanOrEqual(5);
        expect(errors.some(e => e.field === 'roofType')).toBe(true);
        expect(errors.some(e => e.field === 'mountingHeight')).toBe(true);
        expect(errors.some(e => e.field === 'electricalDistance')).toBe(true);
        expect(errors.some(e => e.field === 'obstacles')).toBe(true);
        expect(errors.some(e => e.field === 'photoIds')).toBe(true);
      });
    });
  });

  describe('isVTFormValid', () => {
    it('should return true for valid form', () => {
      expect(isVTFormValid(validFormData)).toBe(true);
    });

    it('should return false for invalid form', () => {
      expect(isVTFormValid({})).toBe(false);
    });

    it('should return false when missing photos', () => {
      expect(isVTFormValid({ ...validFormData, photoIds: ['p1'] })).toBe(false);
    });
  });

  describe('constants', () => {
    it('should have correct MIN_PHOTOS_REQUIRED', () => {
      expect(MIN_PHOTOS_REQUIRED).toBe(3);
    });

    it('should have all expected roof types', () => {
      expect(VALID_ROOF_TYPES).toContain('flat');
      expect(VALID_ROOF_TYPES).toContain('sloped_tiles');
      expect(VALID_ROOF_TYPES).toContain('sloped_slate');
      expect(VALID_ROOF_TYPES).toContain('metal');
      expect(VALID_ROOF_TYPES).toContain('other');
    });

    it('should have all expected electrical distances', () => {
      expect(VALID_ELECTRICAL_DISTANCES).toContain('<30m');
      expect(VALID_ELECTRICAL_DISTANCES).toContain('30-60m');
      expect(VALID_ELECTRICAL_DISTANCES).toContain('60-100m');
      expect(VALID_ELECTRICAL_DISTANCES).toContain('>100m');
    });
  });
});
