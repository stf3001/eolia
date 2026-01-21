import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Wrench, AlertCircle, Loader2, Send, CheckCircle } from 'lucide-react';
import { dossierService } from '../../services/dossierService';
import { documentService } from '../../services/documentService';
import StatusBadge from '../../components/tracking/StatusBadge';
import Timeline, { type TimelineEvent } from '../../components/tracking/Timeline';
import DocumentList from '../../components/tracking/DocumentList';
import VTForm from './VTForm';
import type { Dossier, DossierEvent, DossierDocument, InstallationMetadata, InstallationStatus } from '../../types/dossier';
import { installationStatusLabels } from '../../types/dossier';

export default function InstallationTracker() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [events, setEvents] = useState<DossierEvent[]>([]);
  const [documents, setDocuments] = useState<DossierDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingToBE, setIsSendingToBE] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      loadInstallationData();
    }
  }, [orderId]);

  const loadInstallationData = async () => {
    if (!orderId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Récupérer tous les dossiers pour trouver l'installation
      const dossiers = await dossierService.getDossiers(orderId);
      const installationDossier = dossiers.find(d => d.type === 'installation');
      
      if (!installationDossier) {
        setError('Aucun suivi d\'installation pour cette commande');
        setIsLoading(false);
        return;
      }
      
      setDossier(installationDossier);
      
      // Charger les événements et documents en parallèle
      const [eventsData, documentsData] = await Promise.all([
        dossierService.getDossierEvents(orderId, installationDossier.dossierId),
        documentService.getDocuments(orderId, 'installation_vt'),
      ]);
      
      setEvents(eventsData);
      setDocuments(documentsData);
    } catch (err) {
      console.error('Erreur chargement suivi installation:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVTSubmitted = (updatedDossier: Dossier) => {
    setDossier(updatedDossier);
    // Recharger les données pour avoir les événements à jour
    loadInstallationData();
  };

  // Requirement 4.5: Envoyer au BE
  const handleSendToBE = async () => {
    if (!orderId) return;
    
    setIsSendingToBE(true);
    setError(null);
    
    try {
      const updatedDossier = await dossierService.sendVTToBE(orderId);
      setDossier(updatedDossier);
      // Recharger pour avoir les événements à jour
      loadInstallationData();
    } catch (err) {
      console.error('Erreur envoi au BE:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi');
    } finally {
      setIsSendingToBE(false);
    }
  };

  // Convertir les événements en TimelineEvent
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
      const status = event.data.status as InstallationStatus;
      return installationStatusLabels[status] || status;
    }
    if (event.eventType === 'vt_submitted') {
      return 'Visite technique soumise';
    }
    if (event.eventType === 'vt_sent_to_be') {
      return 'Envoyé au bureau d\'études';
    }
    if (event.eventType === 'document_added') {
      return 'Photo ajoutée';
    }
    return 'Mise à jour';
  }

  const metadata = dossier?.metadata as InstallationMetadata | undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement du suivi installation...</p>
        </div>
      </div>
    );
  }

  if (error || !dossier) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
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

  const status = dossier.status as InstallationStatus;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li><Link to="/" className="hover:text-orange-700">Accueil</Link></li>
            <li><span className="mx-2">/</span></li>
            <li><Link to="/espace-client" className="hover:text-orange-700">Mon compte</Link></li>
            <li><span className="mx-2">/</span></li>
            <li><Link to={`/orders/${orderId}`} className="hover:text-orange-700">Commande</Link></li>
            <li><span className="mx-2">/</span></li>
            <li className="text-gray-900 font-semibold">Suivi installation</li>
          </ol>
        </nav>

        {/* Back button */}
        <button
          onClick={() => navigate(`/orders/${orderId}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la commande
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Wrench className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Suivi de mon installation</h1>
              <p className="text-gray-600">Commande #{orderId?.slice(0, 8)}</p>
            </div>
            <StatusBadge status={status} dossierType="installation" size="lg" />
          </div>

          {/* Message selon le statut */}
          <div className="mt-4 text-sm text-gray-600">
            {status === 'vt_pending' && (
              <p>Veuillez compléter la visite technique ci-dessous pour préparer votre installation.</p>
            )}
            {status === 'vt_completed' && (
              <p>Votre visite technique est complète. Vous pouvez la valider et l'envoyer au bureau d'études.</p>
            )}
            {status === 'awaiting_be' && (
              <p>Votre dossier est en cours d'analyse par notre bureau d'études. Nous vous contacterons bientôt.</p>
            )}
            {status === 'validated' && (
              <p className="text-green-700">Votre dossier a été validé ! Un installateur vous contactera prochainement.</p>
            )}
          </div>
        </div>

        {/* Requirement 4.2: Formulaire VT si vt_pending */}
        {status === 'vt_pending' && orderId && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Visite Technique</h2>
            <VTForm 
              orderId={orderId} 
              onSubmitSuccess={handleVTSubmitted}
            />
          </div>
        )}

        {/* Requirement 4.4: Photos uploadées + Requirement 4.5: Bouton envoyer au BE */}
        {status === 'vt_completed' && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Visite Technique complétée</h2>
            
            {/* Résumé des données VT */}
            {metadata?.vtData && (
              <div className="bg-orange-50 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-orange-900 mb-2">Récapitulatif</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-orange-800">
                    <span className="font-medium">Type de toiture :</span>{' '}
                    {getRoofTypeLabel(metadata.vtData.roofType)}
                  </p>
                  <p className="text-orange-800">
                    <span className="font-medium">Hauteur :</span>{' '}
                    {metadata.vtData.mountingHeight}m
                  </p>
                  <p className="text-orange-800">
                    <span className="font-medium">Distance tableau :</span>{' '}
                    {metadata.vtData.electricalDistance}
                  </p>
                  <p className="text-orange-800">
                    <span className="font-medium">Photos :</span>{' '}
                    {metadata.vtData.photoIds.length}
                  </p>
                </div>
                {metadata.vtData.comments && (
                  <p className="text-orange-800 mt-2">
                    <span className="font-medium">Commentaires :</span>{' '}
                    {metadata.vtData.comments}
                  </p>
                )}
              </div>
            )}

            {/* Photos */}
            <h3 className="font-medium text-gray-900 mb-2">Photos de la visite technique</h3>
            <DocumentList
              documents={documents}
              orderId={orderId!}
              allowDelete={false}
            />

            {/* Bouton envoyer au BE */}
            <button
              onClick={handleSendToBE}
              disabled={isSendingToBE}
              className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSendingToBE ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Valider et envoyer au Bureau d'Études
                </>
              )}
            </button>
          </div>
        )}

        {/* Statut awaiting_be ou validated */}
        {(status === 'awaiting_be' || status === 'validated') && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              {status === 'validated' ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
              )}
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {status === 'validated' ? 'Dossier validé' : 'En attente de validation'}
                </h2>
                <p className="text-gray-600 text-sm">
                  {status === 'validated' 
                    ? 'Un installateur vous contactera prochainement pour planifier l\'intervention.'
                    : 'Notre bureau d\'études analyse votre dossier.'}
                </p>
              </div>
            </div>

            {/* Afficher les photos en lecture seule */}
            {documents.length > 0 && (
              <>
                <h3 className="font-medium text-gray-900 mb-2 mt-4">Photos de la visite technique</h3>
                <DocumentList
                  documents={documents}
                  orderId={orderId!}
                  allowDelete={false}
                />
              </>
            )}
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Historique</h2>
          <Timeline events={timelineEvents} currentStatus={status} />
        </div>
      </div>
    </div>
  );
}

// Helper pour les labels de type de toiture
function getRoofTypeLabel(roofType: string): string {
  const labels: Record<string, string> = {
    flat: 'Toit plat',
    sloped_tiles: 'Toit incliné - Tuiles',
    sloped_slate: 'Toit incliné - Ardoises',
    metal: 'Toit métallique',
    other: 'Autre',
  };
  return labels[roofType] || roofType;
}
