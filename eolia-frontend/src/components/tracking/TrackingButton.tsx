import { Package, FileText, Wrench, ChevronRight } from 'lucide-react';
import type { DossierStatus } from '../../types/dossier';
import { 
  shippingStatusLabels, 
  adminStatusLabels, 
  installationStatusLabels 
} from '../../types/dossier';

export type TrackingButtonType = 'shipping' | 'admin' | 'installation';

interface TrackingButtonProps {
  type: TrackingButtonType;
  orderId: string;
  status?: DossierStatus;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

const buttonConfig: Record<TrackingButtonType, {
  label: string;
  icon: typeof Package;
  colors: string;
}> = {
  shipping: {
    label: 'Suivi de ma commande',
    icon: Package,
    colors: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
  },
  admin: {
    label: 'Suivi admin – formalités',
    icon: FileText,
    colors: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
  },
  installation: {
    label: 'Suivi de mon installation',
    icon: Wrench,
    colors: 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-400',
  },
};

const getStatusLabel = (type: TrackingButtonType, status?: DossierStatus): string | null => {
  if (!status) return null;
  
  if (type === 'shipping' && status in shippingStatusLabels) {
    return shippingStatusLabels[status as keyof typeof shippingStatusLabels];
  }
  if (type === 'admin' && status in adminStatusLabels) {
    return adminStatusLabels[status as keyof typeof adminStatusLabels];
  }
  if (type === 'installation' && status in installationStatusLabels) {
    return installationStatusLabels[status as keyof typeof installationStatusLabels];
  }
  return null;
};

export default function TrackingButton({ 
  type, 
  status, 
  onClick, 
  disabled = false,
  className = '' 
}: TrackingButtonProps) {
  const config = buttonConfig[type];
  const Icon = config.icon;
  const statusLabel = getStatusLabel(type, status);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center justify-between px-4 py-3 rounded-lg
        text-white font-medium transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${config.colors}
        ${className}
      `}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <div className="text-left">
          <span className="block text-sm sm:text-base">{config.label}</span>
          {statusLabel && (
            <span className="block text-xs opacity-80 mt-0.5">
              {statusLabel}
            </span>
          )}
        </div>
      </div>
      <ChevronRight className="w-5 h-5 opacity-70" />
    </button>
  );
}
