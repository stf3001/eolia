# Requirements Document

## Introduction

Espace d'administration simple pour EOLIA permettant de gérer les commandes clients, suivre les KPIs urgents et accéder aux informations détaillées des clients. L'accès est sécurisé par un identifiant/mot de passe stocké en variable d'environnement, sans utiliser Cognito.

## Glossary

- **Admin_Dashboard**: Interface web d'administration accessible via `/admin`
- **Admin_Auth**: Système d'authentification simple par identifiant/mot de passe (variables d'environnement)
- **KPI_Card**: Composant visuel affichant un indicateur clé avec compteur et lien vers la liste filtrée
- **Order**: Commande client avec statuts (pending, confirmed, validated, shipped, delivered, cancelled)
- **Dossier**: Sous-dossier de suivi lié à une commande (shipping, admin_enedis, admin_consuel, installation)
- **Client_Detail**: Vue détaillée d'un client avec ses commandes, dossiers et documents
- **Admin_Note**: Remarque interne ajoutée par l'administrateur sur un dossier ou une commande

## Requirements

### Requirement 1: Authentification Admin

**User Story:** As an administrator, I want to access the admin dashboard with a simple username/password, so that I can manage orders without complex authentication.

#### Acceptance Criteria

1. WHEN the user navigates to `/admin`, THE Admin_Dashboard SHALL display a login form with username and password fields.
2. WHEN the user submits valid credentials matching `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables, THE Admin_Dashboard SHALL grant access and store a session token in localStorage.
3. IF the user submits invalid credentials, THEN THE Admin_Dashboard SHALL display an error message "Identifiants incorrects" and deny access.
4. WHEN the user clicks the logout button, THE Admin_Dashboard SHALL clear the session token and redirect to the login form.
5. WHILE the user has no valid session token, THE Admin_Dashboard SHALL redirect all admin routes to the login form.

### Requirement 2: Dashboard KPIs Urgents

**User Story:** As an administrator, I want to see urgent KPIs at a glance, so that I can prioritize actions requiring immediate attention.

#### Acceptance Criteria

1. WHEN the admin accesses the dashboard, THE Admin_Dashboard SHALL display a KPI_Card showing the count of orders with status "confirmed" (commandes payées à traiter).
2. WHEN the admin accesses the dashboard, THE Admin_Dashboard SHALL display a KPI_Card showing the count of dossiers of type "installation" with status "vt_pending" or "awaiting_be" (installations en attente).
3. WHEN the admin accesses the dashboard, THE Admin_Dashboard SHALL display a KPI_Card showing the count of dossiers of type "admin_enedis" with status "not_started" or "in_progress" (Enedis en attente).
4. WHEN the admin accesses the dashboard, THE Admin_Dashboard SHALL display a KPI_Card showing the count of dossiers of type "admin_consuel" with status "not_started" or "in_progress" (Consuel en attente).
5. WHEN the admin clicks on a KPI_Card, THE Admin_Dashboard SHALL navigate to the filtered list of corresponding orders or dossiers.

### Requirement 3: Liste des Clients/Commandes

**User Story:** As an administrator, I want to browse all orders and clients, so that I can find and manage any customer information.

#### Acceptance Criteria

1. WHEN the admin accesses the orders list, THE Admin_Dashboard SHALL display all orders sorted by creation date (most recent first).
2. THE Admin_Dashboard SHALL display for each order: order ID, client name, email, creation date, status, and total amount.
3. WHEN the admin uses the search field, THE Admin_Dashboard SHALL filter orders by client name, email, or order ID.
4. WHEN the admin uses the status filter, THE Admin_Dashboard SHALL display only orders matching the selected status.
5. WHEN the admin clicks on an order row, THE Admin_Dashboard SHALL navigate to the Client_Detail view for that order.

### Requirement 4: Vue Détaillée Client

**User Story:** As an administrator, I want to see all information about a client and their order, so that I can provide support and manage their dossiers.

#### Acceptance Criteria

1. WHEN the admin views a Client_Detail, THE Admin_Dashboard SHALL display client information (name, email, phone, shipping address).
2. WHEN the admin views a Client_Detail, THE Admin_Dashboard SHALL display order details (items, amounts, payment status, creation date).
3. WHEN the admin views a Client_Detail, THE Admin_Dashboard SHALL display all dossiers linked to the order with their current status.
4. WHEN the admin clicks on a dossier, THE Admin_Dashboard SHALL expand the dossier to show its timeline of events and documents.
5. THE Admin_Dashboard SHALL display all documents uploaded by the client with download links.

### Requirement 5: Modification des Statuts

**User Story:** As an administrator, I want to update dossier statuses, so that I can track progress and notify clients of changes.

#### Acceptance Criteria

1. WHEN the admin views a dossier, THE Admin_Dashboard SHALL display a dropdown with valid next statuses based on transition rules.
2. WHEN the admin selects a new status and confirms, THE Admin_Dashboard SHALL update the dossier status and create an event with source "admin".
3. IF the admin attempts an invalid status transition, THEN THE Admin_Dashboard SHALL display an error message with allowed transitions.
4. WHEN a status is updated, THE Admin_Dashboard SHALL refresh the dossier view to show the new status and updated timeline.

### Requirement 6: Upload de Documents et Photos

**User Story:** As an administrator, I want to upload documents and photos to client dossiers, so that I can add relevant files to their records.

#### Acceptance Criteria

1. WHEN the admin views a dossier, THE Admin_Dashboard SHALL display an upload button for adding documents.
2. WHEN the admin selects files to upload, THE Admin_Dashboard SHALL upload them to S3 and create document records linked to the dossier.
3. THE Admin_Dashboard SHALL accept PDF, JPG, PNG, and WEBP files up to 10MB each.
4. WHEN upload completes, THE Admin_Dashboard SHALL display the new documents in the document list with download links.
5. WHEN the admin clicks delete on a document, THE Admin_Dashboard SHALL remove the document from S3 and the database after confirmation.

### Requirement 7: Notes Administrateur

**User Story:** As an administrator, I want to add internal notes to orders and dossiers, so that I can track important information and communications.

#### Acceptance Criteria

1. WHEN the admin views a Client_Detail, THE Admin_Dashboard SHALL display a notes section with a text area for adding remarks.
2. WHEN the admin submits a note, THE Admin_Dashboard SHALL save the note with timestamp and display it in the notes history.
3. THE Admin_Dashboard SHALL display all notes in chronological order with date and content.
4. WHEN the admin views a dossier, THE Admin_Dashboard SHALL display dossier-specific notes separately from order notes.
5. THE Admin_Dashboard SHALL store notes in the dossier metadata or a dedicated field in the order record.
