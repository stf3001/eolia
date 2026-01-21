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
export interface Dossier {
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
  uploadedAt: number;
  downloadUrl?: string;
}

// Labels et couleurs pour l'affichage
export const shippingStatusLabels: Record<ShippingStatus, string> = {
  received: 'Commande reçue',
  preparing: 'En préparation',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  issue: 'Problème',
};

export const adminStatusLabels: Record<AdminStatus, string> = {
  not_started: 'Non démarré',
  in_progress: 'En cours',
  validated: 'Validé',
  rejected: 'Rejeté',
};

export const installationStatusLabels: Record<InstallationStatus, string> = {
  vt_pending: 'VT à compléter',
  vt_completed: 'VT complétée',
  awaiting_be: 'En attente BE',
  validated: 'Validée',
};

export const statusColors: Record<DossierStatus, string> = {
  // Shipping
  received: 'bg-blue-100 text-blue-800',
  preparing: 'bg-yellow-100 text-yellow-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  issue: 'bg-red-100 text-red-800',
  // Admin
  not_started: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  validated: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  // Installation
  vt_pending: 'bg-orange-100 text-orange-800',
  vt_completed: 'bg-blue-100 text-blue-800',
  awaiting_be: 'bg-purple-100 text-purple-800',
};

// Couleurs des boutons de tracking par type
export const trackingButtonColors: Record<string, string> = {
  shipping: 'bg-blue-600 hover:bg-blue-700',
  admin: 'bg-green-600 hover:bg-green-700',
  installation: 'bg-orange-500 hover:bg-orange-600',
};

// Labels des types de dossiers
export const dossierTypeLabels: Record<DossierType, string> = {
  shipping: 'Suivi de ma commande',
  admin_enedis: 'Démarches Enedis',
  admin_consuel: 'Démarches Consuel',
  installation: 'Suivi de mon installation',
};

// Options pour le formulaire VT
export const roofTypeOptions = [
  { value: 'flat', label: 'Toit plat' },
  { value: 'sloped_tiles', label: 'Toit incliné - Tuiles' },
  { value: 'sloped_slate', label: 'Toit incliné - Ardoises' },
  { value: 'metal', label: 'Toit métallique' },
  { value: 'other', label: 'Autre' },
] as const;

export const electricalDistanceOptions = [
  { value: '<30m', label: 'Moins de 30m' },
  { value: '30-60m', label: '30 à 60m' },
  { value: '60-100m', label: '60 à 100m' },
  { value: '>100m', label: 'Plus de 100m' },
] as const;

export const obstacleOptions = [
  { value: 'trees', label: 'Arbres' },
  { value: 'buildings', label: 'Bâtiments' },
  { value: 'power_lines', label: 'Lignes électriques' },
  { value: 'antennas', label: 'Antennes' },
  { value: 'chimneys', label: 'Cheminées' },
] as const;
