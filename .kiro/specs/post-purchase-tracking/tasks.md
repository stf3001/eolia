# Implementation Plan

- [x] 1. Infrastructure et modèles de données





  - [x] 1.1 Ajouter les nouvelles tables DynamoDB dans serverless.yml


    - Créer OrderDossiersTable avec partition key `orderId` et sort key `dossierId`
    - Créer DossierEventsTable avec partition key `dossierId` et sort key `eventId`
    - Créer DossierDocumentsTable avec GSI sur `dossierId` et `orderId`
    - _Requirements: 8.1, 8.2, 8.4_

  - [x] 1.2 Créer le bucket S3 ClientDocumentsBucket


    - Configurer le bucket privé avec CORS pour le frontend
    - Ajouter les permissions IAM pour les Lambdas
    - _Requirements: 6.1, 6.3_

  - [x] 1.3 Créer les types TypeScript partagés


    - Définir les interfaces Dossier, DossierEvent, DossierDocument dans le backend
    - Définir les types correspondants dans le frontend
    - Définir les enums pour les statuts et types de dossiers
    - _Requirements: 8.1, 8.2_

  - [x] 1.4 Ajouter la catégorie `administrative` aux produits


    - Mettre à jour le type Product pour inclure la nouvelle catégorie
    - _Requirements: 10.1, 10.2_

- [x] 2. Backend - Services de base





  - [x] 2.1 Créer le service DynamoDB pour les dossiers


    - Implémenter les fonctions CRUD pour OrderDossiers
    - Implémenter la création d'événements dans DossierEvents
    - Implémenter la gestion des documents dans DossierDocuments
    - _Requirements: 8.1, 8.2, 8.3_


  - [x] 2.2 Créer le service S3 pour les documents

    - Implémenter la génération d'URLs pré-signées (upload et download)
    - Implémenter la validation des types de fichiers (jpg, png, pdf)
    - Implémenter la validation de la taille (max 10 Mo)
    - _Requirements: 6.2, 6.4, 6.5_

  - [x] 2.3 Créer le service de validation des transitions d'état


    - Implémenter la logique de validation des transitions par type de dossier
    - _Requirements: 2.1, 3.2, 4.1_

- [x] 3. Backend - Lambdas Dossiers






  - [x] 3.1 Créer la Lambda getDossiers

    - Endpoint GET /orders/{orderId}/dossiers
    - Retourner tous les dossiers d'une commande avec leurs statuts
    - _Requirements: 1.1, 1.2, 1.3, 1.4_


  - [x] 3.2 Créer la Lambda getDossierDetail

    - Endpoint GET /orders/{orderId}/dossiers/{dossierId}
    - Retourner le détail d'un dossier avec son historique
    - _Requirements: 2.1, 3.2, 4.1_


  - [x] 3.3 Créer la Lambda getDossierEvents

    - Endpoint GET /orders/{orderId}/dossiers/{dossierId}/events
    - Retourner l'historique des événements (timeline)
    - _Requirements: 2.3, 8.3_



  - [x] 3.4 Créer la Lambda updateDossierStatus





    - Endpoint PUT /orders/{orderId}/dossiers/{dossierId}
    - Valider la transition d'état avant mise à jour
    - Créer un événement dans l'historique
    - _Requirements: 2.3, 3.3, 8.3_

- [x] 4. Backend - Lambdas Documents





  - [x] 4.1 Créer la Lambda getUploadUrl


    - Endpoint POST /orders/{orderId}/documents/upload-url
    - Générer une URL pré-signée PUT valide 15 minutes
    - Valider le type de fichier et la taille déclarée
    - _Requirements: 6.2, 6.5_


  - [x] 4.2 Créer la Lambda getDocuments

    - Endpoint GET /orders/{orderId}/documents
    - Filtrer par dossierType si spécifié
    - Retourner les URLs pré-signées de téléchargement
    - _Requirements: 6.2, 6.4_


  - [x] 4.3 Créer la Lambda deleteDocument

    - Endpoint DELETE /orders/{orderId}/documents/{documentId}
    - Supprimer le fichier S3 et les métadonnées DynamoDB
    - _Requirements: 6.4_


  - [x] 4.4 Créer la Lambda addDocument (pour futur back-office)

    - Endpoint POST /orders/{orderId}/documents
    - Permettre l'ajout de documents par l'admin
    - Créer un événement d'audit
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 5. Backend - Lambdas Installation/VT


  - [x] 5.1 Créer la Lambda submitVT
    - Endpoint POST /orders/{orderId}/installation/vt
    - Valider le formulaire (champs obligatoires, min 3 photos)
    - Sauvegarder les données VT dans le dossier installation
    - Mettre à jour le statut à `vt_completed`
    - _Requirements: 4.2, 4.3, 4.6, 5.1, 5.2, 5.3_

  - [x] 5.2 Créer la Lambda sendVTToBE

    - Endpoint POST /orders/{orderId}/installation/send-to-be
    - Mettre à jour le statut à `awaiting_be`
    - Créer un événement avec la date d'envoi
    - _Requirements: 4.5_

