import type { LucideIcon } from 'lucide-react';
import { Zap, Cpu, Battery, Users, Shield, Award, Globe, Leaf, MapPin, Clock, Heart } from 'lucide-react';

/**
 * Interface pour les highlights affichés sur les cartes partenaires
 */
export interface PartnerHighlight {
  icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * Interface pour les caractéristiques détaillées des partenaires
 */
export interface PartnerFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * Interface principale pour les données partenaires
 * Utilisée pour les cartes et les pages détaillées
 */
export interface Partner {
  id: string;
  name: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  country: string;
  founded?: string;
  icon: LucideIcon;
  color: 'sky' | 'emerald' | 'amber' | 'violet';
  highlights: string[];
  features: PartnerFeature[];
  certifications?: string[];
  externalUrl?: string;
  detailPath: string;
}

/**
 * Données des 4 partenaires EOLIA
 * - Fronius: Onduleurs autrichiens robustes
 * - IMEON: Onduleurs hybrides IA bretons
 * - Energiestro: Stockage par volant d'inertie
 * - Installateurs: Réseau d'électriciens certifiés
 */
export const partners: Partner[] = [
  {
    id: 'fronius',
    name: 'Fronius',
    tagline: 'La robustesse autrichienne depuis 1945',
    shortDescription: "Onduleurs de référence mondiale, conçus pour durer et parfaitement adaptés aux variations de l'éolien.",
    fullDescription: "Fronius est un leader mondial dans le domaine des onduleurs, fondé en 1945 à Pettenbach en Autriche. Avec plus de 75 ans d'expertise et plus de 3 millions d'onduleurs installés dans le monde, Fronius est synonyme de fiabilité, d'innovation et de performance. Leurs onduleurs sont particulièrement adaptés à l'éolien grâce à leur gestion exceptionnelle des variations de puissance.",
    country: 'Autriche',
    founded: '1945',
    icon: Zap,
    color: 'sky',
    highlights: [
      "75+ ans d'expertise",
      'Adapté aux variations éoliennes',
      'Garantie 10 ans extensible',
      "+3 millions d'unités installées"
    ],
    features: [
      {
        icon: Award,
        title: 'Leader mondial',
        description: "Plus de 3 millions d'onduleurs installés dans le monde, une référence du secteur."
      },
      {
        icon: Zap,
        title: 'Rendement 98%+',
        description: 'Les meilleurs rendements du marché pour maximiser votre production éolienne.'
      },
      {
        icon: Globe,
        title: 'Monitoring Solar.web',
        description: 'Plateforme de monitoring gratuite pour suivre votre production en temps réel.'
      },
      {
        icon: Shield,
        title: 'Garantie 10 ans',
        description: 'Garantie fabricant de 10 ans sur tous les onduleurs, extensible à 15 ans.'
      }
    ],
    certifications: ['VDE', 'TÜV', 'CE', 'NF C 15-100'],
    externalUrl: 'https://www.fronius.com',
    detailPath: '/partenaires/fronius'
  },
  {
    id: 'imeon',
    name: 'IMEON',
    tagline: "L'intelligence artificielle bretonne",
    shortDescription: "Onduleurs hybrides avec IA intégrée, conçus et fabriqués en Bretagne depuis 2013.",
    fullDescription: "IMEON Énergie est un fabricant français d'onduleurs hybrides intelligents, fondé en 2013 à Brest en Bretagne et coté en bourse (Euronext Growth). Leur technologie brevetée intègre une intelligence artificielle qui optimise en temps réel la gestion de votre production et consommation d'énergie. 100% conception et assemblage français.",
    country: 'France (Bretagne)',
    founded: '2013',
    icon: Cpu,
    color: 'emerald',
    highlights: [
      'IA qui apprend vos habitudes',
      'Made in Bretagne',
      'Coté en bourse',
      'Garantie 10-20 ans'
    ],
    features: [
      {
        icon: Cpu,
        title: 'IA Intégrée',
        description: "L'onduleur apprend vos habitudes de consommation et optimise automatiquement l'utilisation de votre production."
      },
      {
        icon: Battery,
        title: 'Batteries 20 ans',
        description: 'Compatible avec des batteries lithium garanties 20 ans pour une autonomie maximale.'
      },
      {
        icon: Shield,
        title: 'Garantie 10-20 ans',
        description: 'Tous les onduleurs IMEON sont garantis 10 ans, extensible à 20 ans.'
      },
      {
        icon: Leaf,
        title: 'Made in France',
        description: 'Conception et assemblage en France pour une qualité et un SAV de proximité.'
      }
    ],
    externalUrl: 'https://www.imeon-energy.com',
    detailPath: '/partenaires/imeon'
  },
  {
    id: 'energiestro',
    name: 'Energiestro',
    tagline: 'Le stockage révolutionnaire par inertie',
    shortDescription: "Volant d'inertie en béton enterré : 10 kWh de stockage, garanti à vie, zéro usure. Made in Alsace.",
    fullDescription: "Energiestro est une startup française innovante basée en Alsace qui a développé la technologie VOSS (Volant de Stockage Solide). Ce système révolutionnaire utilise un cylindre de béton armé enterré qui tourne à haute vitesse pour stocker l'énergie. Contrairement aux batteries chimiques, ce système ne s'use pas et est garanti à vie. Une alternative écologique et durable pour le stockage d'énergie, conçue et fabriquée en France.",
    country: 'France (Alsace)',
    founded: '2014',
    icon: Battery,
    color: 'amber',
    highlights: [
      'Made in Alsace',
      'Garanti à vie',
      'Aucune usure ni dégradation',
      'Zéro risque incendie'
    ],
    features: [
      {
        icon: MapPin,
        title: 'Made in Alsace',
        description: 'Startup française basée en Alsace. Conception et fabrication 100% françaises.'
      },
      {
        icon: Heart,
        title: 'Garanti à vie',
        description: 'Aucune dégradation chimique, le système fonctionne indéfiniment sans perte de capacité.'
      },
      {
        icon: Leaf,
        title: '100% Écologique',
        description: 'Béton recyclable, pas de lithium ni cobalt. Matériaux durables et respectueux de l\'environnement.'
      },
      {
        icon: Shield,
        title: 'Sécurité totale',
        description: 'Aucun risque d\'incendie ou d\'explosion. Système enterré, silencieux et invisible.'
      }
    ],
    externalUrl: 'https://energiestro.fr',
    detailPath: '/partenaires/energiestro'
  },
  {
    id: 'installateurs',
    name: 'Réseau Installateurs',
    tagline: 'Des professionnels certifiés près de chez vous',
    shortDescription: "Électriciens qualifiés et formés par EOLIA pour une installation dans les règles de l'art.",
    fullDescription: "EOLIA a constitué un réseau d'électriciens qualifiés et formés spécifiquement à l'installation d'éoliennes verticales. Chaque installateur partenaire est sélectionné selon des critères stricts : qualification professionnelle, expérience minimum de 5 ans, formation EOLIA obligatoire et assurance décennale vérifiée. Ce réseau couvre toutes les régions de France pour une intervention rapide et de qualité.",
    country: 'France',
    icon: Users,
    color: 'violet',
    highlights: [
      'Formation EOLIA certifiée',
      'Couverture nationale',
      'Garantie décennale',
      'SAV réactif'
    ],
    features: [
      {
        icon: Award,
        title: 'Formation certifiée',
        description: 'Chaque installateur suit une formation EOLIA de 2 jours sur les éoliennes verticales.'
      },
      {
        icon: MapPin,
        title: 'Couverture nationale',
        description: 'Un réseau d\'installateurs dans toutes les régions de France pour une intervention rapide.'
      },
      {
        icon: Shield,
        title: 'Garantie décennale',
        description: 'Tous nos installateurs disposent d\'une assurance décennale vérifiée.'
      },
      {
        icon: Clock,
        title: 'SAV sous 48h',
        description: 'En cas de problème, intervention garantie sous 48h par un technicien qualifié.'
      }
    ],
    detailPath: '/partenaires/installateurs'
  }
];

/**
 * Récupère un partenaire par son ID
 */
export function getPartnerById(id: string): Partner | undefined {
  return partners.find(partner => partner.id === id);
}

/**
 * Récupère tous les partenaires
 */
export function getAllPartners(): Partner[] {
  return partners;
}
