# Requirements Document

## Introduction

EOLIA SAS est une plateforme e-commerce française spécialisée dans la commercialisation d'éoliennes verticales "Tulipe" (design Green Tech). Le site combine un espace vitrine pédagogique, un calculateur de production éolienne (100% frontend TypeScript), un tunnel de diagnostic/commande, et un programme ambassadeur dual (B2C/B2B). L'architecture reprend exactement celle d'Hydrolia : React/Vite frontend + serverless AWS backend.

## Glossary

- **Eolia_System**: Plateforme web React + backend serverless AWS (même stack qu'Hydrolia)
- **Tulipe**: Gamme d'éoliennes verticales EOLIA (modèle de base 6kWc, scaling linéaire pour autres puissances)
- **Calculateur**: Module TypeScript frontend calculant la production via interpolation de courbe de puissance
- **Grappe**: Configuration multi-éoliennes avec bonus +5% (effet venturi)
- **Anémomètre**: Appareil de mesure du vent prêté gratuitement (caution 100€)
- **Scaling_Factor**: Ratio mesure_réelle / historique_mois pour extrapoler la production annuelle
- **Ambassadeur_B2C**: Particulier parrainant (bons d'achat, plafond 10 filleuls/an)
- **Ambassadeur_B2B**: Professionnel apporteur d'affaires (commissions cash 5-12.5%)
- **Consuel**: Organisme de certification des installations électriques
- **kWc**: Kilowatt-crête, puissance nominale d'une éolienne

## Requirements

### Requirement 1: Page d'accueil et navigation

**User Story:** As a visiteur, I want to découvrir EOLIA et naviguer facilement, so that je comprenne l'offre rapidement.

#### Acceptance Criteria

1. THE Eolia_System SHALL afficher une page d'accueil avec hero section présentant les éoliennes Tulipe.
2. THE Eolia_System SHALL fournir une navigation: Accueil, Calculateur, Gamme Tulipe, Diagnostic, Espace Client.
3. THE Eolia_System SHALL appliquer la charte Green Tech: blanc pur, vert émeraude (#065f46), gris anthracite.
4. THE Eolia_System SHALL afficher un footer avec liens légaux et être responsive.

### Requirement 2: Calculateur de production éolienne (Frontend TypeScript)

**User Story:** As a prospect, I want to estimer la production annuelle selon ma localisation, so that j'évalue la rentabilité.

#### Acceptance Criteria

1. THE Eolia_System SHALL permettre la sélection parmi 12 départements (75-Paris, 29-Brest, 33-Bordeaux, 67-Strasbourg, 13-Marseille, 2A-Ajaccio, 59-Lille, 69-Lyon, 31-Toulouse, 44-Nantes, 34-Montpellier, 38-Grenoble).
2. THE Eolia_System SHALL permettre le choix de puissance: 1, 2, 3, 5 ou 10 kWc (scaling linéaire depuis base 6kWc).
3. THE Eolia_System SHALL calculer la production via interpolation de la courbe de puissance Tulipe et données vent historiques JSON.
4. WHEN l'utilisateur sélectionne plusieurs éoliennes (grappe), THE Eolia_System SHALL appliquer un bonus de 5% sur la production totale.
5. THE Eolia_System SHALL afficher un graphique mensuel via recharts et l'économie financière (prix kWh: 0.26€).
6. WHEN l'utilisateur saisit une mesure anémomètre (vitesse m/s + mois), THE Eolia_System SHALL recalculer avec le Scaling_Factor.

### Requirement 3: Boutique et Parcours Commande Clé en Main

**User Story:** As a prospect, I want to consulter le catalogue et commander en ligne, so that j'obtienne une installation complète.

#### Acceptance Criteria

1. THE Eolia_System SHALL afficher 4 catégories: Éoliennes Tulipe, Onduleurs/Stockage (IMEON + Fronius), Pièces détachées, Forfaits Pose.
2. THE Eolia_System SHALL afficher 5 modèles Tulipe (1, 2, 3, 5, 10 kWc) avec prix, dimensions, garantie 5 ans.
3. THE Eolia_System SHALL proposer 3 forfaits pose selon distance TGBT: <30m, 30-60m, 60-100m (incluant DP mairie, Enedis, Consuel, mise en service).
4. WHEN le total dépasse 36 kWc OU distance >100m, THE Eolia_System SHALL bloquer le checkout et afficher "Nous consulter" avec CTA contact.
5. THE Eolia_System SHALL collecter au checkout: type installation (mono/tri), puissance compteur, distance TGBT, code postal.
6. THE Eolia_System SHALL permettre le paiement Stripe avec mention "Commande suspensive à validation technique et accord mairie si nécessaire".
7. THE Eolia_System SHALL afficher une page Partenaires présentant IMEON Énergie et Fronius.

### Requirement 4: Tunnel anémomètre

**User Story:** As a prospect, I want to commander un anémomètre en prêt, so that je mesure le potentiel éolien de mon site.

#### Acceptance Criteria

1. THE Eolia_System SHALL proposer le prêt gratuit d'un anémomètre (1 mois, caution 100€ Stripe).
2. THE Eolia_System SHALL afficher "Bon de retour prépayé inclus" et envoyer un email de confirmation.
3. THE Eolia_System SHALL stocker la commande anémomètre dans la table Orders avec type "anemometer_loan".

### Requirement 5: Diagnostic guidé

**User Story:** As a prospect, I want to réaliser un diagnostic, so that j'obtienne un devis personnalisé.

#### Acceptance Criteria

1. THE Eolia_System SHALL proposer un formulaire multi-étapes: localisation (code postal), type de support, questions environnement, confirmation hauteur <12m.
2. THE Eolia_System SHALL générer un récapitulatif avec proposition de contact/devis.

### Requirement 6: Authentification et espace client

**User Story:** As a client, I want to créer un compte et accéder à mon espace, so that je gère mes commandes.

#### Acceptance Criteria

1. THE Eolia_System SHALL permettre inscription/connexion via AWS Cognito (email vérifié via SES).
2. THE Eolia_System SHALL afficher dans l'espace client: infos personnelles, adresses, historique commandes.
3. THE Eolia_System SHALL créer automatiquement un profil ambassadeur B2C à l'inscription.

### Requirement 7: Programme ambassadeur B2C

**User Story:** As a client particulier, I want to parrainer d'autres clients, so that j'obtienne des bons d'achat.

#### Acceptance Criteria

1. THE Eolia_System SHALL générer un code parrainage unique (8 caractères) et limiter à 10 filleuls/an.
2. THE Eolia_System SHALL attribuer des récompenses progressives: 200€ (1ère), 250€ (2ème), 300€ (3ème+).
3. THE Eolia_System SHALL afficher un dashboard avec statistiques filleuls et récompenses.

### Requirement 8: Programme ambassadeur B2B

**User Story:** As a professionnel, I want to devenir apporteur d'affaires, so that je perçoive des commissions.

#### Acceptance Criteria

1. THE Eolia_System SHALL permettre inscription B2B avec validation SIRET (format 14 chiffres, API Sirene optionnelle).
2. THE Eolia_System SHALL générer un contrat PDF (Lambda Python + fpdf2) et le stocker sur S3.
3. THE Eolia_System SHALL appliquer des paliers: 5% (<10k€), 7.5% (10-50k€), 10% (50-100k€), 12.5% (≥100k€).
4. THE Eolia_System SHALL permettre le dépôt de filleuls et afficher l'historique commissions.

### Requirement 9: Panier et paiement

**User Story:** As a client, I want to commander en ligne, so that j'achète une éolienne.

#### Acceptance Criteria

1. THE Eolia_System SHALL maintenir un panier persistant (localStorage) avec gestion quantités.
2. THE Eolia_System SHALL intégrer Stripe (3D Secure) et envoyer un email de confirmation.

### Requirement 10: Pages informatives

**User Story:** As a visiteur, I want to comprendre le processus d'installation, so that je sois rassuré.

#### Acceptance Criteria

1. THE Eolia_System SHALL fournir des pages: technologie éolienne verticale, processus Consuel/Enedis, FAQ, CGV, mentions légales.
2. THE Eolia_System SHALL afficher un bandeau cookies RGPD.

### Requirement 11: Backend serverless AWS (identique Hydrolia)

**User Story:** As a développeur, I want to déployer une infrastructure serverless, so that l'app soit scalable et économique.

#### Acceptance Criteria

1. THE Eolia_System SHALL utiliser: Lambda Node.js 20.x, DynamoDB (7 tables: Products, Users, Orders, Addresses, Affiliates, Referrals, Commissions), Cognito, SES, S3, API Gateway.
2. THE Eolia_System SHALL utiliser Serverless Framework pour le déploiement (même structure qu'Hydrolia).
