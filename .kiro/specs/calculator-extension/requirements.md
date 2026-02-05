# Requirements Document

## Introduction

Extension du calculateur EOLIA existant pour ajouter trois nouvelles fonctionnalités :
1. **Simulation de stockage batterie** (mode public) - permettant aux visiteurs de simuler l'impact d'une batterie sur leur autoconsommation
2. **Saisie de consommation** (espace client) - permettant aux utilisateurs connectés d'affiner leur profil de consommation
3. **Logique de superposition** - croisant production éolienne, consommation et stockage pour une restitution personnalisée

Le moteur de calcul existant (production éolienne, anémomètre, effet venturi) reste inchangé.

## Glossaire

- **Calculateur_EOLIA** : Module frontend de simulation de production éolienne existant
- **Autoconsommation_Naturelle** : Part de la production éolienne consommée directement sans stockage
- **Autoconsommation_Batterie** : Énergie supplémentaire autoconsommée grâce au stockage
- **Autoconsommation_Totale** : Somme de l'autoconsommation naturelle et batterie
- **Ratio_Couverture** : Rapport Production/Consommation mensuel (Load Fraction)
- **Profil_Saisonnier_Standard** : Répartition mensuelle type de la consommation française
- **Cycles_Annuels** : Nombre de cycles complets de charge/décharge batterie par an (300)
- **Surplus** : Production non autoconsommée, réinjectée gratuitement sur le réseau

## Requirements

### Requirement 1 : Simulation de Stockage Batterie (Mode Public)

**User Story:** En tant que visiteur du site EOLIA, je veux simuler l'ajout d'une batterie à mon installation éolienne, afin de visualiser le gain d'autoconsommation et les économies supplémentaires.

#### Acceptance Criteria

1. WHEN l'utilisateur a obtenu des résultats de production, THE Calculateur_EOLIA SHALL afficher un sélecteur de capacité batterie avec les options 5, 10, 15, 20, 25, 30, 35 kWh.

2. WHEN l'utilisateur sélectionne une capacité batterie, THE Calculateur_EOLIA SHALL calculer le gain d'autoconsommation selon la formule : Gain_Batterie = Capacité_kWh × 300 cycles.

3. WHILE une capacité batterie est sélectionnée, THE Calculateur_EOLIA SHALL plafonner l'autoconsommation totale à la valeur minimale entre la consommation annuelle du foyer et la production annuelle de l'éolienne.

4. WHEN le calcul avec batterie est effectué, THE Calculateur_EOLIA SHALL afficher un graphique Recharts comparant l'autoconsommation avant/après batterie en pourcentage.

5. WHEN le calcul avec batterie est effectué, THE Calculateur_EOLIA SHALL afficher les économies supplémentaires en euros basées sur le gain d'autoconsommation × 0.26 €/kWh.

6. IF aucune consommation n'est renseignée, THEN THE Calculateur_EOLIA SHALL utiliser une valeur par défaut de 10 000 kWh/an pour le calcul d'autoconsommation.

### Requirement 2 : Saisie de Consommation - Mode Simple (Espace Client)

**User Story:** En tant qu'utilisateur connecté, je veux saisir ma consommation électrique annuelle ou mensuelle, afin d'obtenir une simulation personnalisée de mon autoconsommation.

#### Acceptance Criteria

1. WHEN l'utilisateur accède au calculateur en étant connecté, THE Calculateur_EOLIA SHALL afficher une section "Ma consommation" avec deux modes : Simple et Précis.

2. WHEN l'utilisateur choisit le mode Simple, THE Calculateur_EOLIA SHALL afficher un champ de saisie pour la consommation annuelle totale en kWh.

3. WHEN l'utilisateur saisit une consommation annuelle, THE Calculateur_EOLIA SHALL répartir automatiquement cette valeur sur 12 mois selon le profil saisonnier standard : Jan 13.5%, Fév 12%, Mars 10.5%, Avr 8%, Mai 6.5%, Juin 5.5%, Juil 5%, Août 5%, Sep 6%, Oct 8%, Nov 9.5%, Déc 10.5%.

4. WHEN l'utilisateur choisit le mode Précis, THE Calculateur_EOLIA SHALL afficher un tableau de 12 champs pour saisir la consommation mensuelle en kWh.

5. WHILE l'utilisateur saisit des valeurs mensuelles, THE Calculateur_EOLIA SHALL afficher le total annuel calculé en temps réel.

### Requirement 3 : Calcul d'Autoconsommation Naturelle

**User Story:** En tant qu'utilisateur ayant renseigné ma consommation, je veux voir mon taux d'autoconsommation naturelle, afin de comprendre quelle part de ma production je consomme directement.

#### Acceptance Criteria

1. WHEN l'utilisateur a renseigné sa consommation mensuelle (Simple ou Précis), THE Calculateur_EOLIA SHALL calculer le ratio de couverture mensuel : R = Production_Mensuelle / Consommation_Mensuelle.

2. WHEN le ratio de couverture R est inférieur ou égal à 1, THE Calculateur_EOLIA SHALL considérer l'autoconsommation naturelle égale à la production mensuelle.

3. WHEN le ratio de couverture R est supérieur à 1, THE Calculateur_EOLIA SHALL considérer l'autoconsommation naturelle égale à la consommation mensuelle et le surplus égal à Production - Consommation.

