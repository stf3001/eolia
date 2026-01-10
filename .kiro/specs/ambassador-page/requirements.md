# Requirements Document

## Introduction

Ce document définit les exigences pour la page Ambassadeur d'EOLIA, inspirée de la page Ambassadeur d'Hydrolia. L'objectif est de créer une page de présentation publique du programme ambassadeur accessible depuis le header, avec deux parcours distincts (particulier B2C et professionnel B2B), tout en conservant le dashboard ambassadeur existant pour les utilisateurs connectés.

## Glossary

- **EOLIA_System**: Le système frontend de l'application EOLIA
- **Ambassador_Page**: La page publique de présentation du programme ambassadeur
- **B2C_Program**: Programme ambassadeur pour les particuliers (bons d'achat)
- **B2B_Program**: Programme ambassadeur pour les professionnels (commissions en euros)
- **Header_Navigation**: Le composant de navigation principal du site
- **User**: Un visiteur du site, authentifié ou non
- **Authenticated_User**: Un utilisateur connecté à son compte EOLIA

## Requirements

### Requirement 1: Lien Ambassadeur dans le Header

**User Story:** En tant qu'utilisateur, je veux voir un lien "Ambassadeur" dans le header, afin de pouvoir accéder facilement à la page du programme ambassadeur.

#### Acceptance Criteria

1. THE EOLIA_System SHALL display an "Ambassadeur" link in the Header_Navigation between "FAQ" and "Espace Client".
2. WHEN User clicks on the "Ambassadeur" link, THE EOLIA_System SHALL navigate to the "/ambassadeur" route.
3. THE EOLIA_System SHALL highlight the "Ambassadeur" link when the current route is "/ambassadeur".
4. THE EOLIA_System SHALL display the "Ambassadeur" link in both desktop and mobile navigation menus.

### Requirement 2: Page de Présentation Publique Ambassadeur

**User Story:** En tant que visiteur non connecté, je veux voir une page de présentation du programme ambassadeur, afin de comprendre les avantages et comment devenir ambassadeur.

#### Acceptance Criteria

1. WHEN User navigates to "/ambassadeur" without being authenticated, THE EOLIA_System SHALL display the Ambassador_Page presentation view.
2. THE EOLIA_System SHALL display a hero section with title "Devenez Ambassadeur EOLIA", description du programme, and two CTA buttons ("Devenir ambassadeur" linking to "/inscription" and "Espace ambassadeur" linking to "/connexion").
3. THE EOLIA_System SHALL display a "Pourquoi devenir ambassadeur" section with four advantage cards: revenus, transition écologique, énergie renouvelable, and cadeaux exceptionnels.
4. THE EOLIA_System SHALL display a comparison section between B2C_Program and B2B_Program with distinct visual styling (emerald for B2C, purple for B2B).
5. THE EOLIA_System SHALL display a "Nos exigences" section explaining transparency rules, legal compliance, and brand protection requirements.
6. THE EOLIA_System SHALL display a final CTA section encouraging users to join the ambassador program.

### Requirement 3: Détails du Programme B2C

**User Story:** En tant que particulier intéressé, je veux voir les détails du programme ambassadeur particulier, afin de comprendre les récompenses et conditions.

#### Acceptance Criteria

1. THE EOLIA_System SHALL display B2C_Program rewards: "200€ à 300€ en bons d'achat" per successful referral.
2. THE EOLIA_System SHALL display the progressive reward structure: 200€ for 1st referral, 250€ for 2nd, 300€ for 3rd and following.
3. THE EOLIA_System SHALL display the annual cap of 10 referrals maximum.
4. THE EOLIA_System SHALL display a special reward for the 10th referral: free Tulipe wind turbine (value approximately 2,500€).
5. THE EOLIA_System SHALL display a legal notice explaining that B2C rewards are vouchers, not cash commissions.
6. WHEN User clicks on "Devenir ambassadeur particulier" button, THE EOLIA_System SHALL navigate to "/inscription".

### Requirement 4: Détails du Programme B2B

**User Story:** En tant que professionnel intéressé, je veux voir les détails du programme ambassadeur professionnel, afin de comprendre les commissions et conditions.

#### Acceptance Criteria

1. THE EOLIA_System SHALL display B2B_Program commission rates: 5% to 12.5% based on cumulative revenue generated.
2. THE EOLIA_System SHALL display that B2B_Program has no referral cap.
3. THE EOLIA_System SHALL display that B2B_Program commissions are paid monthly in euros.
4. THE EOLIA_System SHALL display a legal notice explaining that B2B requires a business contract and commissions are taxable.
5. WHEN User clicks on "Devenir ambassadeur professionnel" button, THE EOLIA_System SHALL navigate to "/ambassadeur-b2b".

### Requirement 5: Dashboard Ambassadeur pour Utilisateurs Connectés

**User Story:** En tant qu'utilisateur connecté et ambassadeur, je veux accéder à mon dashboard ambassadeur, afin de voir mes statistiques et gérer mes parrainages.

#### Acceptance Criteria

1. WHEN Authenticated_User navigates to "/ambassadeur", THE EOLIA_System SHALL display the ambassador dashboard instead of the presentation page.
2. THE EOLIA_System SHALL display the existing B2C or B2B dashboard based on the user's affiliate type.
3. THE EOLIA_System SHALL maintain all existing dashboard functionality (code card, referrals list, rewards progress, commissions table).

### Requirement 6: Accès Public à la Page Ambassadeur

**User Story:** En tant que visiteur, je veux pouvoir accéder à la page ambassadeur sans être connecté, afin de découvrir le programme avant de m'inscrire.

#### Acceptance Criteria

1. THE EOLIA_System SHALL allow unauthenticated users to access the "/ambassadeur" route.
2. THE EOLIA_System SHALL remove the ProtectedRoute wrapper from the Ambassador page route.
3. THE EOLIA_System SHALL conditionally render either the presentation view or dashboard based on authentication status.
