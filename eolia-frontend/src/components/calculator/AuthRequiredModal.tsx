import { useNavigate } from 'react-router-dom';
import { X, LogIn, UserPlus, Save } from 'lucide-react';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectPath: string;
}

export default function AuthRequiredModal({
  isOpen,
  onClose,
  redirectPath,
}: AuthRequiredModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    navigate(`/connexion?redirect=${encodeURIComponent(redirectPath)}`);
  };

  const handleRegister = () => {
    onClose();
    navigate(`/inscription?redirect=${encodeURIComponent(redirectPath)}`);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="relative bg-primary/5 p-6 pb-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Fermer"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>

          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Save className="h-8 w-8 text-primary" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 text-center">
            Connectez-vous pour sauvegarder
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 text-center mb-6">
            Créez un compte ou connectez-vous pour retrouver cette simulation dans votre espace client.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleLogin}
              className="w-full px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="h-5 w-5" />
              Se connecter
            </button>

            <button
              onClick={handleRegister}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="h-5 w-5" />
              Créer un compte
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Votre simulation sera automatiquement sauvegardée après connexion.
          </p>
        </div>
      </div>
    </div>
  );
}