4. WHEN l'utilisateur a des données Enedis horaires, THE Calculateur_EOLIA SHALL calculer l'autoconsommation heure par heure : pour chaque heure, Autoconso = min(Production_Horaire, Consommation_Horaire).

5. WHEN le calcul horaire est effectué, THE Calculateur_EOLIA SHALL calculer la production horaire via la distribution de Weibull (k=2.0) appliquée à la vitesse moyenne mensuelle pour répartir les heures par tranche de vitesse.

6. WHEN le calcul est effectué, THE Calculateur_EOLIA SHALL afficher le taux d'autoconsommation annuel en pourcentage : (Autoconsommation_Totale / Production_Totale) × 100.

7. WHEN le calcul est effectué, THE Calculateur_EOLIA SHALL afficher un message valorisant l'éolien : "L'éolien produit souvent en phase avec votre consommation (nuit/hiver), maximisant votre autoconsommation."

### Requirement 4 : Restitution Personnalisée

**User Story:** En tant qu'utilisateur ayant complété ma simulation, je veux voir un bilan personnalisé de type "Si j'avais eu mon installation l'an dernier...", afin de me projeter concrètement.

#### Acceptance Criteria

1. WHEN tous les calculs sont effectués (production, consommation, batterie optionnelle), THE Calculateur_EOLIA SHALL afficher un encart de synthèse avec le message : "Si vous aviez eu votre installation l'an dernier, vous auriez produit X kWh, autoconsommé Y kWh et économisé Z €".

2. WHEN la batterie est activée, THE Calculateur_EOLIA SHALL afficher dans la synthèse : "Dont W kWh grâce à votre batterie".

3. WHEN le calcul est effectué, THE Calculateur_EOLIA SHALL afficher le surplus réinjecté gratuitement sur le réseau.

4. WHEN le calcul est effectué, THE Calculateur_EOLIA SHALL permettre la sauvegarde de la simulation complète (production + consommation + batterie) dans l'espace client.

### Requirement 5 : Intégration Enedis - Mode Expert (Espace Client)

**User Story:** En tant qu'utilisateur connecté, je veux connecter mon compteur Linky via Enedis, afin d'obtenir automatiquement mes données de consommation réelles pour une simulation ultra-précise.

#### Acceptance Criteria

1. WHEN l'utilisateur choisit le mode Expert (Enedis), THE Calculateur_EOLIA SHALL afficher un formulaire de consentement avec les champs : PDL (Point de Livraison), Nom, Adresse.

2. WHEN l'utilisateur soumet le formulaire de consentement, THE Calculateur_EOLIA SHALL stocker les informations de consentement en base de données avec horodatage.

3. WHEN le consentement est validé, THE Calculateur_EOLIA SHALL appeler l'API Enedis DataConnect pour récupérer les données de consommation horaires ou demi-horaires sur 12 mois.

4. WHEN les données Enedis sont récupérées, THE Calculateur_EOLIA SHALL stocker les données de consommation en base de données pour éviter les appels API récurrents.

5. WHEN les données Enedis sont disponibles en base, THE Calculateur_EOLIA SHALL utiliser ces données stockées pour les calculs sans rappeler l'API.

6. WHILE les données Enedis sont stockées, THE Calculateur_EOLIA SHALL calculer l'autoconsommation heure par heure en comparant production horaire et consommation horaire pour un taux d'autoconsommation ultra-précis.

7. IF l'appel API Enedis échoue, THEN THE Calculateur_EOLIA SHALL afficher un message d'erreur explicite et proposer le mode Simple ou Précis en alternative.

8. WHEN l'utilisateur a des données Enedis stockées, THE Calculateur_EOLIA SHALL afficher un indicateur "Données Linky synchronisées" avec la date de dernière mise à jour.

### Requirement 6 : Visualisation Graphique Étendue

**User Story:** En tant qu'utilisateur, je veux visualiser graphiquement la superposition de ma production et consommation, afin de comprendre mon profil énergétique.

#### Acceptance Criteria

1. WHEN l'utilisateur a renseigné sa consommation, THE Calculateur_EOLIA SHALL afficher un graphique Recharts superposant les courbes mensuelles de production et consommation.

2. WHEN la batterie est activée, THE Calculateur_EOLIA SHALL afficher sur le graphique trois zones : autoconsommation naturelle, autoconsommation batterie, et surplus.

3. WHEN l'utilisateur survole le graphique, THE Calculateur_EOLIA SHALL afficher une infobulle avec les valeurs détaillées du mois : production, consommation, autoconsommation, surplus.

### Requirement 7 : Persistance des Données de Consommation

**User Story:** En tant qu'utilisateur connecté, je veux que mes données de consommation soient sauvegardées, afin de ne pas les ressaisir à chaque visite.

#### Acceptance Criteria

1. WHEN l'utilisateur connecté saisit sa consommation (Simple ou Précis), THE Calculateur_EOLIA SHALL sauvegarder les données de consommation dans son profil utilisateur.

2. WHEN l'utilisateur connecté revient sur le calculateur, THE Calculateur_EOLIA SHALL pré-remplir les champs avec ses données de consommation sauvegardées.

3. WHEN l'utilisateur modifie ses données de consommation, THE Calculateur_EOLIA SHALL mettre à jour les données sauvegardées.
