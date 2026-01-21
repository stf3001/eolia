# Requirements Document

## Introduction

Ce document définit les exigences pour la fonctionnalité de suivi post-achat dans l'espace client Eolia. L'objectif est de structurer les process post-achat (suivi matériel, démarches administratives, installation) avec une approche MVP pragmatique, en posant des fondations simples et évolutives.

## Glossaire

- **Eolia_System** : La plateforme web Eolia (frontend + backend)
- **Client** : Utilisateur authentifié ayant passé une commande payée
- **Commande** : Ensemble d'articles achetés (matériel, forfaits) avec paiement validé
- **Dossier_Suivi** : Entité de tracking associée à une commande (shipping, admin, installation)
- **Forfait_Administratif** : Produit de catégorie `administrative` incluant les démarches Enedis et Consuel
- **Forfait_Installation** : Produit de catégorie `installation` incluant la pose par un installateur agréé
- **VT** : Visite Technique - collecte d'informations et photos du site d'installation par le client
- **BE** : Bureau d'Études - équipe interne qui valide les dossiers VT
- **S3_Documents_Bucket** : Bucket AWS S3 dédié au stockage des documents clients

## Requirements

### Requirement 1 : Affichage conditionnel des boutons de suivi

**User Story:** En tant que Client, je veux voir uniquement les boutons de suivi pertinents pour ma commande, afin de ne pas être submergé d'options inutiles.

#### Acceptance Criteria

1. WHEN une commande contient au moins un produit de catégorie `turbine`, `inverter` ou `accessory`, THE Eolia_System SHALL afficher le bouton "Suivi de ma commande" sur la page de détail de cette commande.

2. WHEN une commande contient au moins un produit de catégorie `administrative`, THE Eolia_System SHALL afficher le bouton "Suivi admin – formalités" sur la page de détail de cette commande.

3. WHEN une commande contient au moins un produit de catégorie `installation`, THE Eolia_System SHALL afficher le bouton "Suivi de mon installation" sur la page de détail de cette commande.

4. WHEN une commande contient plusieurs types de produits (matériel + forfaits), THE Eolia_System SHALL afficher tous les boutons de suivi correspondants de manière cumulative.

5. WHILE le statut de paiement d'une commande est différent de `confirmed` ou `validated`, THE Eolia_System SHALL masquer tous les boutons de suivi pour cette commande.

---

### Requirement 2 : Suivi de commande matériel

**User Story:** En tant que Client ayant commandé du matériel, je veux suivre l'état de livraison de ma commande, afin de savoir quand je recevrai mes équipements.

#### Acceptance Criteria

1. WHEN le Client clique sur "Suivi de ma commande", THE Eolia_System SHALL afficher la page de suivi logistique avec le statut actuel parmi : `received`, `preparing`, `shipped`, `delivered`, `issue`.

2. WHILE le statut logistique est `shipped`, THE Eolia_System SHALL afficher le nom du transporteur, le numéro de suivi et la date de livraison estimée.

3. WHEN le statut logistique change, THE Eolia_System SHALL ajouter une entrée horodatée dans l'historique de suivi (timeline).

4. IF le statut logistique passe à `issue`, THEN THE Eolia_System SHALL afficher un message explicatif et un lien vers le support SAV.

5. THE Eolia_System SHALL permettre le stockage de documents liés à la livraison (preuve de livraison, bon de transport) dans le dossier S3 `clients/{client_id}/orders/{order_id}/shipping/`.

---

### Requirement 3 : Suivi administratif - Structure et états

**User Story:** En tant que Client ayant souscrit au forfait administratif, je veux suivre l'avancement de mes démarches Enedis et Consuel séparément, afin de connaître l'état de chaque formalité.

#### Acceptance Criteria

1. WHEN le Client clique sur "Suivi admin – formalités", THE Eolia_System SHALL créer un dossier administratif avec deux sous-dossiers indépendants : Enedis et Consuel.

