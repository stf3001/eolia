# Requirements Document

## Introduction

Ce document définit les exigences pour l'optimisation visuelle du site EOLIA. L'objectif est de réduire l'impression de vide, densifier l'affichage, mieux utiliser la largeur disponible et rendre les cartes plus compactes tout en conservant une bonne lisibilité, une expérience mobile-first et le respect de l'identité visuelle EOLIA (couleurs sky-600, tons verts, design épuré et moderne).

## Glossaire

- **EOLIA_UI**: Le système d'interface utilisateur du site EOLIA (frontend React/Tailwind)
- **Carte produit**: Composant ProductCard affichant un produit dans la grille catalogue
- **Container principal**: Élément max-w-7xl qui limite la largeur du contenu
- **Densité visuelle**: Ratio entre le contenu affiché et l'espace blanc disponible
- **Breakpoint**: Point de rupture responsive (sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px)
- **Mobile-first**: Approche de design où le mobile est la base, enrichie progressivement pour les écrans plus grands

## Requirements

### Requirement 1: Élargir le container principal

**User Story:** En tant qu'utilisateur, je veux que le contenu utilise mieux la largeur de mon écran, afin de réduire les marges vides sur les côtés.

#### Acceptance Criteria

1. WHEN l'utilisateur affiche le site sur un écran large (>1536px), THE EOLIA_UI SHALL afficher le contenu avec une largeur maximale de 1536px (max-w-7xl → max-w-screen-2xl ou équivalent).
2. WHEN l'utilisateur affiche le site sur un écran standard (1280-1536px), THE EOLIA_UI SHALL utiliser au minimum 90% de la largeur disponible.
3. THE EOLIA_UI SHALL conserver des marges latérales de 16px minimum sur mobile et 32px sur desktop pour la lisibilité.

### Requirement 2: Compacter les cartes produits

**User Story:** En tant qu'utilisateur, je veux voir plus de produits à l'écran sans scroller, afin de comparer plus facilement les options.

#### Acceptance Criteria

1. THE EOLIA_UI SHALL afficher les cartes produits avec un ratio d'image de 4:3 au lieu de 1:1 (aspect-square → aspect-[4/3]).
2. WHEN l'utilisateur affiche la page produits sur desktop (≥1280px), THE EOLIA_UI SHALL afficher 4 à 5 produits par ligne.
3. THE EOLIA_UI SHALL réduire le padding interne des cartes de 16px à 12px (p-4 → p-3).
4. THE EOLIA_UI SHALL utiliser une taille de police réduite pour les specs secondaires (text-sm → text-xs).

### Requirement 3: Réduire les espacements verticaux

**User Story:** En tant qu'utilisateur, je veux voir plus de contenu sans scroller excessivement, afin d'avoir une vue d'ensemble plus rapide.

#### Acceptance Criteria

1. THE EOLIA_UI SHALL réduire le padding vertical des sections de py-12/py-14 à py-8/py-10.
2. THE EOLIA_UI SHALL réduire les gaps entre les éléments de grille de gap-8 à gap-4 ou gap-6.
3. THE EOLIA_UI SHALL réduire les marges entre les titres et le contenu (mb-10/mb-12 → mb-6/mb-8).

### Requirement 4: Optimiser le Dashboard

**User Story:** En tant qu'utilisateur connecté, je veux voir toutes mes informations importantes sans scroller, afin d'accéder rapidement à mes données.

#### Acceptance Criteria

1. THE EOLIA_UI SHALL afficher les cartes du dashboard avec un padding réduit (p-6 → p-4).
2. WHEN l'utilisateur affiche le dashboard sur desktop, THE EOLIA_UI SHALL organiser les sections secondaires sur 3 colonnes minimum.
3. THE EOLIA_UI SHALL utiliser des icônes de taille 40px au lieu de 56px pour les en-têtes de section (w-14 h-14 → w-10 h-10).

### Requirement 5: Optimiser la page d'accueil

**User Story:** En tant qu'utilisateur, je veux que la page d'accueil soit plus dense et impactante, afin de voir rapidement les informations clés.

