/**
 * AdminOrderDetail - Vue détaillée d'une commande/client
 * Requirements: 4.1, 4.2, 4.3, 4.4
 */

import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  CreditCard,
  Calendar,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminDossierCard from '../../components/admin/AdminDossierCard';
import AdminNotes from '../../components/admin/AdminNotes';
import { adminService } from '../../services/adminService';
import type { AdminNote, OrderDetail } from '../../services/adminService';
import type { Dossier, DossierDocument, DossierEvent, DossierType } from '../../types/dossier';

// Couleurs des badges de statut commande
const orderStatusColors: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-800',
  confirmed: 'bg-emerald-100 text-emerald-800',
  validated: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const orderStatusLabels: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  validated: 'Validée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

// Labels des types de dossiers
const dossierTypeLabels: Record<DossierType, string> = {
  shipping: 'Suivi de commande',
  admin_enedis: 'Démarches Enedis',
  admin_consuel: 'Démarches Consuel',
  installation: 'Installation',
};

// Ordre d'affichage des dossiers
const dossierOrder: DossierType[] = ['shipping', 'admin_enedis', 'admin_consuel', 'installation'];

interface ExtendedDossier extends Dossier {
  events?: DossierEvent[];
}

export default function AdminOrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDossiers, setExpandedDossiers] = useState<Set<string>>(new Set());

  // Charger les données
  const loadOrderDetail = useCallback(async () => {
    if (!orderId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await adminService.getOrderDetail(orderId);
      setOrderDetail(data);
      // Expand first dossier by default
      if (data.dossiers.length > 0) {
        const firstDossier = data.dossiers[0] as unknown as ExtendedDossier;
        setExpandedDossiers(new Set([firstDossier.dossierId]));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrderDetail();
  }, [loadOrderDetail]);

  // Toggle expansion d'un dossier
  const toggleDossier = (dossierId: string) => {
    setExpandedDossiers((prev) => {
      const next = new Set(prev);
      if (next.has(dossierId)) {
        next.delete(dossierId);
      } else {
        next.add(dossierId);
      }
      return next;
    });
  };

  // Callback après ajout de note
  const handleNoteAdded = (note: AdminNote) => {
    if (orderDetail) {
      setOrderDetail({
        ...orderDetail,
        notes: [...orderDetail.notes, note],
      });
    }
  };

  // Callback après changement de statut dossier
  const handleDossierStatusChanged = () => {
    loadOrderDetail();
  };

  // Formater la date
  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  // Formater le montant
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount / 100);
  };

  // Extraire les infos de la commande
  const order = orderDetail?.order as Record<string, any> | undefined;
  const dossiers = (orderDetail?.dossiers || []) as unknown as ExtendedDossier[];
  const documents = (orderDetail?.documents || []) as unknown as DossierDocument[];
  const notes = orderDetail?.notes || [];

  // Trier les dossiers selon l'ordre défini
  const sortedDossiers = [...dossiers].sort((a, b) => {
    return dossierOrder.indexOf(a.type) - dossierOrder.indexOf(b.type);
  });

  // Grouper les documents par dossierId
  const documentsByDossier = documents.reduce((acc, doc) => {
    if (!acc[doc.dossierId]) {
      acc[doc.dossierId] = [];
    }
    acc[doc.dossierId].push(doc);
    return acc;
  }, {} as Record<string, DossierDocument[]>);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header avec navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/orders')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Détail commande</h1>
              {orderId && (
                <p className="text-sm text-gray-500 font-mono">{orderId}</p>
              )}
            </div>
          </div>
          <button
            onClick={loadOrderDetail}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>

        {/* Erreur */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-700">{error}</p>
              <button
                onClick={loadOrderDetail}
                className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && !orderDetail && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
          </div>
        )}

        {/* Contenu */}
        {orderDetail && order && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              {/* Section Client */}
              <section className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-emerald-600" />
                  Informations client
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Nom</p>
                      <p className="font-medium text-gray-900">
                        {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <a
                        href={`mailto:${order.shippingAddress?.email}`}
                        className="font-medium text-emerald-600 hover:text-emerald-700"
                      >
                        {order.shippingAddress?.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Téléphone</p>
                      <a
                        href={`tel:${order.shippingAddress?.phone}`}
                        className="font-medium text-gray-900"
                      >
                        {order.shippingAddress?.phone || '-'}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Adresse</p>
                      <p className="font-medium text-gray-900">
                        {order.shippingAddress?.address}
                        {order.shippingAddress?.addressComplement && (
                          <>, {order.shippingAddress.addressComplement}</>
                        )}
                        <br />
                        {order.shippingAddress?.postalCode} {order.shippingAddress?.city}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section Commande */}
              <section className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-emerald-600" />
                  Détails de la commande
                </h2>
                <div className="space-y-4">
                  {/* Statut et date */}
                  <div className="flex flex-wrap items-center gap-4">
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                        orderStatusColors[order.status] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {orderStatusLabels[order.status] || order.status}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {formatDate(order.createdAt)}
                    </div>
                  </div>

                  {/* Articles */}
                  {order.items && order.items.length > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Articles</h3>
                      <ul className="space-y-2">
                        {order.items.map((item: any, index: number) => (
                          <li
                            key={index}
                            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                          >
                            <div>
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-500">Qté: {item.quantity}</p>
                            </div>
                            <p className="font-medium text-gray-900">
                              {formatAmount(item.price * item.quantity)}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Montants */}
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    {order.subtotal && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Sous-total</span>
                        <span className="text-gray-900">{formatAmount(order.subtotal)}</span>
                      </div>
                    )}
                    {order.shippingCost !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Livraison</span>
                        <span className="text-gray-900">
                          {order.shippingCost === 0 ? 'Gratuit' : formatAmount(order.shippingCost)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                      <span className="text-gray-900">Total</span>
                      <span className="text-emerald-600">{formatAmount(order.totalAmount)}</span>
                    </div>
                  </div>

                  {/* Statut paiement */}
                  <div className="flex items-center gap-2 pt-2">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">Paiement:</span>
                    <span
                      className={`text-sm font-medium ${
                        order.paymentStatus === 'paid'
                          ? 'text-green-600'
                          : order.paymentStatus === 'failed'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {order.paymentStatus === 'paid'
                        ? 'Payé'
                        : order.paymentStatus === 'failed'
                        ? 'Échoué'
                        : 'En attente'}
                    </span>
                  </div>
                </div>
              </section>

              {/* Section Dossiers */}
              <section className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Dossiers ({sortedDossiers.length})
                </h2>
                <div className="space-y-4">
                  {sortedDossiers.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Aucun dossier</p>
                  ) : (
                    sortedDossiers.map((dossier) => (
                      <div key={dossier.dossierId} className="border border-gray-200 rounded-lg">
                        {/* Header du dossier (accordéon) */}
                        <button
                          onClick={() => toggleDossier(dossier.dossierId)}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-gray-900">
                              {dossierTypeLabels[dossier.type] || dossier.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            {expandedDossiers.has(dossier.dossierId) ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </button>

                        {/* Contenu du dossier */}
                        {expandedDossiers.has(dossier.dossierId) && (
                          <div className="border-t border-gray-200">
                            <AdminDossierCard
                              dossier={dossier}
                              events={dossier.events || []}
                              documents={documentsByDossier[dossier.dossierId] || []}
                              orderId={orderId!}
                              onStatusChanged={handleDossierStatusChanged}
                            />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>

            {/* Colonne latérale - Notes */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <AdminNotes
                  orderId={orderId!}
                  notes={notes}
                  onNoteAdded={handleNoteAdded}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
