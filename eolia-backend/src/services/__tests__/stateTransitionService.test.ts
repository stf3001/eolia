/**
 * Tests unitaires pour le service de validation des transitions d'état
 * Requirements: 2.1, 4.6
 */

import { describe, it, expect } from 'vitest';
import {
  validateStateTransition,
  getAllowedTransitions,
  isFinalState,
  getInitialStatus,
  getStatusLabel,
} from '../stateTransitionService';

describe('stateTransitionService', () => {
  describe('validateStateTransition', () => {
    // Shipping transitions
    describe('shipping dossier', () => {
      it('should allow received -> preparing', () => {
        const result = validateStateTransition('shipping', 'received', 'preparing');
        expect(result.valid).toBe(true);
      });

      it('should allow preparing -> shipped', () => {
        const result = validateStateTransition('shipping', 'preparing', 'shipped');
        expect(result.valid).toBe(true);
      });

      it('should allow shipped -> delivered', () => {
        const result = validateStateTransition('shipping', 'shipped', 'delivered');
        expect(result.valid).toBe(true);
      });

      it('should allow shipped -> issue', () => {
        const result = validateStateTransition('shipping', 'shipped', 'issue');
        expect(result.valid).toBe(true);
      });

      it('should reject received -> shipped (skip preparing)', () => {
        const result = validateStateTransition('shipping', 'received', 'shipped');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Transition non autorisée');
      });

      it('should reject delivered -> preparing (backward)', () => {
        const result = validateStateTransition('shipping', 'delivered', 'preparing');
        expect(result.valid).toBe(false);
      });
    });

    // Admin transitions
    describe('admin_enedis dossier', () => {
      it('should allow not_started -> in_progress', () => {
        const result = validateStateTransition('admin_enedis', 'not_started', 'in_progress');
        expect(result.valid).toBe(true);
      });

      it('should allow in_progress -> validated', () => {
        const result = validateStateTransition('admin_enedis', 'in_progress', 'validated');
        expect(result.valid).toBe(true);
      });

      it('should allow in_progress -> rejected', () => {
        const result = validateStateTransition('admin_enedis', 'in_progress', 'rejected');
        expect(result.valid).toBe(true);
      });

      it('should allow rejected -> in_progress (retry)', () => {
        const result = validateStateTransition('admin_enedis', 'rejected', 'in_progress');
        expect(result.valid).toBe(true);
      });

      it('should reject not_started -> validated (skip in_progress)', () => {
        const result = validateStateTransition('admin_enedis', 'not_started', 'validated');
        expect(result.valid).toBe(false);
      });
    });

    // Installation transitions
    describe('installation dossier', () => {
      it('should allow vt_pending -> vt_completed', () => {
        const result = validateStateTransition('installation', 'vt_pending', 'vt_completed');
        expect(result.valid).toBe(true);
      });

      it('should allow vt_completed -> awaiting_be', () => {
        const result = validateStateTransition('installation', 'vt_completed', 'awaiting_be');
        expect(result.valid).toBe(true);
      });

      it('should allow awaiting_be -> validated', () => {
        const result = validateStateTransition('installation', 'awaiting_be', 'validated');
        expect(result.valid).toBe(true);
      });

      it('should reject vt_pending -> awaiting_be (skip vt_completed)', () => {
        const result = validateStateTransition('installation', 'vt_pending', 'awaiting_be');
        expect(result.valid).toBe(false);
      });
    });

    // Error cases
    describe('error handling', () => {
      it('should reject unknown dossier type', () => {
        const result = validateStateTransition('unknown' as any, 'received', 'preparing');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Type de dossier inconnu');
      });

      it('should reject invalid current status', () => {
        const result = validateStateTransition('shipping', 'invalid_status' as any, 'preparing');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Statut actuel invalide');
      });
    });
  });

  describe('getAllowedTransitions', () => {
    it('should return allowed transitions for shipping received', () => {
      const transitions = getAllowedTransitions('shipping', 'received');
      expect(transitions).toEqual(['preparing']);
    });

    it('should return multiple transitions for shipped', () => {
      const transitions = getAllowedTransitions('shipping', 'shipped');
      expect(transitions).toContain('delivered');
      expect(transitions).toContain('issue');
    });

    it('should return empty array for unknown type', () => {
      const transitions = getAllowedTransitions('unknown' as any, 'received');
      expect(transitions).toEqual([]);
    });
  });

  describe('isFinalState', () => {
    it('should return true for validated admin status', () => {
      expect(isFinalState('admin_enedis', 'validated')).toBe(true);
    });

    it('should return true for validated installation status', () => {
      expect(isFinalState('installation', 'validated')).toBe(true);
    });

    it('should return false for in_progress admin status', () => {
      expect(isFinalState('admin_enedis', 'in_progress')).toBe(false);
    });
  });

  describe('getInitialStatus', () => {
    it('should return received for shipping', () => {
      expect(getInitialStatus('shipping')).toBe('received');
    });

    it('should return not_started for admin_enedis', () => {
      expect(getInitialStatus('admin_enedis')).toBe('not_started');
    });

    it('should return vt_pending for installation', () => {
      expect(getInitialStatus('installation')).toBe('vt_pending');
    });
  });

  describe('getStatusLabel', () => {
    it('should return French label for received', () => {
      expect(getStatusLabel('received')).toBe('Commande reçue');
    });

    it('should return French label for vt_pending', () => {
      expect(getStatusLabel('vt_pending')).toBe('VT à compléter');
    });

    it('should return status itself for unknown status', () => {
      expect(getStatusLabel('unknown_status' as any)).toBe('unknown_status');
    });
  });
});
