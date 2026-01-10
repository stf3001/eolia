# Implementation Plan

- [x] 1. Ajouter le lien Ambassadeur dans le Header





  - Modifier `eolia-frontend/src/components/layout/Header.tsx`
  - Ajouter `{ to: '/ambassadeur', label: 'Ambassadeur' }` dans `navLinks` entre FAQ et Espace Client
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Rendre la route /ambassadeur publique





  - Modifier `eolia-frontend/src/App.tsx`
  - Retirer le wrapper `<ProtectedRoute>` de la route `/ambassadeur`
  - _Requirements: 6.1, 6.2_

- [x] 3. Refactorer Ambassador.tsx avec la page de présentation publique




  - [x] 3.1 Créer la structure conditionnelle (présentation vs dashboard)

    - Vérifier `isAuthenticated` pour afficher soit la présentation soit le dashboard
    - Extraire le dashboard existant dans un composant interne `AmbassadorDashboard`
    - _Requirements: 5.1, 5.2, 5.3, 6.3_
  - [x] 3.2 Implémenter le Hero Section

    - Gradient emerald-600 to emerald-800
    - Titre "Devenez Ambassadeur EOLIA"
    - Description du programme
    - Deux CTAs : "Devenir ambassadeur" → /inscription, "Espace ambassadeur" → /connexion
    - _Requirements: 2.1, 2.2_

  - [x] 3.3 Implémenter la section "Pourquoi devenir ambassadeur"
    - 4 cartes avec icônes : Revenus (Coins), Planète (Leaf), Énergie (Wind), Cadeaux (Gift)
    - Textes adaptés pour EOLIA (éoliennes, énergie renouvelable)
    - _Requirements: 2.3_
  - [x] 3.4 Implémenter la section comparaison B2C vs B2B

    - Carte B2C (emerald) : 200€-300€/filleul, max 10/an, bons d'achat, éolienne offerte au 10ème
    - Carte B2B (purple) : 5%-12.5%, sans limite, euros
    - Notices légales pour chaque programme
    - CTAs : B2C → /inscription, B2B → /ambassadeur-b2b
    - _Requirements: 2.4, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 3.5 Implémenter la section "Nos exigences"
    - Règles essentielles : transparence, conformité légale, protection image
    - Cartes support : formation disponible, supports marketing
    - _Requirements: 2.5_
  - [x] 3.6 Implémenter le CTA final

    - Background emerald-700
    - Titre "Prêt à rejoindre l'aventure ?"
    - Deux CTAs : "Créer mon compte" → /inscription, "FAQ" → /faq
    - _Requirements: 2.6_
