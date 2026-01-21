import type { DossierStatus, DossierType } from '../../types/dossier';
import {
  shippingStatusLabels,
  adminStatusLabels,
  installationStatusLabels,
  statusColors,
} from '../../types/dossier';

interface StatusBadgeProps {
  status: DossierStatus;
  dossierType?: DossierType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const getStatusLabel = (status: DossierStatus, dossierType?: DossierType): string => {
  // Try to find label based on dossier type first
  if (dossierType === 'shipping' && status in shippingStatusLabels) {
    return shippingStatusLabels[status as keyof typeof shippingStatusLabels];
  }
  if ((dossierType === 'admin_enedis' || dossierType === 'admin_consuel') && status in adminStatusLabels) {
    return adminStatusLabels[status as keyof typeof adminStatusLabels];
  }
  if (dossierType === 'installation' && status in installationStatusLabels) {
    return installationStatusLabels[status as keyof typeof installationStatusLabels];
  }
  
  // Fallback: try all label maps
  if (status in shippingStatusLabels) {
    return shippingStatusLabels[status as keyof typeof shippingStatusLabels];
  }
  if (status in adminStatusLabels) {
    return adminStatusLabels[status as keyof typeof adminStatusLabels];
  }
  if (status in installationStatusLabels) {
    return installationStatusLabels[status as keyof typeof installationStatusLabels];
  }
  
  return status;
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export default function StatusBadge({ 
  status, 
  dossierType, 
  size = 'md',
  className = '' 
}: StatusBadgeProps) {
  const label = getStatusLabel(status, dossierType);
  const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800';

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${colorClass}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {label}
    </span>
  );
}
