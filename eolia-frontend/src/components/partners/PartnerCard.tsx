import { Link } from 'react-router-dom';
import { ArrowRight, Check, ExternalLink } from 'lucide-react';
import type { Partner } from '../../data/partners';

interface PartnerCardProps {
  partner: Partner;
}

/**
 * Mapping des couleurs par partenaire
 * Utilisé pour les icônes, bordures et effets hover
 */
const colorClasses = {
  sky: {
    bg: 'bg-sky-100',
    text: 'text-sky-600',
    border: 'hover:border-sky-400',
    button: 'bg-sky-600 hover:bg-sky-700',
    check: 'text-sky-500',
  },
  emerald: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-600',
    border: 'hover:border-emerald-400',
    button: 'bg-emerald-600 hover:bg-emerald-700',
    check: 'text-emerald-500',
  },
  amber: {
    bg: 'bg-amber-100',
    text: 'text-amber-600',
    border: 'hover:border-amber-400',
    button: 'bg-amber-600 hover:bg-amber-700',
    check: 'text-amber-500',
  },
  violet: {
    bg: 'bg-violet-100',
    text: 'text-violet-600',
    border: 'hover:border-violet-400',
    button: 'bg-violet-600 hover:bg-violet-700',
    check: 'text-violet-500',
  },
};

/**
 * Composant carte partenaire réutilisable
 * Affiche les informations clés d'un partenaire avec un design cohérent
 */
export default function PartnerCard({ partner }: PartnerCardProps) {
  const Icon = partner.icon;
  const colors = colorClasses[partner.color];

  return (
    <div className={`group bg-white rounded-xl shadow-lg border border-gray-100 ${colors.border} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full`}>
      {/* Header avec icône */}
      <div className="p-6 pb-4">
        <div className={`w-14 h-14 ${colors.bg} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-7 h-7 ${colors.text}`} />
        </div>
        
        {/* Nom et tagline */}
        <h3 className="font-bold text-xl text-gray-900 mb-1">
          {partner.name}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {partner.tagline}
        </p>
        
        {/* Description courte */}
        <p className="text-gray-600 text-sm leading-relaxed">
          {partner.shortDescription}
        </p>
      </div>

      {/* Highlights avec checkmarks */}
      <div className="px-6 pb-4 flex-grow">
        <ul className="space-y-2">
          {partner.highlights.map((highlight, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <Check className={`w-4 h-4 ${colors.check} flex-shrink-0 mt-0.5`} />
              <span className="text-gray-600">{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bouton CTA */}
      <div className="p-6 pt-4 border-t border-gray-100">
        <Link
          to={partner.detailPath}
          className={`w-full flex items-center justify-center gap-2 ${colors.button} text-white px-4 py-2.5 rounded-full font-medium transition-colors`}
        >
          En savoir plus
          <ArrowRight className="w-4 h-4" />
        </Link>
        
        {/* Lien externe optionnel */}
        {partner.externalUrl && (
          <a
            href={partner.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Visiter le site officiel
          </a>
        )}
      </div>
    </div>
  );
}
