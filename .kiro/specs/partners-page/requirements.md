# Requirements Document

## Introduction

Cette fonctionnalité vise à créer une page "Nos Partenaires" complète pour le site EOLIA. La page présentera l'écosystème de partenaires sélectionnés par EOLIA pour accompagner les installations éoliennes : onduleurs adaptés à l'éolien, batteries intelligentes, et installateurs qualifiés. La page inclura une section éducative sur les spécificités de l'énergie éolienne (intermittence, variabilité) et l'importance d'équipements adaptés.

## Glossary

- **EOLIA_Frontend**: L'application React/TypeScript du site web EOLIA
- **Header**: Le composant de navigation principal du site
- **Partenaire**: Une entreprise ou réseau dont les produits/services sont recommandés par EOLIA
- **Énergie intermittente**: Énergie dont la production varie selon les conditions météorologiques
- **Onduleur**: Équipement convertissant le courant continu en courant alternatif
- **Fronius**: Fabricant autrichien d'onduleurs, reconnu pour sa robustesse et son adaptation à l'éolien
- **IMEON**: Fabricant breton d'onduleurs hybrides avec intelligence artificielle, fondé en 2013, coté en bourse
- **Energiestro/VOSS**: Système de stockage par volant d'inertie en béton enterré (10 kWh), écologique, sans usure, garanti à vie

## Requirements

### Requirement 1: Navigation vers la page Partenaires

**User Story:** En tant que visiteur du site EOLIA, je veux accéder facilement à la page des partenaires depuis le menu principal, afin de découvrir l'écosystème de confiance d'EOLIA.

#### Acceptance Criteria

1. WHEN l'utilisateur consulte le Header, THE EOLIA_Frontend SHALL afficher un lien "Nos Partenaires" dans la navigation principale entre "FAQ" et "Ambassadeur".
2. WHEN l'utilisateur clique sur "Nos Partenaires", THE EOLIA_Frontend SHALL naviguer vers la route "/partenaires".
3. WHEN l'utilisateur est sur la page "/partenaires", THE EOLIA_Frontend SHALL afficher le lien "Nos Partenaires" comme actif dans le Header.
4. WHILE l'utilisateur navigue sur mobile, THE EOLIA_Frontend SHALL afficher le lien "Nos Partenaires" dans le menu mobile.

### Requirement 2: Section héro et introduction éducative

**User Story:** En tant que visiteur, je veux comprendre pourquoi EOLIA a sélectionné des partenaires spécifiques, afin de saisir l'importance d'équipements adaptés à l'éolien.

#### Acceptance Criteria

1. WHEN la page Partenaires se charge, THE EOLIA_Frontend SHALL afficher une section héro avec le titre "Nos Partenaires" et un sous-titre explicatif.
2. WHEN la page Partenaires se charge, THE EOLIA_Frontend SHALL afficher une section éducative expliquant le principe de l'éolienne et des énergies intermittentes.
3. THE EOLIA_Frontend SHALL expliquer que le vent est plus intermittent et moins prévisible que le soleil ou l'eau.
4. THE EOLIA_Frontend SHALL présenter l'importance de matériel adapté spécifiquement à l'éolien.
5. THE EOLIA_Frontend SHALL utiliser le style visuel cohérent avec le reste du site EOLIA (couleurs sky-600, arrondis, ombres douces).

### Requirement 3: Carte partenaire Fronius

**User Story:** En tant que visiteur, je veux découvrir Fronius comme partenaire onduleur d'EOLIA, afin de comprendre pourquoi cet équipement est recommandé pour mon installation éolienne.

#### Acceptance Criteria

