/**
 * AdminLayout - Wrapper pour les pages admin avec vérification de session
 * Requirements: 1.4, 1.5
 */

import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Wind, LogOut, LayoutDashboard, ShoppingBag, Loader2 } from 'lucide-react';
import { adminService } from '../../services/adminService';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      // Vérifier si un token existe
      if (!adminService.hasToken()) {
        navigate('/admin', { replace: true });
        return;
      }

      // Vérifier la validité du token
      const isValid = await adminService.verify();
      if (!isValid) {
        navigate('/admin', { replace: true });
        return;
      }

      setIsAuthenticated(true);
      setIsVerifying(false);
    };

    verifyToken();
  }, [navigate]);

  const handleLogout = () => {
    adminService.logout();
    navigate('/admin', { replace: true });
  };

  const isActive = (path: string) => location.pathname === path;

  // Afficher un loader pendant la vérification
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
          <p className="text-gray-600">Vérification de la session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Admin */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <Wind className="h-8 w-8 text-emerald-600" />
              <span className="text-2xl font-bold text-emerald-600">EOLIA</span>
              <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">
                Admin
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/admin/dashboard"
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  isActive('/admin/dashboard')
                    ? 'text-emerald-600'
                    : 'text-gray-600 hover:text-emerald-600'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="/admin/orders"
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  isActive('/admin/orders') || location.pathname.startsWith('/admin/orders/')
                    ? 'text-emerald-600'
                    : 'text-gray-600 hover:text-emerald-600'
                }`}
              >
                <ShoppingBag className="h-4 w-4" />
                Commandes
              </Link>
            </nav>

            {/* Bouton déconnexion */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-[1400px] mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