- [x] 6. Backend - Modification createOrder






  - [x] 6.1 Modifier createOrder pour créer les dossiers automatiquement

    - Détecter les catégories de produits dans la commande
    - Créer les dossiers appropriés (shipping, admin_enedis, admin_consuel, installation)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 10.3_

- [x] 7. Frontend - Types et services






  - [x] 7.1 Créer les types TypeScript pour le tracking

    - Interfaces Dossier, DossierEvent, Document, VTFormData
    - Types pour les statuts et leurs labels/couleurs
    - _Requirements: 2.1, 3.2, 4.1_


  - [x] 7.2 Créer le service dossierService

    - Fonctions pour appeler les endpoints dossiers
    - _Requirements: 2.1, 3.2, 4.1_


  - [x] 7.3 Créer le service documentService

    - Fonctions pour upload/download/delete documents
    - Fonction de compression d'image côté client
    - _Requirements: 6.2, 9.5_

- [x] 8. Frontend - Composants de base




  - [x] 8.1 Créer le composant TrackingButton


    - Bouton coloré selon le type (bleu/vert/orange)
    - Affichage du statut actuel
    - _Requirements: 1.1, 1.2, 1.3_


  - [x] 8.2 Créer le composant StatusBadge

    - Badge avec couleur selon le statut
    - Labels en français
    - _Requirements: 2.1, 3.2, 4.1_


  - [x] 8.3 Créer le composant Timeline

    - Affichage vertical des événements
    - Responsive mobile
    - _Requirements: 2.3, 9.3_

  - [x] 8.4 Créer le composant DocumentList


    - Liste des documents avec téléchargement
    - Aperçu pour les images
    - _Requirements: 3.4, 4.4_


  - [x] 8.5 Créer le composant PhotoUploader

    - Upload multiple avec preview
    - Compression automatique > 2Mo
    - Support capture mobile
    - Progress bar
    - _Requirements: 4.3, 9.2, 9.5_

- [x] 9. Frontend - Pages de suivi




  - [x] 9.1 Créer la page OrderDetail


    - Afficher les infos de la commande
    - Afficher les boutons de suivi conditionnels
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_


  - [x] 9.2 Créer la page ShippingTracker

    - Afficher le statut logistique
    - Afficher transporteur/numéro de suivi si expédié
    - Afficher la timeline
    - Afficher les documents (preuve de livraison)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_


  - [x] 9.3 Créer la page AdminTracker

    - Afficher les deux sous-dossiers Enedis et Consuel
    - Afficher le statut de chaque sous-dossier
    - Afficher les documents associés
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_


  - [x] 9.4 Créer la page InstallationTracker

    - Afficher le statut installation
    - Intégrer le formulaire VT si `vt_pending`
    - Afficher les photos uploadées
    - Bouton "Valider et envoyer au BE"
    - _Requirements: 4.1, 4.2, 4.4, 4.5_

  - [x] 9.5 Créer le composant VTForm


    - Formulaire avec tous les champs requis
    - Validation des champs obligatoires
    - Intégration PhotoUploader
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 10. Frontend - Intégration Dashboard






  - [x] 10.1 Modifier le Dashboard pour afficher les commandes avec boutons de suivi

    - Ajouter les boutons de suivi sur chaque commande payée
    - Navigation vers OrderDetail au clic
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 10.2 Ajouter les routes pour les nouvelles pages


    - /orders/:orderId
    - /orders/:orderId/shipping
    - /orders/:orderId/admin
    - /orders/:orderId/installation
    - _Requirements: 9.1_

- [x] 11. Tests






  - [x] 11.1 Tests unitaires backend

    - Tester la validation des transitions d'état
    - Tester la génération d'URLs pré-signées
    - Tester la validation du formulaire VT
    - _Requirements: 2.1, 4.6, 5.2_


  - [x] 11.2 Tests d'intégration

    - Tester le flux complet de création de dossiers
    - Tester le flux upload document
    - _Requirements: 6.1, 6.2, 6.3_
