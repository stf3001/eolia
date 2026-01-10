# Implementation Plan

- [x] 1. Ajouter le lien FAQ dans le header





  - Modifier le tableau `navLinks` dans `eolia-frontend/src/components/layout/Header.tsx`
  - Ajouter l'entrée `{ to: '/faq', label: 'FAQ' }` entre "Gamme Tulipe" et "Espace Client"
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Enrichir la FAQ avec les nouvelles questions




  - [x] 2.1 Ajouter les questions sur l'installation et la connexion


    - Ajouter 3 questions dans la catégorie "installation" : connexion électrique, travaux, installation sur toit
    - Utiliser un ton rassurant avec incitation au contact
    - _Requirements: 2.1, 2.2_


  - [x] 2.2 Ajouter les questions sur les batteries et la sécurité

    - Ajouter 6 questions dans la catégorie "product" : batteries, danger, tempêtes, voisins, nuit, production
    - _Requirements: 3.1, 3.2, 5.1, 5.2, 6.1_


  - [x] 2.3 Ajouter les questions sur les démarches administratives

    - Ajouter 3 questions dans la catégorie "admin" : démarches complètes, voisins, terrain adapté
    - _Requirements: 4.1, 4.2_


  - [x] 2.4 Ajouter les questions sur la commande et la maintenance

    - Ajouter 3 questions dans la catégorie "order" : ROI, installation, garantie
    - Ajouter 2 questions dans la catégorie "maintenance" : entretien, panne
    - _Requirements: 6.2, 6.3_
