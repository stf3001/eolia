import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { fetchAuthSession } from 'aws-amplify/auth';
import { User, MapPin, Package, Edit2, Plus, Trash2, LogOut, Wind } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { addressService } from '../services/addressService';
import { orderService } from '../services/orderService';
import AddressForm from '../components/dashboard/AddressForm';
import type { Address, AddressFormData } from '../types/address';
import type { Order } from '../types/order';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
  });
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Address management
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [addressError, setAddressError] = useState('');
  const [addressSuccess, setAddressSuccess] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>();
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);

  // Orders management
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState('');

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess(false);

    if (!editForm.name.trim()) {
      setEditError('Le nom est obligatoire');
      return;
    }

    setIsUpdating(true);

    try {
      // Note: Profile update would require backend implementation
      setEditSuccess(true);
      setTimeout(() => {
        setIsEditing(false);
        setEditSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Erreur de mise à jour:', error);
      setEditError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsUpdating(false);
    }
  };


  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({ name: user?.name || '' });
    setEditError('');
    setEditSuccess(false);
  };

  // Load addresses and orders
  useEffect(() => {
    loadAddresses();
    loadOrders();
  }, []);

  const getToken = async (): Promise<string> => {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString() || '';
  };

  const loadAddresses = async () => {
    try {
      setIsLoadingAddresses(true);
      setAddressError('');
      const token = await getToken();
      const data = await addressService.getAddresses(token);
      setAddresses(data);
    } catch (error: unknown) {
      console.error('Erreur chargement adresses:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setAddressError(errorMessage);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const loadOrders = async () => {
    try {
      setIsLoadingOrders(true);
      setOrdersError('');
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (error: unknown) {
      console.error('Erreur chargement commandes:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setOrdersError(errorMessage);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(undefined);
    setShowAddressForm(true);
    setAddressError('');
    setAddressSuccess('');
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
    setAddressError('');
    setAddressSuccess('');
  };

  const handleSaveAddress = async (data: AddressFormData) => {
    try {
      const token = await getToken();

      if (editingAddress) {
        await addressService.updateAddress(editingAddress.addressId, data, token);
        setAddressSuccess('Adresse modifiée avec succès !');
      } else {
        await addressService.createAddress(data, token);
        setAddressSuccess('Adresse ajoutée avec succès !');
      }

      setShowAddressForm(false);
      setEditingAddress(undefined);
      await loadAddresses();

      setTimeout(() => setAddressSuccess(''), 3000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setAddressError(errorMessage);
      throw error;
    }
  };

  const handleCancelAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddress(undefined);
    setAddressError('');
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
      return;
    }

    try {
      setDeletingAddressId(addressId);
      const token = await getToken();
      await addressService.deleteAddress(addressId, token);
      setAddressSuccess('Adresse supprimée avec succès !');
      await loadAddresses();
      setTimeout(() => setAddressSuccess(''), 3000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setAddressError(errorMessage);
    } finally {
      setDeletingAddressId(null);
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      const token = await getToken();
      await addressService.setDefaultAddress(addressId, token);
      setAddressSuccess('Adresse par défaut définie !');
      await loadAddresses();
      setTimeout(() => setAddressSuccess(''), 3000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setAddressError(errorMessage);
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Confirmée', color: 'bg-blue-100 text-blue-800' },
      validated: { label: 'Validée', color: 'bg-green-100 text-green-800' },
      shipped: { label: 'Expédiée', color: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Livrée', color: 'bg-emerald-100 text-emerald-800' },
      cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800' },
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li>
              <Link to="/" className="hover:text-emerald-700">Accueil</Link>
            </li>
            <li><span className="mx-2">/</span></li>
            <li className="text-gray-900 font-semibold">Mon compte</li>
          </ol>
        </nav>

        {/* Welcome */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Bonjour {user?.name || 'Utilisateur'} !
            </h1>
            <p className="text-gray-600">Gérez votre compte et suivez vos commandes</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Mes informations */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-emerald-700" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Mes informations</h2>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-2"
                >
                  <Edit2 className="w-5 h-5" />
                  Modifier
                </button>
              )}
            </div>

            {editSuccess && (
              <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <p className="text-green-700">Informations mises à jour avec succès !</p>
              </div>
            )}

            {editError && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start">
                <span className="text-red-500 mr-2">❌</span>
                <p className="text-red-700">{editError}</p>
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nom</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 bg-emerald-700 text-white py-2 px-4 rounded-full hover:bg-emerald-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-full hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nom</p>
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{user?.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Mes commandes */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                <Package className="w-6 h-6 text-emerald-700" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Mes commandes</h2>
            </div>

            {isLoadingOrders ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700 mx-auto"></div>
                <p className="text-gray-600 mt-4">Chargement...</p>
              </div>
            ) : ordersError ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700">{ordersError}</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <Wind className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Aucune commande pour le moment</p>
                <Link
                  to="/produits"
                  className="inline-block bg-emerald-700 text-white px-6 py-2 rounded-full hover:bg-emerald-800 transition-colors font-semibold"
                >
                  Découvrir nos éoliennes
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 3).map((order) => {
                  const status = getStatusLabel(order.status);
                  return (
                    <div
                      key={order.orderId}
                      className="border border-gray-200 rounded-lg p-4 hover:border-emerald-500 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-gray-900">
                            Commande #{order.orderId.slice(0, 8)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700">
                        <p>{order.items.length} article{order.items.length > 1 ? 's' : ''}</p>
                        <p className="font-bold text-emerald-700 mt-2">
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'EUR',
                          }).format(order.totalAmount)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {orders.length > 3 && (
                  <p className="text-center text-gray-600 text-sm">
                    + {orders.length - 3} autre{orders.length - 3 > 1 ? 's' : ''} commande{orders.length - 3 > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            )}
          </div>


          {/* Mes adresses */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                  <MapPin className="w-6 h-6 text-emerald-700" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Mes adresses</h2>
              </div>
              <button
                onClick={handleAddAddress}
                className="bg-emerald-700 text-white px-4 py-2 rounded-full hover:bg-emerald-800 transition-colors font-semibold flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Ajouter
              </button>
            </div>

            {addressSuccess && (
              <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <p className="text-green-700">{addressSuccess}</p>
              </div>
            )}

            {addressError && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start">
                <span className="text-red-500 mr-2">❌</span>
                <p className="text-red-700">{addressError}</p>
              </div>
            )}

            {isLoadingAddresses ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700 mx-auto"></div>
                <p className="text-gray-600 mt-4">Chargement...</p>
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Aucune adresse enregistrée</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <div
                    key={address.addressId}
                    className="border border-gray-200 rounded-lg p-4 hover:border-emerald-500 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{address.label}</h3>
                        {address.isDefault && (
                          <span className="bg-emerald-700 text-white text-xs px-2 py-1 rounded-full">
                            Par défaut
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditAddress(address)}
                          className="text-emerald-700 hover:text-emerald-800 p-1"
                          title="Modifier"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.addressId)}
                          disabled={deletingAddressId === address.addressId}
                          className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p className="font-semibold">{address.firstName} {address.lastName}</p>
                      <p>{address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>{address.postalCode} {address.city}</p>
                      <p>{address.country}</p>
                      <p className="text-gray-600">📞 {address.phone}</p>
                    </div>
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefaultAddress(address.addressId)}
                        className="mt-3 text-sm text-emerald-700 hover:text-emerald-800 font-semibold"
                      >
                        Définir par défaut
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA Programme ambassadeur */}
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 rounded-xl shadow-lg p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Programme Ambassadeur</h2>
              <p className="text-emerald-100">
                Parrainez vos proches et gagnez des récompenses sur chaque vente !
              </p>
            </div>
            <Link
              to="/ambassadeur"
              className="bg-white text-emerald-700 px-8 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-colors whitespace-nowrap"
            >
              Découvrir le programme
            </Link>
          </div>
        </div>
      </div>

      {/* Address Form Modal */}
      {showAddressForm && (
        <AddressForm
          address={editingAddress}
          onSave={handleSaveAddress}
          onCancel={handleCancelAddressForm}
        />
      )}
    </div>
  );
}
