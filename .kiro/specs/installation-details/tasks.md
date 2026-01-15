# Implementation Plan

- [x] 1. Créer le composant InstallationInfoBanner






  - [x] 1.1 Créer le fichier `eolia-frontend/src/components/shop/InstallationInfoBanner.tsx`

    - Définir les constantes pour le contenu textuel (avantages, démarches, mise à la terre, conseil assurance)
    - Implémenter la section "Ce que comprend le forfait" avec 4 cartes (RGE/décennale, encadrement EOLIA, raccordement TGBT, mise en service)
    - Implémenter la section "Démarches administratives" avec 3 items (Enedis, contrat surplus, Consuel)
    - Implémenter l'encadré "À savoir" sur la mise à la terre (style warning ambre)
    - Implémenter l'encadré "Conseil" sur l'assurance habitation (style info bleu)
    - Utiliser les icônes Lucide cohérentes avec le site
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 2. Intégrer le composant dans la page Produits






  - [x] 2.1 Modifier `eolia-frontend/src/pages/Products.tsx`

    - Importer le composant InstallationInfoBanner
    - Ajouter l'affichage conditionnel du composant quand `activeCategory === 'installation'`
    - Positionner le composant entre les filtres et la grille de produits
    - _Requirements: 1.1_

- [x] 3. Vérification et ajustements responsive





  - [x] 3.1 Tester l'affichage sur différentes tailles d'écran


    - Vérifier le layout mobile (stack vertical)
    - Vérifier le layout desktop (grilles)
    - Ajuster les paddings et margins si nécessaire
    - _Requirements: 2.1, 2.2, 2.3_
