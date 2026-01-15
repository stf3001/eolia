# Requirements Document

## Introduction

Cette fonctionnalité vise à enrichir l'expérience client lors de la consultation des forfaits pose sur la page Produits. Lorsqu'un client clique sur la catégorie "Forfaits Pose", il doit accéder à une explication détaillée et pédagogique de ce que comprend le service d'installation EOLIA, incluant les démarches administratives, les garanties professionnelles, et les points de vigilance importants.

## Glossary

- **TGBT**: Tableau Général Basse Tension - tableau électrique principal de la maison
- **RGE**: Reconnu Garant de l'Environnement - certification des professionnels du bâtiment
- **Décennale**: Assurance responsabilité civile décennale obligatoire pour les travaux de construction
- **Consuel**: Comité National pour la Sécurité des Usagers de l'Électricité - organisme de certification
- **Enedis**: Gestionnaire du réseau de distribution d'électricité en France
- **Mise à la terre**: Dispositif de sécurité électrique reliant l'installation à la terre
- **Forfait_Pose_System**: Système d'affichage des informations détaillées des forfaits pose

## Requirements

### Requirement 1: Affichage d'informations détaillées sur les forfaits pose

**User Story:** En tant que client potentiel, je veux comprendre en détail ce que comprend un forfait pose, afin de prendre une décision éclairée sur mon achat.

#### Acceptance Criteria

1. WHEN le client sélectionne la catégorie "Forfaits Pose" sur la page Produits, THE Forfait_Pose_System SHALL afficher une section explicative pédagogique au-dessus de la liste des forfaits.

2. THE Forfait_Pose_System SHALL présenter les informations suivantes de manière structurée :
   - Description du service d'installation par un partenaire certifié RGE avec assurance décennale
   - Liste des démarches administratives prises en charge (Enedis, Consuel, contrat revente surplus)
   - Recommandation d'informer l'assureur habitation

3. THE Forfait_Pose_System SHALL afficher un encadré d'information sur la vérification de la mise à la terre incluant :
   - Explication de la vérification le jour de l'installation
   - Seuil de 100 ohms maximum pour la mise en service immédiate
   - Procédure en cas de terre non conforme
   - Mention de l'importance vitale de la mise à la terre

### Requirement 2: Présentation pédagogique du processus d'installation

**User Story:** En tant que client non-expert, je veux comprendre le déroulement de l'installation de manière simple, afin de savoir à quoi m'attendre.

#### Acceptance Criteria

1. THE Forfait_Pose_System SHALL présenter le processus d'installation en étapes claires et numérotées.

2. THE Forfait_Pose_System SHALL utiliser un langage accessible et non-technique pour expliquer chaque étape.

3. THE Forfait_Pose_System SHALL inclure des icônes visuelles pour faciliter la compréhension de chaque étape.

### Requirement 3: Mise en avant des garanties professionnelles

**User Story:** En tant que client soucieux de la qualité, je veux être rassuré sur le professionnalisme des installateurs, afin d'avoir confiance dans le service.

#### Acceptance Criteria

1. THE Forfait_Pose_System SHALL afficher de manière visible les certifications des partenaires installateurs (RGE, décennale).

2. THE Forfait_Pose_System SHALL mentionner que les partenaires sont encadrés et formés par EOLIA.

3. THE Forfait_Pose_System SHALL inclure une mention sur le raccordement "dans les règles de l'art" au TGBT.

### Requirement 4: Information sur les démarches administratives

**User Story:** En tant que client, je veux savoir quelles démarches administratives sont prises en charge par EOLIA, afin de comprendre la valeur ajoutée du forfait.

#### Acceptance Criteria

1. THE Forfait_Pose_System SHALL lister explicitement les démarches administratives incluses :
   - Demande de raccordement Enedis
   - Assistance pour le contrat de revente de surplus
   - Demande de visite Consuel

2. THE Forfait_Pose_System SHALL expliquer brièvement le rôle de chaque démarche de manière pédagogique.

3. THE Forfait_Pose_System SHALL recommander au client d'informer son assureur habitation de l'ajout du matériel, en faisant le parallèle avec les panneaux solaires.

### Requirement 5: Alerte sur la mise à la terre

**User Story:** En tant que client, je veux être informé des prérequis techniques avant l'installation, afin d'éviter les mauvaises surprises le jour J.

#### Acceptance Criteria

1. THE Forfait_Pose_System SHALL afficher un encadré distinct (type "Note importante" ou "À savoir") concernant la vérification de la mise à la terre.

2. THE Forfait_Pose_System SHALL expliquer que si la résistance de terre dépasse 100 ohms, la mise en service immédiate ne pourra pas être effectuée.

3. THE Forfait_Pose_System SHALL préciser que le technicien fournira la valeur mesurée et des préconisations pour corriger le problème.

4. THE Forfait_Pose_System SHALL mentionner que la mise à la terre est une obligation de sécurité vitale, indépendamment de l'éolienne, et requise pour le Consuel.

5. THE Forfait_Pose_System SHALL rassurer le client en indiquant que la mise en service sera effectuée dès que la terre sera conforme.
