/**
 * AdminDossierCard - Carte de dossier avec gestion de statut et timeline
 * Requirements: 4.4, 5.1, 5.2, 5.3, 5.4
 */

import { useState } from 'react';
import {
  AlertCircle,
  Loader2,
  Check,
  ChevronDown,
  FileText,
  Clock,
} from 'lucide-react';
import StatusBadge from '../tracking/StatusBadge';
import Timeline from '../tracking/Timeline';
import type { TimelineEvent } from '../tracking/Timeline';
import DocumentList from '../tracking/DocumentList';
import AdminDocumentUpload from './AdminDocumentUpload';
import type { Dossier, DossierDocument, DossierEvent, DossierType, DossierStatus } from '../../types/dossier';

// Transitions valides par type de dossier (miroir du backend)
const validTransitions: Record<DossierType, Record<string, string[]>> = {
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

// Labels des statuts
const statusLabels: Record<string, string> = {
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

// Labels des événements
const eventTypeLabels: Record<string, string> = {
  status_changed: 'Changement de statut',
  document_added: 'Document ajouté',
  document_removed: 'Document supprimé',
  vt_submitted: 'VT soumise',
  vt_sent_to_be: 'VT envoyée au BE',
  metadata_updated: 'Mise à jour',
};

interface AdminDossierCardProps {
  dossier: Dossier;
  events: DossierEvent[];
  documents: DossierDocument[];
  orderId: string;
  onStatusChanged?: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const ADMIN_TOKEN_KEY = 'admin_token';

export default function AdminDossierCard({
  dossier,
  events,
  documents,
  orderId,
  onStatusChanged,
}: AdminDossierCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Récupérer les transitions valides
  const allowedTransitions = validTransitions[dossier.type]?.[dossier.status] || [];

  // Convertir les événements pour le composant Timeline
  const timelineEvents: TimelineEvent[] = events.map((event) => ({
    id: event.eventId,
    timestamp: event.timestamp,
    label: eventTypeLabels[event.eventType] || event.eventType,
    description: getEventDescription(event),
    eventType: event.eventType,
  }));

  // Mettre à jour le statut
  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    setError(null);
    setShowStatusDropdown(false);

    try {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      const response = await fetch(
        `${API_URL}/orders/${orderId}/dossiers/${dossier.dossierId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
          body: JSON.stringify({ status: newStatus, source: 'admin' }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erreur lors de la mise à jour');
      }

      onStatusChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    } finally {
      setIsUpdating(false);
    }
  };

  // Callback après upload de document
  const handleDocumentUploaded = () => {
    onStatusChanged?.();
  };

  return (
    <div className="p-4 space-y-6">
      {/* Erreur */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Statut actuel et dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Statut actuel:</span>
          <StatusBadge status={dossier.status as DossierStatus} dossierType={dossier.type} size="md" />
        </div>

        {/* Dropdown changement de statut */}
        {allowedTransitions.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              disabled={isUpdating}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                <>
                  Changer le statut
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>

            {showStatusDropdown && (
              <>
                {/* Overlay pour fermer */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowStatusDropdown(false)}
                />
                {/* Menu dropdown */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="py-1">
                    <p className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                      Transitions disponibles
                    </p>
                    {allowedTransitions.map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Check className="h-4 w-4 text-emerald-600 opacity-0" />
                        {statusLabels[status] || status}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {allowedTransitions.length === 0 && (
          <span className="text-sm text-gray-500 italic">État final atteint</span>
        )}
      </div>

      {/* Timeline des événements */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Historique ({timelineEvents.length})
        </h4>
        {timelineEvents.length > 0 ? (
          <Timeline events={timelineEvents} />
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">Aucun événement</p>
        )}
      </div>

      {/* Documents */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Documents ({documents.length})
        </h4>
        <DocumentList
          documents={documents}
          orderId={orderId}
          allowDelete={true}
          onDelete={handleDocumentUploaded}
        />

        {/* Upload de document */}
        <div className="mt-4">
          <AdminDocumentUpload
            orderId={orderId}
            dossierId={dossier.dossierId}
            dossierType={dossier.type}
            onUploaded={handleDocumentUploaded}
          />
        </div>
      </div>
    </div>
  );
}

// Helper pour générer la description d'un événement
function getEventDescription(event: DossierEvent): string {
  const data = event.data as Record<string, any>;

  switch (event.eventType) {
    case 'status_changed':
      return `${statusLabels[data.previousStatus] || data.previousStatus} → ${
        statusLabels[data.newStatus] || data.newStatus
      }`;
    case 'document_added':
      return data.fileName || 'Document ajouté';
    case 'document_removed':
      return data.fileName || 'Document supprimé';
    case 'vt_submitted':
      return 'Visite technique soumise par le client';
    case 'vt_sent_to_be':
      return 'Visite technique envoyée au bureau d\'études';
    default:
      return '';
  }
}
