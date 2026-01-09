# Requirements Document

## Introduction

Cette fonctionnalité permet aux visiteurs de la page calculateur (/calculateur) de sauvegarder leurs simulations de production éolienne dans leur espace client. Si l'utilisateur est connecté, la simulation est enregistrée directement. Sinon, il est invité à créer un compte ou se connecter, puis la simulation est automatiquement sauvegardée après authentification.

## Glossary

- **Simulation**: Ensemble des paramètres d'entrée (département, puissance, nombre d'éoliennes, données anémomètre optionnelles) et des résultats calculés (production annuelle, économies, production mensuelle)
- **Calculator_Page**: Page frontend accessible à /calculateur permettant d'estimer la production éolienne
- **Dashboard**: Espace client de l'utilisateur connecté accessible à /mon-compte
- **Simulations_Table**: Table DynamoDB stockant les simulations sauvegardées des utilisateurs

## Requirements

### Requirement 1: Bouton de sauvegarde sur la page calculateur

**User Story:** En tant que visiteur, je veux pouvoir sauvegarder ma simulation après avoir obtenu des résultats, afin de la retrouver plus tard dans mon espace client.

#### Acceptance Criteria

1. WHEN le Calculator_Page affiche des résultats de simulation, THE Calculator_Page SHALL afficher un bouton "Sauvegarder ma simulation" dans la zone des résultats.
2. WHEN l'utilisateur authentifié clique sur le bouton de sauvegarde, THE Calculator_Page SHALL enregistrer la simulation dans Simulations_Table et afficher un message de confirmation indiquant que la simulation est disponible dans l'espace client.
3. WHEN l'utilisateur non authentifié clique sur le bouton de sauvegarde, THE Calculator_Page SHALL afficher une modale proposant deux options: "Se connecter" et "Créer un compte".
4. WHEN l'utilisateur clique sur "Se connecter" dans la modale, THE Calculator_Page SHALL rediriger vers /connexion avec un paramètre de retour vers /calculateur.
5. WHEN l'utilisateur clique sur "Créer un compte" dans la modale, THE Calculator_Page SHALL rediriger vers /inscription avec un paramètre de retour vers /calculateur.
6. WHEN l'utilisateur revient sur Calculator_Page après authentification avec une simulation en attente, THE Calculator_Page SHALL restaurer les résultats et proposer à nouveau la sauvegarde.
7. WHILE une opération de sauvegarde est en cours, THE Calculator_Page SHALL afficher un indicateur de chargement sur le bouton de sauvegarde.

### Requirement 2: Stockage des simulations

**User Story:** En tant qu'utilisateur connecté, je veux que mes simulations soient stockées de manière persistante, afin de pouvoir les consulter ultérieurement.

#### Acceptance Criteria

1. WHEN une simulation est sauvegardée, THE Backend SHALL stocker dans Simulations_Table: userId, simulationId, nom auto-généré, paramètres d'entrée, résultats, et date de création.
2. WHEN l'utilisateur sauvegarde une simulation, THE Backend SHALL générer un nom par défaut au format "Simulation [département] - [date]".
3. WHILE l'utilisateur possède des simulations sauvegardées, THE Backend SHALL permettre la récupération de toutes ses simulations via une requête authentifiée.
4. WHILE l'utilisateur possède des simulations, THE Backend SHALL limiter le stockage à 3 simulations maximum par utilisateur.

### Requirement 3: Affichage des simulations dans le Dashboard

**User Story:** En tant qu'utilisateur connecté, je veux voir mes simulations sauvegardées dans mon espace client, afin de les consulter et les comparer.

#### Acceptance Criteria

1. WHILE l'utilisateur est sur le Dashboard, THE Dashboard SHALL afficher deux liens dans la section services rapides: "Simulateur" (vers /calculateur) et "Mes simulations sauvegardées".
2. WHILE l'utilisateur possède des simulations sauvegardées, THE Dashboard SHALL afficher les simulations sous forme de cartes synthétiques (style ProductCard) montrant: nom, département, puissance, production annuelle et économies.
3. WHILE l'utilisateur possède plus de 3 simulations, THE Dashboard SHALL limiter l'affichage à 3 simulations maximum avec un lien "Voir toutes mes simulations".
4. WHEN l'utilisateur clique sur une carte de simulation, THE Dashboard SHALL rediriger vers Calculator_Page avec les paramètres pré-remplis pour relancer le calcul.
5. WHEN l'utilisateur clique sur supprimer une simulation, THE Dashboard SHALL demander confirmation puis supprimer la simulation de Simulations_Table.

### Requirement 4: Gestion des simulations

**User Story:** En tant qu'utilisateur connecté, je veux pouvoir supprimer mes simulations, afin de libérer de la place pour de nouvelles.

#### Acceptance Criteria

1. WHEN l'utilisateur supprime une simulation, THE Backend SHALL supprimer l'entrée de Simulations_Table et confirmer la suppression.
2. IF une erreur survient lors d'une opération sur une simulation, THEN THE Dashboard SHALL afficher un message d'erreur explicite à l'utilisateur.
3. IF l'utilisateur atteint la limite de 3 simulations ET tente d'en sauvegarder une nouvelle, THEN THE Calculator_Page SHALL afficher un message indiquant de supprimer une simulation existante depuis l'espace client.
