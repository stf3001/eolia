/**
 * KPICard - Composant affichant un indicateur clé avec compteur et lien
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */

import { Link } from 'react-router-dom';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface KPICardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  linkTo: string;
  linkLabel?: string;
}

export default function KPICard({
  title,
  count,
  icon: Icon,
  iconColor,
  iconBgColor,
  linkTo,
  linkLabel = 'Voir détails',
}: KPICardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
      {/* Header avec icône */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${iconBgColor}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>

      {/* Compteur */}
      <div className="mb-2">
        <span className="text-3xl font-bold text-gray-900">{count}</span>
      </div>

      {/* Titre */}
      <h3 className="text-sm font-medium text-gray-600 mb-4">{title}</h3>

      {/* Lien vers liste filtrée */}
      <Link
        to={linkTo}
        className="mt-auto flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
      >
        {linkLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