1. WHEN la page Partenaires se charge, THE EOLIA_Frontend SHALL afficher une carte dédiée à Fronius.
2. THE EOLIA_Frontend SHALL présenter Fronius comme fabricant autrichien fondé en 1945 avec plus de 75 ans d'expérience.
3. THE EOLIA_Frontend SHALL mettre en avant la robustesse et la fiabilité des onduleurs Fronius.
4. THE EOLIA_Frontend SHALL indiquer que Fronius est particulièrement adapté à l'éolien grâce à sa gestion des variations de puissance.
5. THE EOLIA_Frontend SHALL mentionner les garanties étendues et le SAV de qualité de Fronius.
6. THE EOLIA_Frontend SHALL afficher un lien vers une page détaillée Fronius ou une section dédiée.
7. THE EOLIA_Frontend SHALL présenter les certifications et la présence mondiale de Fronius (plus de 3 millions d'onduleurs installés).

### Requirement 4: Carte partenaire Installateurs Électriciens

**User Story:** En tant que visiteur, je veux connaître le réseau d'installateurs partenaires d'EOLIA, afin d'avoir confiance dans la qualité de l'installation de mon éolienne.

#### Acceptance Criteria

1. WHEN la page Partenaires se charge, THE EOLIA_Frontend SHALL afficher une carte dédiée au réseau d'installateurs électriciens partenaires.
2. THE EOLIA_Frontend SHALL présenter les critères de sélection des installateurs (formation, certification, expérience).
3. THE EOLIA_Frontend SHALL mettre en avant la couverture géographique du réseau en France.
4. THE EOLIA_Frontend SHALL mentionner les garanties liées à l'installation par un partenaire agréé.
5. THE EOLIA_Frontend SHALL afficher un lien vers une page de contact ou de demande de devis.

### Requirement 5: Carte partenaire IMEON

**User Story:** En tant que visiteur, je veux découvrir IMEON comme partenaire onduleur hybride d'EOLIA, afin de comprendre comment l'intelligence artificielle optimise mon installation éolienne.

#### Acceptance Criteria

1. WHEN la page Partenaires se charge, THE EOLIA_Frontend SHALL afficher une carte dédiée à IMEON.
2. THE EOLIA_Frontend SHALL présenter IMEON comme fabricant breton fondé en 2013, coté en bourse.
3. THE EOLIA_Frontend SHALL expliquer le rôle de l'IA intégrée dans l'optimisation de la gestion énergétique (apprentissage des habitudes, prédiction).
4. THE EOLIA_Frontend SHALL mettre en avant la conception et fabrication française (Made in Bretagne).
5. THE EOLIA_Frontend SHALL présenter les avantages spécifiques pour l'éolien (gestion de l'intermittence, compatibilité batteries longue durée).
6. THE EOLIA_Frontend SHALL mentionner les garanties (10 ans extensible à 20 ans) et le SAV de proximité.
7. THE EOLIA_Frontend SHALL afficher un lien vers une page détaillée ou une section dédiée.

### Requirement 6: Carte partenaire Energiestro (VOSS)

**User Story:** En tant que visiteur, je veux découvrir le système de stockage Energiestro partenaire d'EOLIA, afin de connaître cette solution innovante et écologique pour mon installation.

#### Acceptance Criteria

1. WHEN la page Partenaires se charge, THE EOLIA_Frontend SHALL afficher une carte dédiée à Energiestro (technologie VOSS - Volant de Stockage Solide).
2. THE EOLIA_Frontend SHALL expliquer le principe du volant d'inertie : un cylindre de béton enterré qui accélère lors des surplus et restitue l'énergie par inertie.
3. THE EOLIA_Frontend SHALL mettre en avant la capacité de stockage de 10 kWh.
4. THE EOLIA_Frontend SHALL présenter les avantages écologiques : aucune usure, aucun bruit, aucun risque d'incendie, matériaux durables.
5. THE EOLIA_Frontend SHALL mentionner la garantie à vie, argument différenciant majeur.
6. THE EOLIA_Frontend SHALL indiquer la compatibilité avec les installations éoliennes et solaires.
7. THE EOLIA_Frontend SHALL afficher un lien vers une page détaillée ou vers energiestro.fr.

### Requirement 7: Design et cohérence visuelle

**User Story:** En tant que visiteur, je veux que la page Partenaires soit visuellement cohérente avec le reste du site EOLIA, afin d'avoir une expérience utilisateur fluide et professionnelle.

#### Acceptance Criteria

1. THE EOLIA_Frontend SHALL utiliser la palette de couleurs EOLIA (primary/sky-600, gris, blanc).
2. THE EOLIA_Frontend SHALL afficher les 4 cartes partenaires dans une grille responsive (1 colonne mobile, 2 colonnes tablette, 4 colonnes desktop).
3. THE EOLIA_Frontend SHALL appliquer des effets de survol cohérents avec le reste du site (hover:bg-primary/5, transitions).
4. THE EOLIA_Frontend SHALL utiliser les icônes Lucide React cohérentes avec le design system existant.
5. THE EOLIA_Frontend SHALL inclure une section CTA en bas de page invitant à contacter EOLIA ou à utiliser le calculateur.
6. WHILE l'utilisateur navigue sur mobile, THE EOLIA_Frontend SHALL adapter la mise en page pour une lecture optimale.

### Requirement 8: Pages détaillées partenaires

**User Story:** En tant que visiteur intéressé par un partenaire spécifique, je veux accéder à une page détaillée, afin d'obtenir des informations complètes et inspirant confiance.

#### Acceptance Criteria

1. WHEN l'utilisateur clique sur "En savoir plus" d'une carte partenaire, THE EOLIA_Frontend SHALL naviguer vers une page détaillée dédiée à ce partenaire.
2. THE EOLIA_Frontend SHALL afficher sur chaque page détaillée : présentation complète, avantages, caractéristiques techniques, témoignages si disponibles.
3. THE EOLIA_Frontend SHALL inclure des visuels ou logos du partenaire sur chaque page détaillée.
4. THE EOLIA_Frontend SHALL proposer un CTA de contact ou de demande d'information sur chaque page détaillée.
5. THE EOLIA_Frontend SHALL permettre un retour facile vers la page principale des partenaires.
