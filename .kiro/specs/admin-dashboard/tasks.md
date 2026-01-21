# Implementation Plan

- [x] 1. Configuration et authentification admin backend




  - [x] 1.1 Ajouter les variables d'environnement admin dans serverless.yml


    - Ajouter `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_TOKEN_SECRET` dans la section environment
    - _Requirements: 1.1, 1.2_

  - [x] 1.2 Créer le service d'authentification admin

    - Créer `eolia-backend/src/services/adminAuth.ts`
    - Implémenter `verifyAdminCredentials(username, password)` qui compare avec les variables d'env
    - Implémenter `generateAdminToken()` qui crée un token JWT simple avec expiration 24h
    - Implémenter `verifyAdminToken(token)` qui valide le token
    - _Requirements: 1.2, 1.3, 1.5_
  - [x] 1.3 Créer l'endpoint POST /admin/auth


    - Créer `eolia-backend/src/functions/admin/auth.ts`
    - Valider username/password, retourner token si valide
    - _Requirements: 1.2, 1.3_

  - [x] 1.4 Créer l'endpoint GET /admin/verify

    - Créer `eolia-backend/src/functions/admin/verify.ts`
    - Vérifier le token dans le header Authorization
    - _Requirements: 1.5_

- [x] 2. Endpoints admin pour les données





  - [x] 2.1 Créer l'endpoint GET /admin/stats


    - Créer `eolia-backend/src/functions/admin/getStats.ts`
    - Scanner les tables Orders et OrderDossiers pour compter les KPIs
    - Retourner confirmedOrders, pendingInstallations, pendingEnedis, pendingConsuel
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 2.2 Créer l'endpoint GET /admin/orders

    - Créer `eolia-backend/src/functions/admin/getOrders.ts`
    - Scanner la table Orders avec pagination
    - Joindre un résumé des dossiers pour chaque commande
    - Supporter les filtres search et status
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 2.3 Créer l'endpoint GET /admin/orders/:orderId

    - Créer `eolia-backend/src/functions/admin/getOrderDetail.ts`
    - Récupérer la commande, ses dossiers, documents et notes
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 2.4 Créer l'endpoint POST /admin/orders/:orderId/notes

    - Créer `eolia-backend/src/functions/admin/addNote.ts`
    - Ajouter une note dans les métadonnées de la commande ou du dossier
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 2.5 Déclarer les nouvelles fonctions dans serverless.yml

    - Ajouter les 6 endpoints admin avec leurs routes HTTP
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 7.1_

- [x] 3. Frontend - Authentification et layout admin





  - [x] 3.1 Créer le service admin frontend


    - Créer `eolia-frontend/src/services/adminService.ts`
    - Implémenter login, verify, getStats, getOrders, getOrderDetail, addNote
    - Gérer le token admin en localStorage
    - _Requirements: 1.1, 1.2, 1.4, 1.5_
  - [x] 3.2 Créer le composant AdminLayout


    - Créer `eolia-frontend/src/components/admin/AdminLayout.tsx`
    - Vérifier le token au montage, rediriger vers /admin si invalide
    - Afficher header avec logo EOLIA et bouton déconnexion
    - _Requirements: 1.4, 1.5_
  - [x] 3.3 Créer la page AdminLogin


    - Créer `eolia-frontend/src/pages/admin/AdminLogin.tsx`
    - Formulaire username/password avec style EOLIA
    - Appeler le service login et stocker le token
    - _Requirements: 1.1, 1.2, 1.3_

- [x] 4. Frontend - Dashboard et KPIs






  - [x] 4.1 Créer le composant KPICard

    - Créer `eolia-frontend/src/components/admin/KPICard.tsx`
    - Afficher icône, titre, compteur et lien vers liste filtrée
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - [x] 4.2 Créer la page AdminDashboard


    - Créer `eolia-frontend/src/pages/admin/AdminDashboard.tsx`
    - Afficher 4 KPICards avec les stats récupérées de l'API
    - Ajouter liens rapides vers la liste des commandes
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 5. Frontend - Liste des commandes






  - [x] 5.1 Créer la page AdminOrdersList

    - Créer `eolia-frontend/src/pages/admin/AdminOrdersList.tsx`
    - Afficher tableau des commandes avec colonnes: ID, client, email, date, statut, montant
    - Implémenter recherche et filtres par statut
    - Pagination avec bouton "Charger plus"
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 6. Frontend - Détail commande/client


  - [x] 6.1 Créer la page AdminOrderDetail
    - Créer `eolia-frontend/src/pages/admin/AdminOrderDetail.tsx`
    - Section infos client (nom, email, téléphone, adresse)
    - Section commande (articles, montants, statut paiement)
    - Section dossiers avec accordéons expandables
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 6.2 Créer le composant AdminDossierCard
    - Créer `eolia-frontend/src/components/admin/AdminDossierCard.tsx`
    - Afficher statut actuel avec badge coloré
    - Dropdown pour changer le statut (transitions valides uniquement)
    - Timeline des événements
    - Liste des documents avec téléchargement
    - _Requirements: 4.4, 5.1, 5.2, 5.3, 5.4_

  - [x] 6.3 Créer le composant AdminDocumentUpload
    - Créer `eolia-frontend/src/components/admin/AdminDocumentUpload.tsx`
    - Bouton upload avec drag & drop
    - Validation type fichier (PDF, JPG, PNG, WEBP) et taille (10MB max)
    - Appel API pour upload vers S3
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 6.4 Créer le composant AdminNotes

    - Créer `eolia-frontend/src/components/admin/AdminNotes.tsx`
    - Zone de texte pour ajouter une note
    - Liste des notes existantes avec date
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 7. Intégration des routes










  - [x] 7.1 Ajouter les routes admin dans App.tsx



    - Route /admin → AdminLogin
    - Route /admin/dashboard → AdminDashboard (protégée)
    - Route /admin/orders → AdminOrdersList (protégée)
    - Route /admin/orders/:orderId → AdminOrderDetail (protégée)
    - _Requirements: 1.1, 2.1, 3.1, 4.1_