2. THE Eolia_System SHALL afficher l'état de chaque sous-dossier parmi : `not_started`, `in_progress`, `validated`, `rejected`.

3. WHEN l'état d'un sous-dossier change, THE Eolia_System SHALL enregistrer la date et l'heure du changement dans l'historique du dossier.

4. THE Eolia_System SHALL permettre l'affichage des documents associés à chaque sous-dossier (retours Enedis, échanges Consuel).

5. THE Eolia_System SHALL stocker les documents administratifs dans les dossiers S3 :
   - `clients/{client_id}/orders/{order_id}/admin/enedis/`
   - `clients/{client_id}/orders/{order_id}/admin/consuel/`

---

### Requirement 4 : Suivi installation - Visite Technique

**User Story:** En tant que Client ayant souscrit au forfait installation, je veux compléter ma visite technique en ligne, afin de fournir les informations nécessaires à la préparation de mon installation.

#### Acceptance Criteria

1. WHEN le Client clique sur "Suivi de mon installation", THE Eolia_System SHALL afficher la page de suivi installation avec l'état actuel parmi : `vt_pending`, `vt_completed`, `awaiting_be`, `validated`.

2. WHILE l'état installation est `vt_pending`, THE Eolia_System SHALL afficher le formulaire de visite technique avec les champs requis et la zone d'upload de photos.

3. WHEN le Client soumet le formulaire VT avec au moins 3 photos, THE Eolia_System SHALL stocker les photos dans `clients/{client_id}/orders/{order_id}/installation/vt/` et passer l'état à `vt_completed`.

4. WHILE l'état installation est `vt_completed`, THE Eolia_System SHALL afficher un bouton "Valider et envoyer au BE" et permettre au Client de visualiser ses photos uploadées.

5. WHEN le Client clique sur "Valider et envoyer au BE", THE Eolia_System SHALL passer l'état à `awaiting_be` et enregistrer la date d'envoi.

6. IF le Client tente de soumettre le formulaire VT avec moins de 3 photos, THEN THE Eolia_System SHALL afficher un message d'erreur indiquant le nombre minimum de photos requis.

---

### Requirement 5 : Questionnaire Visite Technique

**User Story:** En tant que Client, je veux remplir un questionnaire structuré pour ma visite technique, afin de fournir toutes les informations nécessaires au bureau d'études.

#### Acceptance Criteria

1. THE Eolia_System SHALL afficher un formulaire VT comprenant les champs suivants :
   - Type de toiture (liste déroulante)
   - Hauteur estimée du point de fixation (numérique, en mètres)
   - Distance au tableau électrique (liste déroulante : <30m, 30-60m, 60-100m, >100m)
   - Présence d'obstacles (cases à cocher multiples)
   - Commentaires libres (zone de texte)

2. WHEN le Client remplit le formulaire VT, THE Eolia_System SHALL valider que tous les champs obligatoires sont remplis avant de permettre la soumission.

3. THE Eolia_System SHALL sauvegarder les réponses du questionnaire VT dans la base de données associée au dossier installation.

4. WHILE l'état installation est différent de `vt_pending`, THE Eolia_System SHALL afficher les réponses du questionnaire en lecture seule.

---

### Requirement 6 : Stockage et accès aux documents

**User Story:** En tant que Client, je veux accéder à tous les documents liés à ma commande depuis mon espace client, afin de les consulter ou télécharger à tout moment.

#### Acceptance Criteria

1. THE Eolia_System SHALL créer un bucket S3 dédié `eolia-client-documents-{stage}` pour le stockage des documents clients.

2. WHEN le Client demande à visualiser un document, THE Eolia_System SHALL générer une URL pré-signée S3 valide pendant 15 minutes.

3. THE Eolia_System SHALL organiser les documents selon la structure :
   - `clients/{client_id}/orders/{order_id}/shipping/`
   - `clients/{client_id}/orders/{order_id}/admin/enedis/`
   - `clients/{client_id}/orders/{order_id}/admin/consuel/`
   - `clients/{client_id}/orders/{order_id}/installation/vt/`
   - `clients/{client_id}/orders/{order_id}/installation/reports/`

