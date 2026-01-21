import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Package, Truck, AlertCircle, Loader2, ExternalLink, HelpCircle } from 'lucide-react';
import { dossierService } from '../../services/dossierService';
import { documentService } from '../../services/documentService';
import StatusBadge from '../../components/tracking/StatusBadge';
import Timeline, { type TimelineEvent } from '../../components/tracking/Timeline';
import DocumentList from '../../components/tracking/DocumentList';
import type { Dossier, DossierEvent, DossierDocument, ShippingMetadata, ShippingStatus } from '../../types/dossier';
import { shippingStatusLabels } from '../../types/dossier';

export default function ShippingTracker() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [events, setEvents] = useState<DossierEvent[]>([]);
  const [documents, setDocuments] = useState<DossierDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      loadShippingData();
    }
  }, [orderId]);

  const loadShippingData = async () => {
    if (!orderId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Récupérer tous les dossiers pour trouver le shipping
      const dossiers = await dossierService.getDossiers(orderId);
      const shippingDossier = dossiers.find(d => d.type === 'shipping');
      
      if (!shippingDossier) {
        setError('Aucun suivi logistique pour cette commande');
        setIsLoading(false);
        return;
      }
      
      setDossier(shippingDossier);
      
      // Charger les événements et documents en parallèle
      const [eventsData, documentsData] = await Promise.all([
        dossierService.getDossierEvents(orderId, shippingDossier.dossierId),
        documentService.getDocuments(orderId, 'shipping'),
      ]);
      
      setEvents(eventsData);
      setDocuments(documentsData);
    } catch (err) {
      console.error('Erreur chargement suivi:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentDelete = (documentId: string) => {
    setDocuments(prev => prev.filter(d => d.documentId !== documentId));
  };

  // Convertir les événements DossierEvent en TimelineEvent
  const timelineEvents: TimelineEvent[] = events.map(event => ({
    id: event.eventId,
    timestamp: event.timestamp,
    status: event.data?.status as string,
    label: getEventLabel(event),
    description: event.data?.description as string,
    eventType: event.eventType,
  }));

  function getEventLabel(event: DossierEvent): string {
    if (event.eventType === 'status_changed' && event.data?.status) {
      const status = event.data.status as ShippingStatus;
      return shippingStatusLabels[status] || status;
    }
    if (event.eventType === 'document_added') {
      return 'Document ajouté';
    }
    return 'Mise à jour';
  }

  const metadata = dossier?.metadata as ShippingMetadata | undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement du suivi...</p>
        </div>
      </div>
    );
  }

  if (error || !dossier) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              {error || 'Suivi non disponible'}
            </h2>
            <Link
              to={`/orders/${orderId}`}
              className="inline-flex items-center gap-2 text-red-700 hover:text-red-800 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à la commande
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const status = dossier.status as ShippingStatus;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li><Link to="/" className="hover:text-blue-700">Accueil</Link></li>
            <li><span className="mx-2">/</span></li>
            <li><Link to="/espace-client" className="hover:text-blue-700">Mon compte</Link></li>
            <li><span className="mx-2">/</span></li>
            <li><Link to={`/orders/${orderId}`} className="hover:text-blue-700">Commande</Link></li>
            <li><span className="mx-2">/</span></li>
            <li className="text-gray-900 font-semibold">Suivi livraison</li>
          </ol>
        </nav>

        {/* Back button */}
        <button
          onClick={() => navigate(`/orders/${orderId}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la commande
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Suivi de ma commande</h1>
              <p className="text-gray-600">Commande #{orderId?.slice(0, 8)}</p>
            </div>
            <StatusBadge status={status} dossierType="shipping" size="lg" />
          </div>

          {/* Requirement 2.2: Afficher transporteur/numéro de suivi si expédié */}
          {status === 'shipped' && metadata && (
            <div className="bg-blue-50 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-2">Informations de livraison</h3>
                  <div className="space-y-1 text-sm">
                    {metadata.carrier && (
                      <p className="text-blue-800">
                        <span className="font-medium">Transporteur :</span> {metadata.carrier}
                      </p>
                    )}
                    {metadata.trackingNumber && (
                      <p className="text-blue-800">
                        <span className="font-medium">N° de suivi :</span>{' '}
                        <span className="font-mono">{metadata.trackingNumber}</span>
                      </p>
                    )}
                    {metadata.estimatedDelivery && (
                      <p className="text-blue-800">
                        <span className="font-medium">Livraison estimée :</span>{' '}
                        {new Date(metadata.estimatedDelivery).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                        })}
                      </p>
                    )}
                  </div>
                  
                  {/* Lien vers le suivi externe */}
                  {metadata.trackingNumber && metadata.carrier && (
                    <a
                      href={getTrackingUrl(metadata.carrier, metadata.trackingNumber)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 text-blue-700 hover:text-blue-800 font-medium text-sm"
                    >
                      Suivre sur le site du transporteur
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Requirement 2.4: Message si problème */}
          {status === 'issue' && (
            <div className="bg-red-50 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Un problème est survenu</h3>
                  <p className="text-red-700 text-sm mb-3">
                    Notre équipe a été informée et travaille à résoudre ce problème.
                  </p>
                  <Link
                    to="/faq"
                    className="inline-flex items-center gap-2 text-red-700 hover:text-red-800 font-medium text-sm"
                  >
                    <HelpCircle className="w-4 h-4" />
                    Contacter le support SAV
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Requirement 2.3: Timeline */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Historique</h2>
          <Timeline events={timelineEvents} currentStatus={status} />
        </div>

        {/* Requirement 2.5: Documents (preuve de livraison) */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Documents</h2>
          <DocumentList
            documents={documents}
            orderId={orderId!}
            onDelete={handleDocumentDelete}
            allowDelete={false}
          />
        </div>
      </div>
    </div>
  );
}

// Helper pour générer l'URL de suivi selon le transporteur
function getTrackingUrl(carrier: string, trackingNumber: string): string {
  const carrierUrls: Record<string, string> = {
    'Colissimo': `https://www.laposte.fr/outils/suivre-vos-envois?code=${trackingNumber}`,
    'Chronopost': `https://www.chronopost.fr/tracking-no-cms/suivi-page?liession=${trackingNumber}`,
    'DHL': `https://www.dhl.com/fr-fr/home/tracking.html?tracking-id=${trackingNumber}`,
    'UPS': `https://www.ups.com/track?tracknum=${trackingNumber}`,
    'FedEx': `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
    'GLS': `https://gls-group.eu/FR/fr/suivi-colis?match=${trackingNumber}`,
  };
  
  return carrierUrls[carrier] || `https://www.google.com/search?q=${carrier}+suivi+${trackingNumber}`;
}
