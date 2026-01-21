/**
 * Service de validation des transitions d'état pour les dossiers
 * Requirements: 2.1, 3.2, 4.1
 */

import {
  DossierType,
  DossierStatus,
  ShippingStatus,
  AdminStatus,
  InstallationStatus,
  validTransitions,
  isValidTransition,
} from '../models/dossier';

export interface TransitionValidationResult {
  valid: boolean;
  error?: string;
  allowedTransitions?: string[];
}

/**
 * Valide une transition d'état pour un dossier
 */
export function validateStateTransition(
  type: DossierType,
  currentStatus: DossierStatus,
  newStatus: DossierStatus
): TransitionValidationResult {
  // Vérifier que le type de dossier existe
  if (!validTransitions[type]) {
    return {
      valid: false,
      error: `Type de dossier inconnu: ${type}`,
    };
  }

  // Vérifier que le statut actuel est valide pour ce type
  const typeTransitions = validTransitions[type];
  if (!typeTransitions[currentStatus]) {
    return {
      valid: false,
      error: `Statut actuel invalide pour ce type de dossier: ${currentStatus}`,
      allowedTransitions: [],
    };
  }

  // Vérifier si la transition est autorisée
  const allowedTransitions = typeTransitions[currentStatus];
  if (!allowedTransitions.includes(newStatus)) {
    return {
      valid: false,
      error: `Transition non autorisée de "${currentStatus}" vers "${newStatus}"`,
      allowedTransitions,
    };
  }

  return { valid: true };
}

/**
 * Récupère les transitions possibles depuis un état donné
 */
export function getAllowedTransitions(
  type: DossierType,
  currentStatus: DossierStatus
): string[] {
  const typeTransitions = validTransitions[type];
  if (!typeTransitions) return [];

  return typeTransitions[currentStatus] || [];
}

/**
 * Vérifie si un statut est un état final (pas de transitions possibles)
 */
export function isFinalState(
  type: DossierType,
  status: DossierStatus
): boolean {
  const allowed = getAllowedTransitions(type, status);
  return allowed.length === 0;
}

/**
 * Récupère le statut initial pour un type de dossier
 */
export function getInitialStatus(type: DossierType): DossierStatus {
  const initialStatuses: Record<DossierType, DossierStatus> = {
    shipping: 'received',
    admin_enedis: 'not_started',
    admin_consuel: 'not_started',
    installation: 'vt_pending',
  };

  return initialStatuses[type];
}

// Labels en français pour les statuts
export const statusLabels: Record<string, string> = {
  // Shipping
  received: 'Commande reçue',
  preparing: 'En préparation',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  issue: 'Problème signalé',
  // Admin
  not_started: 'Non démarré',
  in_progress: 'En cours',
  validated: 'Validé',
  rejected: 'Rejeté',
  // Installation
  vt_pending: 'VT à compléter',
  vt_completed: 'VT complétée',
  awaiting_be: 'En attente BE',
};

/**
 * Récupère le label français d'un statut
 */
export function getStatusLabel(status: DossierStatus): string {
  return statusLabels[status] || status;
}

// Couleurs pour les statuts (pour le frontend)
export const statusColors: Record<string, string> = {
  // Shipping
  received: 'blue',
  preparing: 'yellow',
  shipped: 'purple',
  delivered: 'green',
  issue: 'red',
  // Admin
  not_started: 'gray',
  in_progress: 'yellow',
  validated: 'green',
  rejected: 'red',
  // Installation
  vt_pending: 'orange',
  vt_completed: 'blue',
  awaiting_be: 'yellow',
};

/**
 * Récupère la couleur associée à un statut
 */
export function getStatusColor(status: DossierStatus): string {
  return statusColors[status] || 'gray';
}

// Labels pour les types de dossiers
export const dossierTypeLabels: Record<DossierType, string> = {
  shipping: 'Suivi de commande',
  admin_enedis: 'Démarches Enedis',
  admin_consuel: 'Démarches Consuel',
  installation: 'Installation',
};

/**
 * Récupère le label français d'un type de dossier
 */
export function getDossierTypeLabel(type: DossierType): string {
  return dossierTypeLabels[type] || type;
}

// Export de la fonction utilitaire du modèle pour cohérence
export { isValidTransition };
