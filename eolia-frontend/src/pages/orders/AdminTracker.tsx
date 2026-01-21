import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, FileText, AlertCircle, Loader2, Zap, Shield } from 'lucide-react';
import { dossierService } from '../../services/dossierService';
import { documentService } from '../../services/documentService';
import StatusBadge from '../../components/tracking/StatusBadge';
import Timeline, { type TimelineEvent } from '../../components/tracking/Timeline';
import DocumentList from '../../components/tracking/DocumentList';
import type { Dossier, DossierEvent, DossierDocument, AdminMetadata, AdminStatus } from '../../types/dossier';
import { adminStatusLabels } from '../../types/dossier';

interface SubDossier {
  dossier: Dossier;
  events: DossierEvent[];
  documents: DossierDocument[];
}

export default function AdminTracker() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  const [enedisDossier, setEnedisDossier] = useState<SubDossier | null>(null);
  const [consuelDossier, setConsuelDossier] = useState<SubDossier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'enedis' | 'consuel'>('enedis');

  useEffect(() => {
    if (orderId) {
      loadAdminData();
    }
  }, [orderId]);

  const loadAdminData = async () => {
    if (!orderId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Récupérer tous les dossiers
      const dossiers = await dossierService.getDossiers(orderId);
      const enedis = dossiers.find(d => d.type === 'admin_enedis');
      const consuel = dossiers.find(d => d.type === 'admin_consuel');
      
      if (!enedis && !consuel) {
        setError('Aucun suivi administratif pour cette commande');
        setIsLoading(false);
        return;
      }
      
      // Charger les données pour chaque sous-dossier
      const loadSubDossier = async (dossier: Dossier, type: string): Promise<SubDossier> => {
        const [events, documents] = await Promise.all([
          dossierService.getDossierEvents(orderId, dossier.dossierId),
          documentService.getDocuments(orderId, type),
        ]);
        return { dossier, events, documents };
      };
      
      if (enedis) {
        const enedisData = await loadSubDossier(enedis, 'enedis');
        setEnedisDossier(enedisData);
      }
      
      if (consuel) {
        const consuelData = await loadSubDossier(consuel, 'consuel');
        setConsuelDossier(consuelData);
      }
      
      // Définir l'onglet actif sur le premier disponible
      if (enedis) {
        setActiveTab('enedis');
      } else if (consuel) {
        setActiveTab('consuel');
      }
    } catch (err) {
      console.error('Erreur chargement suivi admin:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentDelete = (documentId: string, type: 'enedis' | 'consuel') => {
    if (type === 'enedis' && enedisDossier) {
      setEnedisDossier({
        ...enedisDossier,
        documents: enedisDossier.documents.filter(d => d.documentId !== documentId),
      });
    } else if (type === 'consuel' && consuelDossier) {
      setConsuelDossier({
        ...consuelDossier,
        documents: consuelDossier.documents.filter(d => d.documentId !== documentId),
      });
    }
  };

  // Convertir les événements en TimelineEvent
  const convertToTimelineEvents = (events: DossierEvent[]): TimelineEvent[] => {
    return events.map(event => ({
      id: event.eventId,
      timestamp: event.timestamp,
      status: event.data?.status as string,
      label: getEventLabel(event),
      description: event.data?.description as string,
      eventType: event.eventType,
    }));
  };

  function getEventLabel(event: DossierEvent): string {
    if (event.eventType === 'status_changed' && event.data?.status) {
      const status = event.data.status as AdminStatus;
      return adminStatusLabels[status] || status;
    }
    if (event.eventType === 'document_added') {
      return 'Document ajouté';
    }
    return 'Mise à jour';
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement du suivi administratif...</p>
        </div>
      </div>
    );
  }

  if (error || (!enedisDossier && !consuelDossier)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
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

  const currentSubDossier = activeTab === 'enedis' ? enedisDossier : consuelDossier;
  const metadata = currentSubDossier?.dossier.metadata as AdminMetadata | undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li><Link to="/" className="hover:text-green-700">Accueil</Link></li>
            <li><span className="mx-2">/</span></li>
            <li><Link to="/espace-client" className="hover:text-green-700">Mon compte</Link></li>
            <li><span className="mx-2">/</span></li>
            <li><Link to={`/orders/${orderId}`} className="hover:text-green-700">Commande</Link></li>
            <li><span className="mx-2">/</span></li>
            <li className="text-gray-900 font-semibold">Suivi administratif</li>
          </ol>
        </nav>

        {/* Back button */}
        <button
          onClick={() => navigate(`/orders/${orderId}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-green-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la commande
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Suivi admin – formalités</h1>
              <p className="text-gray-600">Commande #{orderId?.slice(0, 8)}</p>
            </div>
          </div>

          {/* Requirement 3.1: Tabs pour Enedis et Consuel */}
          <div className="flex gap-2 mt-4">
            {enedisDossier && (
              <button
                onClick={() => setActiveTab('enedis')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'enedis'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Zap className="w-4 h-4" />
                Enedis
                <StatusBadge 
                  status={enedisDossier.dossier.status} 
                  dossierType="admin_enedis" 
                  size="sm"
                  className={activeTab === 'enedis' ? 'bg-white/20 text-white' : ''}
                />
              </button>
            )}
            {consuelDossier && (
              <button
                onClick={() => setActiveTab('consuel')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'consuel'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Shield className="w-4 h-4" />
                Consuel
                <StatusBadge 
                  status={consuelDossier.dossier.status} 
                  dossierType="admin_consuel" 
                  size="sm"
                  className={activeTab === 'consuel' ? 'bg-white/20 text-white' : ''}
                />
              </button>
            )}
          </div>
        </div>

        {/* Contenu du sous-dossier actif */}
        {currentSubDossier && (
          <>
            {/* Requirement 3.2: Statut du sous-dossier */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  {activeTab === 'enedis' ? 'Démarches Enedis' : 'Démarches Consuel'}
                </h2>
                <StatusBadge 
                  status={currentSubDossier.dossier.status} 
                  dossierType={currentSubDossier.dossier.type}
                  size="lg"
                />
              </div>

              {/* Informations supplémentaires */}
              {metadata && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2 text-sm">
                    {metadata.referenceNumber && (
                      <p className="text-gray-700">
                        <span className="font-medium">N° de référence :</span>{' '}
                        <span className="font-mono">{metadata.referenceNumber}</span>
                      </p>
                    )}
                    {metadata.submissionDate && (
                      <p className="text-gray-700">
                        <span className="font-medium">Date de soumission :</span>{' '}
                        {new Date(metadata.submissionDate).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                    {metadata.responseDate && (
                      <p className="text-gray-700">
                        <span className="font-medium">Date de réponse :</span>{' '}
                        {new Date(metadata.responseDate).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                    {metadata.rejectionReason && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg">
                        <p className="text-red-700">
                          <span className="font-medium">Motif de rejet :</span>{' '}
                          {metadata.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Message explicatif selon le statut */}
              <div className="mt-4 text-sm text-gray-600">
                {currentSubDossier.dossier.status === 'not_started' && (
                  <p>Les démarches n'ont pas encore débuté. Notre équipe va bientôt s'en occuper.</p>
                )}
                {currentSubDossier.dossier.status === 'in_progress' && (
                  <p>Les démarches sont en cours. Nous vous tiendrons informé de l'avancement.</p>
                )}
                {currentSubDossier.dossier.status === 'validated' && (
                  <p className="text-green-700">Les démarches ont été validées avec succès !</p>
                )}
                {currentSubDossier.dossier.status === 'rejected' && (
                  <p className="text-red-700">
                    Les démarches ont été rejetées. Notre équipe travaille à résoudre ce problème.
                  </p>
                )}
              </div>
            </div>

            {/* Requirement 3.3: Timeline */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Historique</h2>
              <Timeline 
                events={convertToTimelineEvents(currentSubDossier.events)} 
                currentStatus={currentSubDossier.dossier.status} 
              />
            </div>

            {/* Requirement 3.4: Documents */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Documents</h2>
              <DocumentList
                documents={currentSubDossier.documents}
                orderId={orderId!}
                onDelete={(docId) => handleDocumentDelete(docId, activeTab)}
                allowDelete={false}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