#### Acceptance Criteria

1. THE EOLIA_UI SHALL réduire la hauteur du hero section en diminuant le padding vertical (py-6 lg:py-8 → py-4 lg:py-6).
2. THE EOLIA_UI SHALL afficher les cartes "avantages" avec un padding réduit (p-6 → p-4).
3. THE EOLIA_UI SHALL réduire la taille des icônes d'avantages de 56px à 48px (w-14 h-14 → w-12 h-12).
4. THE EOLIA_UI SHALL afficher les étapes "Comment ça marche" de manière plus compacte avec des cercles de 48px au lieu de 64px.

### Requirement 6: Améliorer la grille responsive

**User Story:** En tant qu'utilisateur sur différents appareils, je veux que l'affichage s'adapte de manière optimale à ma taille d'écran.

#### Acceptance Criteria

1. WHEN l'utilisateur affiche le site sur un écran 2xl (≥1536px), THE EOLIA_UI SHALL afficher 5 produits par ligne dans le catalogue.
2. WHEN l'utilisateur affiche le site sur un écran xl (1280-1535px), THE EOLIA_UI SHALL afficher 4 produits par ligne.
3. WHEN l'utilisateur affiche le site sur un écran lg (1024-1279px), THE EOLIA_UI SHALL afficher 3 produits par ligne.
4. THE EOLIA_UI SHALL utiliser des breakpoints cohérents sur toutes les pages.

### Requirement 7: Garantir l'expérience mobile

**User Story:** En tant qu'utilisateur mobile, je veux une expérience fluide et lisible sans compromis sur la densité desktop.

#### Acceptance Criteria

1. THE EOLIA_UI SHALL conserver un padding horizontal minimum de 16px (px-4) sur mobile.
2. THE EOLIA_UI SHALL afficher 1 produit par ligne sur mobile (<640px) et 2 sur tablette (640-1023px).
3. THE EOLIA_UI SHALL conserver des tailles de police lisibles sur mobile (minimum 14px pour le corps de texte).
4. THE EOLIA_UI SHALL garantir des zones tactiles de 44px minimum pour les boutons et liens interactifs.
5. WHEN l'utilisateur affiche le site sur mobile, THE EOLIA_UI SHALL masquer les éléments décoratifs non essentiels (floating cards du hero).

### Requirement 8: Respecter l'identité visuelle EOLIA

**User Story:** En tant qu'utilisateur, je veux que le site conserve son identité visuelle cohérente malgré les optimisations.

#### Acceptance Criteria

1. THE EOLIA_UI SHALL conserver la palette de couleurs EOLIA (primary sky-600, accents emerald/green pour le dashboard).
2. THE EOLIA_UI SHALL maintenir les coins arrondis (rounded-xl, rounded-2xl) caractéristiques du design EOLIA.
3. THE EOLIA_UI SHALL préserver les ombres douces (shadow-lg) sur les cartes pour la profondeur visuelle.
4. THE EOLIA_UI SHALL conserver les dégradés subtils (gradient-to-br) sur les sections hero.

### Requirement 9: Optimiser les témoignages et sections répétitives

**User Story:** En tant qu'utilisateur, je veux voir les témoignages de manière plus compacte sans perdre leur impact.

#### Acceptance Criteria

1. THE EOLIA_UI SHALL réduire le padding des cartes témoignages de p-8 à p-5.
2. THE EOLIA_UI SHALL afficher les témoignages sur une grille plus dense (gap-6 au lieu de gap-8).
3. THE EOLIA_UI SHALL réduire la taille des avatars/icônes de témoignages de 48px à 40px.

### Requirement 10: Optimiser le header et la navigation

**User Story:** En tant qu'utilisateur, je veux un header compact qui ne prend pas trop de place verticale.

#### Acceptance Criteria

1. THE EOLIA_UI SHALL maintenir la hauteur du header à 64px (h-16) maximum.
2. THE EOLIA_UI SHALL utiliser un espacement compact entre les liens de navigation (gap-6 au lieu de gap-8).
