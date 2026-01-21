/**
 * AdminDashboard - Dashboard principal avec KPIs
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Wrench,
  Zap,
  FileCheck,
  Loader2,
  AlertCircle,
  RefreshCw,
  List,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import KPICard from '../../components/admin/KPICard';
import { adminService } from '../../services/adminService';
import type { AdminStats } from '../../services/adminService';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminService.getStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="text-gray-600 mt-1">Vue d'ensemble des indicateurs clés</p>
          </div>
          <button
            onClick={loadStats}
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
                onClick={loadStats}
                className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && !stats && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
          </div>
        )}

        {/* KPI Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Commandes payées à traiter"
              count={stats.confirmedOrders}
              icon={ShoppingBag}
              iconColor="text-emerald-600"
              iconBgColor="bg-emerald-100"
              linkTo="/admin/orders?status=confirmed"
              linkLabel="Voir les commandes"
            />
            <KPICard
              title="Installations en attente"
              count={stats.pendingInstallations}
              icon={Wrench}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-100"
              linkTo="/admin/orders?dossierType=installation"
              linkLabel="Voir les installations"
            />
            <KPICard
              title="Enedis en attente"
              count={stats.pendingEnedis}
              icon={Zap}
              iconColor="text-amber-600"
              iconBgColor="bg-amber-100"
              linkTo="/admin/orders?dossierType=admin_enedis"
              linkLabel="Voir les dossiers"
            />
            <KPICard
              title="Consuel en attente"
              count={stats.pendingConsuel}
              icon={FileCheck}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-100"
              linkTo="/admin/orders?dossierType=admin_consuel"
              linkLabel="Voir les dossiers"
            />
          </div>
        )}

        {/* Liens rapides */}
        {stats && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Accès rapide</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/admin/orders"
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
              >
                <List className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-gray-900">Toutes les commandes</p>
                  <p className="text-sm text-gray-500">{stats.totalOrders} commandes au total</p>
                </div>
              </Link>
              <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <ShoppingBag className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Chiffre d'affaires</p>
                  <p className="text-sm text-gray-500">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(stats.totalRevenue / 100)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
