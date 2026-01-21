import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Package, AlertCircle, Loader2 } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { dossierService } from '../../services/dossierService';
import TrackingButton from '../../components/tracking/TrackingButton';
import type { Order } from '../../types/order';
import type { Dossier, DossierStatus } from '../../types/dossier';

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      loadOrderData();
    }
  }, [orderId]);

  const loadOrderData = async () => {
    if (!orderId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const [orderData, dossiersData] = await Promise.all([
        orderService.getOrder(orderId),
        dossierService.getDossiers(orderId),
      ]);
      
      setOrder(orderData);
      setDossiers(dossiersData);
    } catch (err) {
      console.error('Erreur chargement commande:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setIsLoading(false);
    }
  };

  // Vérifier si le paiement est confirmé (Requirements 1.5)
  const isPaymentConfirmed = order?.status === 'confirmed' || order?.status === 'validated' || 
                             order?.status === 'shipped' || order?.status === 'delivered';

  // Déterminer les boutons de suivi à afficher selon les catégories de produits
  const hasPhysicalProducts = order?.items.some(item => 
    ['turbine', 'inverter', 'accessory'].includes(item.category)
  );
  const hasAdminForfait = order?.items.some(item => 
    item.category === 'administrative'
  );
  const hasInstallationForfait = order?.items.some(item => 
    item.category === 'installation'
  );

  // Récupérer les statuts des dossiers
  const getShippingStatus = (): DossierStatus | undefined => {
    const shippingDossier = dossiers.find(d => d.type === 'shipping');
    return shippingDossier?.status;
  };

  const getAdminStatus = (): DossierStatus | undefined => {
    // Retourner le statut le plus "avancé" entre Enedis et Consuel
    const enedisDossier = dossiers.find(d => d.type === 'admin_enedis');
    const consuelDossier = dossiers.find(d => d.type === 'admin_consuel');
    return enedisDossier?.status || consuelDossier?.status;
  };

  const getInstallationStatus = (): DossierStatus | undefined => {
    const installationDossier = dossiers.find(d => d.type === 'installation');
    return installationDossier?.status;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: 'En attente de paiement', color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Confirmée', color: 'bg-blue-100 text-blue-800' },
      validated: { label: 'Validée', color: 'bg-green-100 text-green-800' },
      shipped: { label: 'Expédiée', color: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Livrée', color: 'bg-emerald-100 text-emerald-800' },
      cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800' },
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de la commande...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              {error || 'Commande non trouvée'}
            </h2>
            <Link
              to="/espace-client"
              className="inline-flex items-center gap-2 text-red-700 hover:text-red-800 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à mon espace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const orderStatus = getStatusLabel(order.status);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li><Link to="/" className="hover:text-emerald-700">Accueil</Link></li>
            <li><span className="mx-2">/</span></li>
            <li><Link to="/espace-client" className="hover:text-emerald-700">Mon compte</Link></li>
            <li><span className="mx-2">/</span></li>
            <li className="text-gray-900 font-semibold">Commande #{orderId?.slice(0, 8)}</li>
          </ol>
        </nav>

        {/* Back button */}
        <button
          onClick={() => navigate('/espace-client')}
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à mon espace
        </button>

        {/* Order header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Commande #{orderId?.slice(0, 8)}
              </h1>
              <p className="text-gray-600">
                Passée le {formatDate(order.createdAt)}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${orderStatus.color}`}>
              {orderStatus.label}
            </span>
          </div>

          {/* Order summary */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center gap-3 mb-3">
              <Package className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-gray-900">
                {order.items.length} article{order.items.length > 1 ? 's' : ''}
              </span>
            </div>
            
            <ul className="space-y-2 mb-4">
              {order.items.map((item, index) => (
                <li key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-gray-900 font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex justify-between border-t border-gray-200 pt-3">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-emerald-700 text-lg">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Tracking buttons - Requirements 1.1, 1.2, 1.3, 1.4, 1.5 */}
        {isPaymentConfirmed && (hasPhysicalProducts || hasAdminForfait || hasInstallationForfait) && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Suivi de votre commande</h2>
            
            <div className="space-y-3">
              {/* Requirement 1.1: Bouton suivi matériel */}
              {hasPhysicalProducts && (
                <TrackingButton
                  type="shipping"
                  orderId={orderId!}
                  status={getShippingStatus()}
                  onClick={() => navigate(`/orders/${orderId}/shipping`)}
                />
              )}

              {/* Requirement 1.2: Bouton suivi admin */}
              {hasAdminForfait && (
                <TrackingButton
                  type="admin"
                  orderId={orderId!}
                  status={getAdminStatus()}
                  onClick={() => navigate(`/orders/${orderId}/admin`)}
                />
              )}

              {/* Requirement 1.3: Bouton suivi installation */}
              {hasInstallationForfait && (
                <TrackingButton
                  type="installation"
                  orderId={orderId!}
                  status={getInstallationStatus()}
                  onClick={() => navigate(`/orders/${orderId}/installation`)}
                />
              )}
            </div>
          </div>
        )}

        {/* Message si paiement non confirmé - Requirement 1.5 */}
        {!isPaymentConfirmed && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-1">
                  Paiement en attente
                </h3>
                <p className="text-amber-700 text-sm">
                  Le suivi de votre commande sera disponible une fois le paiement confirmé.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Shipping address */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Adresse de livraison</h2>
          <address className="not-italic text-gray-600">
            <p className="font-medium text-gray-900">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </p>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && (
              <p>{order.shippingAddress.addressLine2}</p>
            )}
            <p>
              {order.shippingAddress.postalCode} {order.shippingAddress.city}
            </p>
            <p>{order.shippingAddress.country}</p>
            {order.shippingAddress.phone && (
              <p className="mt-2">Tél : {order.shippingAddress.phone}</p>
            )}
          </address>
        </div>
      </div>
    </div>
  );
}