4. WHEN un document est uploadé, THE Eolia_System SHALL enregistrer les métadonnées (nom, type, taille, date) dans la table OrderDossiers.

5. THE Eolia_System SHALL limiter la taille des fichiers uploadés à 10 Mo par fichier et accepter les formats : jpg, jpeg, png, pdf.

---

### Requirement 7 : Réception de documents (fondation)

**User Story:** En tant qu'administrateur (futur), je veux pouvoir associer un document reçu par email à un dossier client, afin de centraliser tous les échanges.

#### Acceptance Criteria

1. THE Eolia_System SHALL exposer un endpoint API `POST /orders/{orderId}/documents` permettant d'ajouter un document à un dossier spécifique.

2. WHEN un document est ajouté via l'API, THE Eolia_System SHALL requérir les paramètres : `dossierType` (shipping, enedis, consuel, installation), `fileName`, `fileContent` (base64).

3. THE Eolia_System SHALL stocker le document dans le dossier S3 approprié et mettre à jour les métadonnées dans OrderDossiers.

4. WHEN un nouveau document est ajouté à un dossier, THE Eolia_System SHALL enregistrer un événement d'audit avec la date, le type de document et la source.

---

### Requirement 8 : Modèle de données et audit

**User Story:** En tant que développeur, je veux une structure de données claire pour les dossiers de suivi, afin de pouvoir construire le back-office ultérieurement.

#### Acceptance Criteria

1. THE Eolia_System SHALL créer une table DynamoDB `OrderDossiers` avec les attributs :
   - `orderId` (partition key)
   - `dossierId` (sort key)
   - `type` (shipping, admin_enedis, admin_consuel, installation)
   - `status`
   - `createdAt`, `updatedAt`
   - `metadata` (JSON)

2. THE Eolia_System SHALL créer une table DynamoDB `DossierEvents` pour l'historique avec :
   - `dossierId` (partition key)
   - `eventId` (sort key)
   - `eventType`, `timestamp`, `data`

3. WHEN un statut de dossier change, THE Eolia_System SHALL créer un événement dans DossierEvents avec les détails du changement.

4. THE Eolia_System SHALL indexer la table OrderDossiers par `orderId` pour permettre la récupération de tous les dossiers d'une commande.

---

### Requirement 9 : Interface mobile-first

**User Story:** En tant que Client sur mobile, je veux une interface de suivi optimisée pour mon écran, afin de consulter mes dossiers facilement depuis mon téléphone.

#### Acceptance Criteria

1. THE Eolia_System SHALL afficher les boutons de suivi en pleine largeur sur les écrans de moins de 768px.

2. THE Eolia_System SHALL permettre l'upload de photos depuis l'appareil photo du mobile via l'attribut `capture` sur l'input file.

3. THE Eolia_System SHALL afficher la timeline de suivi en format vertical scrollable sur mobile.

4. THE Eolia_System SHALL charger la page de suivi en moins de 3 secondes sur une connexion 4G standard.

5. THE Eolia_System SHALL compresser les images uploadées côté client à maximum 2 Mo avant envoi si elles dépassent cette taille.

---

### Requirement 10 : Catégories de produits

**User Story:** En tant que développeur, je veux distinguer clairement les types de produits pour déterminer les suivis applicables.

#### Acceptance Criteria

1. THE Eolia_System SHALL supporter les catégories de produits suivantes : `turbine`, `inverter`, `accessory`, `installation`, `administrative`.

2. WHEN un produit de catégorie `administrative` est ajouté au catalogue, THE Eolia_System SHALL requérir la définition des services inclus (Enedis, Consuel, ou les deux).

3. THE Eolia_System SHALL considérer les catégories `turbine`, `inverter`, `accessory` comme du "matériel physique" déclenchant le suivi logistique.
