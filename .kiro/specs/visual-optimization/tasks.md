# Implementation Plan

- [x] 1. Optimiser le composant ProductCard




  - [x] 1.1 Modifier le ratio d'image de aspect-square à aspect-[4/3]


    - Fichier: `eolia-frontend/src/components/shop/ProductCard.tsx`
    - Changer la classe de l'image container
    - _Requirements: 2.1_

  - [x] 1.2 Réduire le padding et les tailles de texte

    - Padding contenu: p-4 → p-3
    - Titre: ajouter text-sm
    - Specs: text-sm → text-xs
    - Bouton: px-4 py-2 → px-3 py-1.5, icône w-4 → w-3.5
    - _Requirements: 2.3, 2.4_

- [x] 2. Optimiser la page Products





  - [x] 2.1 Améliorer la grille responsive


    - Fichier: `eolia-frontend/src/pages/Products.tsx`
    - Ajouter 2xl:grid-cols-5 à la grille
    - Réduire gap-6 → gap-4
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 2.2 Réduire les espacements de section

    - Hero: py-16 → py-10
    - Container principal: py-8 → py-6
    - _Requirements: 3.1_

- [x] 3. Optimiser la page Home



  - [x] 3.1 Compacter le Hero section


    - Fichier: `eolia-frontend/src/pages/Home.tsx`
    - Padding: py-6 lg:py-8 → py-4 lg:py-6
    - _Requirements: 5.1_

  - [x] 3.2 Compacter la section Avantages
    - Section: py-12 lg:py-14 → py-8 lg:py-10
    - Titre margin: mb-10 lg:mb-12 → mb-8
    - Grille: gap-8 → gap-6
    - Cartes: p-6 → p-4
    - Icônes: w-14 h-14 → w-12 h-12, icône h-7 → h-6
    - _Requirements: 3.1, 3.2, 3.3, 5.2, 5.3_

  - [x] 3.3 Compacter la section "Comment ça marche"
    - Section: py-12 lg:py-14 → py-8 lg:py-10
    - Cercles: w-16 h-16 → w-12 h-12, text-2xl → text-xl
    - Margin cercles: mb-6 → mb-4
    - _Requirements: 3.1, 5.4_
  - [x] 3.4 Compacter la section CTA

    - Section: py-12 lg:py-14 → py-8 lg:py-10
    - _Requirements: 3.1_

  - [x] 3.5 Compacter la section Témoignages

    - Section: py-12 lg:py-14 → py-8 lg:py-10
    - Grille: gap-8 → gap-6
    - Cartes: p-8 → p-5
    - Avatars: w-12 h-12 → w-10 h-10
    - _Requirements: 3.1, 9.1, 9.2, 9.3_

- [x] 4. Optimiser le Dashboard





  - [x] 4.1 Compacter le header et welcome


    - Fichier: `eolia-frontend/src/pages/Dashboard.tsx`
    - Margin welcome: mb-8 → mb-6
    - Titre: text-4xl → text-3xl
    - _Requirements: 4.1_
  - [x] 4.2 Compacter les cartes principales (Anémomètre, Simulations)


    - Grid gap: gap-6 mb-6 → gap-4 mb-4
    - Cartes: p-6 → p-4
    - Icônes: w-14 h-14 → w-12 h-12
    - _Requirements: 4.1, 4.3_

  - [x] 4.3 Compacter les cartes secondaires (Infos, Commandes, Adresses)

    - Grid gap: gap-6 mb-6 → gap-4 mb-4
    - Cartes: p-5 → p-4
    - Icônes header: w-10 h-10 → w-8 h-8
    - Titres: text-lg → text-base
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 4.4 Compacter les sections SAV et Ambassadeur

    - Padding: p-5/p-6 → p-4
    - _Requirements: 4.1_

- [x] 5. Optimiser le Header






  - [x] 5.1 Réduire l'espacement de navigation

    - Fichier: `eolia-frontend/src/components/layout/Header.tsx`
    - Gap liens: gap-8 → gap-6
    - _Requirements: 10.2_

- [x] 6. Élargir les containers principaux






  - [x] 6.1 Mettre à jour le container sur Products.tsx

    - max-w-7xl → max-w-[1400px]
    - _Requirements: 1.1, 1.2_


  - [x] 6.2 Mettre à jour le container sur Home.tsx
    - max-w-7xl → max-w-[1400px] (toutes les sections)

    - _Requirements: 1.1, 1.2_
  - [x] 6.3 Mettre à jour le container sur Dashboard.tsx

    - max-w-7xl → max-w-[1400px]
    - _Requirements: 1.1, 1.2_
  - [x] 6.4 Mettre à jour le container sur Calculator.tsx


    - max-w-7xl → max-w-[1400px]
    - _Requirements: 1.1, 1.2_
