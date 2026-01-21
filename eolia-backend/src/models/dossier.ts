/**
 * Types pour le suivi post-achat (dossiers)
 */

// Types de dossiers
export type DossierType = 
  | 'shipping' 
  | 'admin_enedis' 
  | 'admin_consuel' 
  | 'installation';

// Statuts par type de dossier
export type ShippingStatus = 
  | 'received'      // Commande reçue
  | 'preparing'     // En préparation
  | 'shipped'       // Expédiée
  | 'delivered'     // Livrée
  | 'issue';        // Problème/SAV

export type AdminStatus = 
  | 'not_started'   // Non démarré
  | 'in_progress'   // En cours
  | 'validated'     // Validé
  | 'rejected';     // Rejeté

export type InstallationStatus = 
  | 'vt_pending'    // VT à compléter
  | 'vt_completed'  // VT complétée
  | 'awaiting_be'   // En attente BE
  | 'validated';    // Validée

export type DossierStatus = ShippingStatus | AdminStatus | InstallationStatus;

// Metadata selon le type de dossier
export interface ShippingMetadata {
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveryProofUrl?: string;
}

export interface AdminMetadata {
  referenceNumber?: string;
  submissionDate?: number;
  responseDate?: number;
  rejectionReason?: string;
}

export interface VTFormData {
  roofType: 'flat' | 'sloped_tiles' | 'sloped_slate' | 'metal' | 'other';
  mountingHeight: number;
  electricalDistance: '<30m' | '30-60m' | '60-100m' | '>100m';
  obstacles: string[];
  comments?: string;
  photoIds: string[];
}

export interface InstallationMetadata {
  vtData?: VTFormData;
  vtSubmittedAt?: number;
  vtSentToBEAt?: number;
  installerAssigned?: string;
  installationDate?: string;
}

export type DossierMetadata = ShippingMetadata | AdminMetadata | InstallationMetadata;

// Entité principale Dossier
export interface OrderDossier {
  orderId: string;
  dossierId: string;
  type: DossierType;
  status: DossierStatus;
  createdAt: number;
  updatedAt: number;
  metadata: DossierMetadata;
}

// Types d'événements
export type EventType = 
  | 'status_changed'
  | 'document_added'
  | 'document_removed'
  | 'vt_submitted'
  | 'vt_sent_to_be'
  | 'metadata_updated';

export type EventSource = 'system' | 'client' | 'admin';

// Entité événement
export interface DossierEvent {
  dossierId: string;
  eventId: string;
  eventType: EventType;
  timestamp: number;
  data: Record<string, unknown>;
  source: EventSource;
}

// Entité document
export interface DossierDocument {
  documentId: string;
  dossierId: string;
  orderId: string;
  fileName: string;
  contentType: string;
  size: number;
  s3Key: string;
  uploadedAt: number;
  uploadedBy: string;
}

// Transitions d'état valides
export const validTransitions: Record<DossierType, Record<string, string[]>> = {
  shipping: {
    received: ['preparing'],
    preparing: ['shipped'],
    shipped: ['delivered', 'issue'],
    delivered: ['issue'],
    issue: ['preparing', 'shipped'],
  },
  admin_enedis: {
    not_started: ['in_progress'],
    in_progress: ['validated', 'rejected'],
    rejected: ['in_progress'],
  },
  admin_consuel: {
    not_started: ['in_progress'],
    in_progress: ['validated', 'rejected'],
    rejected: ['in_progress'],
  },
  installation: {
    vt_pending: ['vt_completed'],
    vt_completed: ['awaiting_be'],
    awaiting_be: ['validated'],
  },
};

// Fonction utilitaire pour valider une transition
export function isValidTransition(
  type: DossierType, 
  currentStatus: string, 
  newStatus: string
): boolean {
  const typeTransitions = validTransitions[type];
  if (!typeTransitions) return false;
  
  const allowedTransitions = typeTransitions[currentStatus];
  if (!allowedTransitions) return false;
  
  return allowedTransitions.includes(newStatus);
}
