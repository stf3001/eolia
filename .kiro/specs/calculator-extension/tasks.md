# Implementation Plan

- [x] 1. Types et constantes de base






  - [x] 1.1 Créer les types TypeScript pour batterie et consommation

    - Ajouter `BatteryInputs`, `BatteryResults`, `ConsumptionData`, `ConsumptionMode` dans `eolia-frontend/src/types/calculator.ts`
    - Ajouter constantes `BATTERY_CAPACITIES`, `CYCLES_PER_YEAR`, `SEASONAL_PROFILE`
    - _Requirements: 1.1, 2.1, 2.3_


  - [x] 1.2 Créer les types pour Enedis

    - Créer `eolia-frontend/src/types/enedis.ts` avec `EnedisConsent`, `EnedisConsumption`, `EnedisDataResponse`
    - _Requirements: 5.1, 5.2_

- [x] 2. Service batterie (frontend)






  - [x] 2.1 Implémenter batteryService.ts

    - Créer `eolia-frontend/src/services/batteryService.ts`
    - Fonction `calculateBatteryImpact(capacity, naturalAutoconso, production, consumption)`
    - Logique : gain = capacity × 300, plafonnement à min(production, consumption)
    - Calcul économies supplémentaires
    - _Requirements: 1.2, 1.3, 1.5_


  - [x] 2.2 Tests unitaires batteryService

    - Tester calcul gain avec différentes capacités
    - Tester plafonnement
    - _Requirements: 1.2, 1.3_

- [x] 3. Service consommation (frontend)






  - [x] 3.1 Implémenter consumptionService.ts

    - Créer `eolia-frontend/src/services/consumptionService.ts`
    - Fonction `applySeasonalProfile(annualTotal)` avec profil standard
    - Fonctions `getConsumptionProfile(userId)` et `saveConsumptionProfile(userId, data)`
    - _Requirements: 2.2, 2.3, 7.1, 7.2_


  - [x] 3.2 Tests unitaires consumptionService

    - Tester répartition saisonnière (somme = 100%)
    - _Requirements: 2.3_

- [x] 4. Service autoconsommation (frontend)






  - [x] 4.1 Implémenter autoconsumptionService.ts - calcul mensuel

    - Créer `eolia-frontend/src/services/autoconsumptionService.ts`
    - Fonction `calculateMonthlyAutoconsumption(monthlyProd, monthlyConso)`
    - Logique ratio de couverture : autoconso = min(prod, conso) par mois
    - _Requirements: 3.1, 3.2, 3.3_



  - [x] 4.2 Implémenter calcul horaire Weibull
    - Fonction `generateHourlyProduction(monthlyWindSpeed, powerKwc, turbineCount)`
    - Distribution Weibull k=2.0 pour répartir les heures par vitesse
    - Fonction `calculateHourlyAutoconsumption(hourlyProd, hourlyConso)`
    - _Requirements: 3.4, 3.5_


  - [x] 4.3 Tests unitaires autoconsumptionService

    - Tester ratio couverture < 1 et > 1
    - Tester génération Weibull
    - _Requirements: 3.1, 3.2, 3.3_

- [x] 5. Composant BatterySelector




  - [x] 5.1 Créer le composant BatterySelector


    - Créer `eolia-frontend/src/components/calculator/BatterySelector.tsx`
    - Sélecteur avec options 5, 10, 15, 20, 25, 30, 35 kWh
    - Affichage gain et économies en temps réel
    - Indicateur de plafonnement si applicable
    - _Requirements: 1.1, 1.2, 1.5_

- [x] 6. Composant ConsumptionPanel






  - [x] 6.1 Créer le composant ConsumptionPanel

    - Créer `eolia-frontend/src/components/calculator/ConsumptionPanel.tsx`
    - Tabs pour modes Simple / Précis / Enedis
    - Mode Simple : champ consommation annuelle
    - Mode Précis : tableau 12 mois avec total temps réel
    - _Requirements: 2.1, 2.2, 2.4, 2.5_

- [x] 7. Composant EnedisConsentForm






  - [x] 7.1 Créer le composant EnedisConsentForm

    - Créer `eolia-frontend/src/components/calculator/EnedisConsentForm.tsx`
    - Champs PDL (14 chiffres), Nom, Adresse
    - Validation PDL côté client
    - Affichage statut consentement existant
    - _Requirements: 5.1, 5.8_

