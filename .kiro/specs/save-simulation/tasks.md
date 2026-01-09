# Implementation Plan

- [x] 1. Backend - Table DynamoDB et configuration





  - [x] 1.1 Ajouter SimulationsTable dans serverless.yml


    - Créer la table avec userId (HASH) et simulationId (RANGE)
    - Ajouter les permissions IAM pour la nouvelle table
    - Ajouter la variable d'environnement SIMULATIONS_TABLE
    - _Requirements: 2.1, 2.3_

- [x] 2. Backend - Endpoints API simulations





  - [x] 2.1 Créer la fonction createSimulation (POST /simulations)


    - Valider le token JWT et extraire userId
    - Vérifier la limite de simulations (max 10)
    - Générer simulationId (UUID) et nom auto "Simulation [dept] - [date]"
    - Sauvegarder dans DynamoDB
    - _Requirements: 2.1, 2.2, 2.4_
  - [x] 2.2 Créer la fonction getSimulations (GET /simulations)


    - Valider le token JWT et extraire userId
    - Query DynamoDB par userId
    - Retourner la liste triée par date décroissante
    - _Requirements: 2.3_

  - [x] 2.3 Créer la fonction deleteSimulation (DELETE /simulations/{simulationId})

    - Valider le token JWT et extraire userId
    - Supprimer l'item de DynamoDB
    - _Requirements: 4.1_

- [x] 3. Frontend - Types et service simulations






  - [x] 3.1 Créer les types SavedSimulation et PendingSimulation

    - Ajouter le fichier src/types/simulation.ts
    - _Requirements: 2.1_
  - [x] 3.2 Créer simulationService.ts


    - Implémenter saveSimulation, getSimulations, deleteSimulation
    - Gérer les erreurs et le token d'authentification
    - _Requirements: 2.1, 2.3, 4.1_

- [x] 4. Frontend - Composants calculateur






  - [x] 4.1 Créer SaveSimulationButton

    - Bouton avec états: default, loading, saved, error
    - Intégrer useAuth pour vérifier l'authentification
    - Appeler simulationService.saveSimulation si connecté
    - Ouvrir AuthRequiredModal si non connecté
    - _Requirements: 1.1, 1.2, 1.7_

  - [x] 4.2 Créer AuthRequiredModal

    - Modale avec titre et message explicatif
    - Boutons "Se connecter" et "Créer un compte"
    - Sauvegarder simulation en localStorage avant redirection
    - _Requirements: 1.3, 1.4, 1.5_

  - [x] 4.3 Modifier Calculator.tsx pour gérer la simulation en attente

    - Au mount, vérifier localStorage pour simulation en attente
    - Si présente et user connecté, restaurer les résultats
    - Proposer la sauvegarde automatiquement
    - _Requirements: 1.6_

  - [x] 4.4 Intégrer SaveSimulationButton dans ResultsDisplay

    - Passer inputs et results en props
    - Afficher sous les résultats principaux
    - _Requirements: 1.1_

- [x] 5. Frontend - Dashboard simulations






  - [x] 5.1 Créer SimulationCard

    - Afficher nom, département, puissance, production, économies
    - Bouton supprimer avec confirmation
    - Clic sur carte = navigation vers /calculateur avec params
    - _Requirements: 3.2, 3.4, 3.5_
  - [x] 5.2 Ajouter section "Mes simulations" dans Dashboard.tsx


    - Charger les simulations au mount
    - Afficher les SimulationCards (max 3 visibles)
    - Gérer états: loading, empty, error
    - _Requirements: 3.1, 3.2, 3.3_

- [x] 6. Frontend - Navigation avec paramètres






  - [x] 6.1 Modifier Calculator.tsx pour accepter les paramètres URL

    - Lire les query params (dept, power, count, etc.)
    - Pré-remplir le formulaire et lancer le calcul automatiquement
    - _Requirements: 3.4_
