import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { fetchAuthSession } from 'aws-amplify/auth';
import { User, MapPin, Package, Edit2, Plus, Trash2, LogOut, Wind, BarChart3, Wrench, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { addressService } from '../services/addressService';
import { orderService } from '../services/orderService';
import { simulationService } from '../services/simulationService';
import AddressForm from '../components/dashboard/AddressForm';
import SimulationCard from '../components/dashboard/SimulationCard';
import type { Address, AddressFormData } from '../types/address';
import type { Order } from '../types/order';
import type { SavedSimulation } from '../types/simulation';

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
  const [showAllAddresses, setShowAllAddresses] = useState(false);

  // Orders management
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState('');

  // Simulations management
  const [simulations, setSimulations] = useState<SavedSimulation[]>([]);
  const [isLoadingSimulations, setIsLoadingSimulations] = useState(true);
  const [simulationsError, setSimulationsError] = useState('');
  const [deletingSimulationId, setDeletingSimulationId] = useState<string | null>(null);

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

  useEffect(() => {
    loadAddresses();
    loadOrders();
    loadSimulations();
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

  const loadSimulations = async () => {
    try {
      setIsLoadingSimulations(true);
      setSimulationsError('');
      const data = await simulationService.getSimulations();
      setSimulations(data);
    } catch (error: unknown) {
      console.error('Erreur chargement simulations:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setSimulationsError(errorMessage);
    } finally {
      setIsLoadingSimulations(false);
    }
  };

  const handleDeleteSimulation = async (simulationId: string) => {
    try {
      setDeletingSimulationId(simulationId);
      await simulationService.deleteSimulation(simulationId);
      await loadSimulations();
    } catch (error: unknown) {
      console.error('Erreur suppression simulation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setSimulationsError(errorMessage);
    } finally {
      setDeletingSimulationId(null);
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
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) return;
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

  const defaultAddress = addresses.find(a => a.isDefault);
  const displayedAddresses = showAllAddresses ? addresses : (defaultAddress ? [defaultAddress] : addresses.slice(0, 1));

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li><Link to="/" className="hover:text-emerald-700">Accueil</Link></li>
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
            <p className="text-gray-600">Gérez votre compte et suivez vos projets éoliens</p>
          </div>
          <button onClick={handleSignOut} className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </div>

        {/* Section principale : Anémomètre + Simulations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Prêt d'anémomètre - VALORISÉ */}
          <Link to="/anemometre" className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all group border-2 border-blue-200 hover:border-blue-400">
            <div className="flex items-center mb-4">
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <Wind className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Prêt d'anémomètre</h3>
                <span className="text-blue-600 text-sm font-semibold">Gratuit pendant 1 mois</span>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Mesurez le potentiel éolien de votre site avec notre anémomètre professionnel. Obtenez des données précises pour optimiser votre installation.
            </p>
            <span className="inline-flex items-center gap-2 text-blue-700 font-semibold group-hover:gap-3 transition-all">
              Commander gratuitement <ArrowRight className="w-5 h-5" />
            </span>
          </Link>

          {/* Mes simulations - VALORISÉ */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-lg p-6 border-2 border-amber-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-amber-600 rounded-full flex items-center justify-center mr-4">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Mes simulations</h3>
                  <span className="text-amber-600 text-sm font-semibold">{simulations.length} simulation{simulations.length > 1 ? 's' : ''} sauvegardée{simulations.length > 1 ? 's' : ''}</span>
                </div>
              </div>
              <Link to="/calculateur" className="bg-amber-600 text-white px-4 py-2 rounded-full hover:bg-amber-700 transition-colors font-semibold flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4" />
                Nouvelle
              </Link>
            </div>

            {simulationsError && (
              <div className="mb-3 bg-red-50 border-l-4 border-red-500 p-3 rounded text-sm">
                <p className="text-red-700">{simulationsError}</p>
              </div>
            )}

            {isLoadingSimulations ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
              </div>
            ) : simulations.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-3">Aucune simulation sauvegardée</p>
                <Link to="/calculateur" className="inline-flex items-center gap-2 text-amber-700 font-semibold hover:gap-3 transition-all">
                  Faire une simulation <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {simulations.slice(0, 2).map((simulation) => (
                  <SimulationCard
                    key={simulation.simulationId}
                    simulation={simulation}
                    onDelete={handleDeleteSimulation}
                    isDeleting={deletingSimulationId === simulation.simulationId}
                    compact
                  />
                ))}
                {simulations.length > 2 && (
                  <Link to="/calculateur" className="block text-center text-amber-700 font-semibold text-sm hover:underline">
                    Voir les {simulations.length - 2} autres →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Section secondaire : Infos + Commandes + Adresses */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Mes informations - Compact */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-emerald-700" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Mes informations</h2>
              </div>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="text-emerald-700 hover:text-emerald-800 p-1">
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {editSuccess && <div className="mb-3 bg-green-50 border-l-4 border-green-500 p-2 rounded text-sm text-green-700">Mis à jour !</div>}
            {editError && <div className="mb-3 bg-red-50 border-l-4 border-red-500 p-2 rounded text-sm text-red-700">{editError}</div>}

            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="space-y-3">
                <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none text-sm" placeholder="Nom" />
                <div className="flex gap-2">
                  <button type="submit" disabled={isUpdating} className="flex-1 bg-emerald-700 text-white py-2 px-3 rounded-full hover:bg-emerald-800 text-sm font-semibold disabled:opacity-50">
                    {isUpdating ? '...' : 'OK'}
                  </button>
                  <button type="button" onClick={handleCancelEdit} disabled={isUpdating} className="flex-1 bg-gray-200 text-gray-700 py-2 px-3 rounded-full hover:bg-gray-300 text-sm font-semibold">
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-gray-900">{user?.name}</p>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            )}
          </div>

          {/* Mes commandes - Compact */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                <Package className="w-5 h-5 text-emerald-700" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Mes commandes</h2>
            </div>

            {isLoadingOrders ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-700 mx-auto"></div>
              </div>
            ) : ordersError ? (
              <p className="text-red-600 text-sm">{ordersError}</p>
            ) : orders.length === 0 ? (
              <div className="text-center py-2">
                <p className="text-gray-600 text-sm mb-2">Aucune commande</p>
                <Link to="/produits" className="text-emerald-700 font-semibold text-sm hover:underline">
                  Découvrir nos éoliennes →
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {orders.slice(0, 2).map((order) => {
                  const status = getStatusLabel(order.status);
                  return (
                    <div key={order.orderId} className="border border-gray-200 rounded-lg p-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">#{order.orderId.slice(0, 8)}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}>{status.label}</span>
                      </div>
                      <p className="text-emerald-700 font-bold">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(order.totalAmount)}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mes adresses - Compact */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                  <MapPin className="w-5 h-5 text-emerald-700" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Mes adresses</h2>
              </div>
              <button onClick={handleAddAddress} className="text-emerald-700 hover:text-emerald-800 p-1">
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {addressSuccess && <div className="mb-2 bg-green-50 border-l-4 border-green-500 p-2 rounded text-xs text-green-700">{addressSuccess}</div>}
            {addressError && <div className="mb-2 bg-red-50 border-l-4 border-red-500 p-2 rounded text-xs text-red-700">{addressError}</div>}

            {isLoadingAddresses ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-700 mx-auto"></div>
              </div>
            ) : addresses.length === 0 ? (
              <p className="text-gray-600 text-sm text-center py-2">Aucune adresse</p>
            ) : (
              <div className="space-y-2">
                {displayedAddresses.map((address) => (
                  <div key={address.addressId} className="border border-gray-200 rounded-lg p-2 text-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">{address.label}</span>
                        {address.isDefault && <span className="bg-emerald-700 text-white text-xs px-1.5 py-0.5 rounded">Défaut</span>}
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => handleEditAddress(address)} className="text-emerald-700 hover:text-emerald-800 p-0.5"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteAddress(address.addressId)} disabled={deletingAddressId === address.addressId} className="text-red-500 hover:text-red-700 p-0.5 disabled:opacity-50"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-xs">{address.postalCode} {address.city}</p>
                  </div>
                ))}
                {addresses.length > 1 && (
                  <button onClick={() => setShowAllAddresses(!showAllAddresses)} className="w-full text-center text-emerald-700 font-semibold text-xs flex items-center justify-center gap-1 hover:underline">
                    {showAllAddresses ? <><ChevronUp className="w-3 h-3" /> Réduire</> : <><ChevronDown className="w-3 h-3" /> Voir les {addresses.length} adresses</>}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* SAV & Support */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-6">
          <Link to="/faq" className="flex items-center justify-between group">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors">
                <Wrench className="w-5 h-5 text-purple-700" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">SAV & Support</h3>
                <p className="text-gray-600 text-sm">Besoin d'aide ? Consultez notre FAQ ou contactez-nous.</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-purple-700 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* CTA Programme ambassadeur */}
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold mb-1">Programme Ambassadeur</h2>
              <p className="text-emerald-100 text-sm">Parrainez vos proches et gagnez des récompenses sur chaque vente !</p>
            </div>
            <Link to="/ambassadeur" className="bg-white text-emerald-700 px-6 py-2 rounded-full font-semibold hover:bg-emerald-50 transition-colors whitespace-nowrap text-sm">
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