- [x] 8. Graphiques étendus






  - [x] 8.1 Créer le composant SuperpositionChart

    - Créer `eolia-frontend/src/components/calculator/SuperpositionChart.tsx`
    - Graphique Recharts AreaChart avec zones empilées
    - Zones : autoconsommation naturelle, gain batterie, surplus
    - Courbe consommation en overlay
    - Tooltip détaillé par mois
    - _Requirements: 6.1, 6.2, 6.3_


  - [x] 8.2 Créer le composant BatteryComparisonChart

    - Créer `eolia-frontend/src/components/calculator/BatteryComparisonChart.tsx`
    - Graphique avant/après batterie (barres groupées ou donut)
    - Affichage taux autoconsommation en %
    - _Requirements: 1.4_

- [x] 9. Composant PersonalizedSummary






  - [x] 9.1 Créer le composant PersonalizedSummary

    - Créer `eolia-frontend/src/components/calculator/PersonalizedSummary.tsx`
    - Encart avec message "Si vous aviez eu votre installation..."
    - Affichage production, autoconsommation, économies, surplus
    - Mention gain batterie si activée
    - Message valorisant l'éolien
    - _Requirements: 4.1, 4.2, 4.3, 3.7_

- [x] 10. Backend - Endpoints consommation






  - [x] 10.1 Créer endpoint POST /consumption

    - Créer `eolia-backend/src/functions/consumption/saveConsumption.ts`
    - Validation mode et données
    - Stockage DynamoDB (PK: USER#userId, SK: CONSUMPTION)
    - _Requirements: 7.1, 7.3_


  - [x] 10.2 Créer endpoint GET /consumption

    - Créer `eolia-backend/src/functions/consumption/getConsumption.ts`
    - Récupération profil utilisateur
    - _Requirements: 7.2_

- [x] 11. Backend - Endpoints Enedis






  - [x] 11.1 Créer endpoint POST /enedis/consent

    - Créer `eolia-backend/src/functions/enedis/createConsent.ts`
    - Validation PDL (14 chiffres)
    - Stockage consentement DynamoDB
    - _Requirements: 5.1, 5.2_


  - [x] 11.2 Créer endpoint POST /enedis/sync

    - Créer `eolia-backend/src/functions/enedis/syncData.ts`
    - Appel API Enedis DataConnect (structure préparée, implémentation réelle quand accès disponible)
    - Stockage données horaires S3
    - _Requirements: 5.3, 5.4_


  - [x] 11.3 Créer endpoint GET /enedis/data

    - Créer `eolia-backend/src/functions/enedis/getData.ts`
    - Lecture données S3
    - Retour données horaires et agrégées
    - _Requirements: 5.5, 5.6_

- [x] 12. Intégration page Calculator






  - [x] 12.1 Étendre ResultsDisplay avec batterie

    - Modifier `eolia-frontend/src/components/calculator/ResultsDisplay.tsx`
    - Intégrer BatterySelector après les résultats de production
    - Afficher résultats batterie si capacité sélectionnée
    - _Requirements: 1.1, 1.4, 1.5_


  - [x] 12.2 Intégrer ConsumptionPanel dans Calculator

    - Modifier `eolia-frontend/src/pages/Calculator.tsx`
    - Afficher ConsumptionPanel si utilisateur connecté
    - Passer données consommation au calcul
    - _Requirements: 2.1_


  - [x] 12.3 Intégrer graphiques et synthèse

    - Ajouter SuperpositionChart si consommation renseignée
    - Ajouter PersonalizedSummary avec tous les résultats
    - _Requirements: 6.1, 4.1_

- [x] 13. Extension sauvegarde simulation






  - [x] 13.1 Étendre le modèle de simulation

    - Modifier `eolia-frontend/src/types/simulation.ts` pour inclure consommation et batterie
    - Modifier `eolia-backend/src/functions/simulations/createSimulation.ts` pour accepter les nouveaux champs
    - _Requirements: 4.4_


  - [x] 13.2 Mettre à jour SaveSimulationButton

    - Modifier `eolia-frontend/src/components/calculator/SaveSimulationButton.tsx`
    - Inclure données consommation et batterie dans la sauvegarde
    - _Requirements: 4.4_

- [x] 14. Configuration infrastructure






  - [x] 14.1 Ajouter routes API dans serverless.yml

    - Ajouter endpoints /consumption et /enedis/*
    - Configurer permissions DynamoDB et S3
    - _Requirements: 5.2, 5.4, 7.1_
