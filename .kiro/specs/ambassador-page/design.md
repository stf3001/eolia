# Design Document

## Overview

Ce document décrit la conception technique pour implémenter la page Ambassadeur publique d'EOLIA, inspirée d'Hydrolia. L'implémentation modifie la page Ambassador existante pour afficher une présentation publique aux visiteurs non connectés, tout en conservant le dashboard pour les utilisateurs authentifiés.

## Architecture

### Approche Générale

La solution utilise l'architecture existante avec des modifications minimales :

1. **Modification du Header** : Ajout du lien "Ambassadeur" dans la navigation
2. **Modification du routage** : Retrait du ProtectedRoute sur /ambassadeur
3. **Refactoring de Ambassador.tsx** : Séparation présentation publique / dashboard

```
┌─────────────────────────────────────────────────────────────┐
│                         Header                               │
│  [Accueil] [Calculateur] [Produits] [FAQ] [Ambassadeur] ... │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    /ambassadeur route
                              │
              ┌───────────────┴───────────────┐
              │                               │
        Non connecté                    Connecté
              │                               │
              ▼                               ▼
    AmbassadorPresentation          AmbassadorDashboard
    (page publique)                 (existant)
```

## Components and Interfaces

### 1. Header.tsx (Modification)

Ajout du lien "Ambassadeur" dans `navLinks` :

```typescript
const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/calculateur', label: 'Calculateur' },
  { to: '/produits', label: 'Gamme Tulipe' },
  { to: '/faq', label: 'FAQ' },
  { to: '/ambassadeur', label: 'Ambassadeur' },  // NOUVEAU
  { to: '/espace-client', label: 'Espace Client' },
]
```

### 2. App.tsx (Modification)

Retrait du ProtectedRoute sur la route /ambassadeur :

```typescript
// Avant
<Route path="/ambassadeur" element={<ProtectedRoute><Ambassador /></ProtectedRoute>} />

// Après
<Route path="/ambassadeur" element={<Ambassador />} />
```

### 3. Ambassador.tsx (Refactoring)

Structure du composant refactoré :

```typescript
export default function Ambassador() {
  const { isAuthenticated } = useAuth();
  
  // Si non connecté → afficher la présentation publique
  if (!isAuthenticated) {
    return <AmbassadorPresentation />;
  }
  
  // Si connecté → afficher le dashboard (code existant)
  return <AmbassadorDashboard />;
}
```

### 4. AmbassadorPresentation (Nouveau composant interne)

Structure de la page de présentation :

```
┌─────────────────────────────────────────────────────────────┐
│                      HERO SECTION                            │
│  "Devenez Ambassadeur EOLIA"                                │
│  Description + 2 CTAs                                        │
│  [Devenir ambassadeur] [Espace ambassadeur]                 │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│              POURQUOI DEVENIR AMBASSADEUR                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Revenus  │ │ Planète  │ │ Énergie  │ │ Cadeaux  │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│              DEUX PROGRAMMES ADAPTÉS                         │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │  PARTICULIER (B2C)  │  │ PROFESSIONNEL (B2B) │          │
│  │  - 200€-300€/filleul│  │ - 5% à 12.5%        │          │
│  │  - Max 10/an        │  │ - Sans limite       │          │
│  │  - Bons d'achat     │  │ - Euros             │          │
│  │  [CTA inscription]  │  │ [CTA B2B]           │          │
│  └─────────────────────┘  └─────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│              NOS EXIGENCES                                   │
│  1. Transparence absolue                                     │
│  2. Conformité légale                                        │
│  3. Protection de l'image                                    │
│  + Cartes support/formation                                  │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│              CTA FINAL                                       │
│  "Prêt à rejoindre l'aventure ?"                            │
│  [Créer mon compte] [FAQ]                                   │
└─────────────────────────────────────────────────────────────┘
```

## Data Models

Aucun nouveau modèle de données requis. Utilisation des types existants :

```typescript
// types/affiliate.ts (existant)
export const B2C_REWARDS = [
  { referral: 1, amount: 200 },
  { referral: 2, amount: 250 },
  { referral: 3, amount: 300 },
  // ... jusqu'à 10
];

export const B2B_COMMISSION_TIERS = [
  { minRevenue: 0, maxRevenue: 9999, rate: 5, label: 'CA 0€ - 9 999€' },
  { minRevenue: 10000, maxRevenue: 49999, rate: 7.5, label: 'CA 10 000€ - 49 999€' },
  { minRevenue: 50000, maxRevenue: 99999, rate: 10, label: 'CA 50 000€ - 99 999€' },
  { minRevenue: 100000, maxRevenue: Infinity, rate: 12.5, label: 'CA ≥ 100 000€' },
];
```

## Error Handling

- **Erreur de chargement profil** : Afficher la présentation publique par défaut
- **Erreur réseau** : Message d'erreur avec bouton "Réessayer" (existant dans le dashboard)

## Testing Strategy

Tests manuels recommandés :
1. Vérifier le lien "Ambassadeur" dans le header (desktop et mobile)
2. Accéder à /ambassadeur sans être connecté → voir la présentation
3. Se connecter puis accéder à /ambassadeur → voir le dashboard
4. Tester les CTAs de la présentation (inscription, connexion, B2B)
5. Vérifier le responsive design sur mobile

## Visual Design

### Palette de couleurs

- **Primaire** : emerald-600 (#059669) - couleur EOLIA
- **B2C Card** : emerald-50 à emerald-100, border emerald-200
- **B2B Card** : purple-50 à purple-100, border purple-200
- **Hero gradient** : from-emerald-600 to-emerald-800
- **CTA Final** : bg-emerald-700

### Icônes (Lucide React)

- Revenus : `Coins`
- Planète : `Leaf`
- Énergie : `Zap` ou `Wind`
- Cadeaux : `Gift`
- Particulier : `Users`
- Professionnel : `Building2`
- Règles : `Shield`, `AlertCircle`
- Support : `GraduationCap`, `Phone`, `FileText`

### Animations

Utilisation optionnelle de transitions CSS simples (pas de framer-motion pour rester léger) :
- Hover sur les cartes : `hover:shadow-xl transition-shadow`
- Hover sur les boutons : `hover:bg-emerald-700 transition-colors`
