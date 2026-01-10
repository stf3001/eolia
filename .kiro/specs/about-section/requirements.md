# Requirements Document

## Introduction

Cette fonctionnalité ajoute une rubrique "À propos" dans le header d'Eolia, contenant un menu déroulant avec 4 pages : "Qui sommes-nous", "Notre vision", "Pourquoi Eolia" et "Nous contacter". Le contenu s'inspire du ton et du style d'Hydrolia, adapté au domaine de l'énergie éolienne domestique.

## Glossary

- **Eolia**: Plateforme de vente de micro-éoliennes domestiques
- **Header**: Barre de navigation principale en haut du site
- **Menu déroulant**: Sous-menu qui s'affiche au survol ou au clic d'un élément de navigation
- **Page À propos**: Ensemble des pages présentant l'entreprise, sa vision et ses coordonnées

## Requirements

### Requirement 1: Menu déroulant "À propos" dans le Header

**User Story:** En tant qu'utilisateur, je veux accéder à une rubrique "À propos" dans le header, afin de découvrir l'entreprise Eolia et ses valeurs.

#### Acceptance Criteria

1. WHEN l'utilisateur survole ou clique sur "À propos" dans le header, THE Header SHALL afficher un menu déroulant contenant les liens vers les 4 pages : "Qui sommes-nous", "Notre vision", "Pourquoi Eolia", "Nous contacter".
2. WHEN l'utilisateur clique sur un lien du menu déroulant, THE Header SHALL naviguer vers la page correspondante et fermer le menu.
3. WHILE l'utilisateur navigue sur mobile, THE Header SHALL afficher les 4 liens "À propos" dans le menu mobile de manière accessible.

### Requirement 2: Page "Qui sommes-nous"

**User Story:** En tant qu'utilisateur, je veux consulter une page "Qui sommes-nous", afin de comprendre l'identité et les valeurs d'Eolia.

#### Acceptance Criteria

1. WHEN l'utilisateur accède à la page "Qui sommes-nous", THE AboutUs Page SHALL afficher une section hero avec le titre et une accroche.
2. WHEN l'utilisateur consulte la page, THE AboutUs Page SHALL présenter la mission d'Eolia dans le domaine de l'énergie éolienne domestique.
3. WHEN l'utilisateur consulte la page, THE AboutUs Page SHALL afficher les valeurs de l'entreprise (innovation, écologie, accessibilité).
4. WHEN l'utilisateur consulte la page, THE AboutUs Page SHALL inclure une section sur l'engagement qualité et le service client.

### Requirement 3: Page "Notre vision"

**User Story:** En tant qu'utilisateur, je veux consulter une page "Notre vision", afin de comprendre les objectifs à long terme d'Eolia.

#### Acceptance Criteria

1. WHEN l'utilisateur accède à la page "Notre vision", THE Vision Page SHALL afficher une section hero avec le titre et une accroche.
2. WHEN l'utilisateur consulte la page, THE Vision Page SHALL présenter la vision environnementale d'Eolia (transition énergétique, autonomie).
3. WHEN l'utilisateur consulte la page, THE Vision Page SHALL expliquer l'innovation technologique dans le domaine des micro-éoliennes.
4. WHEN l'utilisateur consulte la page, THE Vision Page SHALL décrire l'impact social visé (démocratisation de l'énergie verte).

### Requirement 4: Page "Pourquoi Eolia"

**User Story:** En tant qu'utilisateur, je veux consulter une page "Pourquoi Eolia", afin de comprendre les avantages de choisir cette entreprise.

#### Acceptance Criteria

1. WHEN l'utilisateur accède à la page "Pourquoi Eolia", THE WhyEolia Page SHALL afficher une section hero avec le titre et une accroche.
2. WHEN l'utilisateur consulte la page, THE WhyEolia Page SHALL présenter au moins 5 raisons de choisir Eolia (qualité, économies, écologie, expertise, support).
3. WHEN l'utilisateur consulte la page, THE WhyEolia Page SHALL afficher les certifications et garanties des produits.
4. WHEN l'utilisateur consulte la page, THE WhyEolia Page SHALL inclure un appel à l'action vers les produits ou le calculateur.

### Requirement 5: Page "Nous contacter"

**User Story:** En tant qu'utilisateur, je veux consulter une page "Nous contacter", afin de trouver les coordonnées d'Eolia et les moyens de les joindre.

#### Acceptance Criteria

1. WHEN l'utilisateur accède à la page "Nous contacter", THE Contact Page SHALL afficher une section hero avec le titre et une accroche.
2. WHEN l'utilisateur consulte la page, THE Contact Page SHALL afficher l'adresse postale de l'entreprise (placeholder modifiable).
3. WHEN l'utilisateur consulte la page, THE Contact Page SHALL afficher l'adresse email de contact (placeholder modifiable).
4. WHEN l'utilisateur consulte la page, THE Contact Page SHALL afficher le numéro de téléphone (placeholder modifiable).
5. WHEN l'utilisateur consulte la page, THE Contact Page SHALL afficher les horaires d'ouverture du service client.
