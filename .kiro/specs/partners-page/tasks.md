# Implementation Plan

- [x] 1. Mettre à jour la navigation Header





  - Ajouter "Nos Partenaires" dans le tableau `navLinks` du fichier `Header.tsx`
  - Positionner le lien entre "FAQ" et "Ambassadeur"
  - Vérifier que le lien s'affiche correctement en desktop et mobile
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Créer la structure de données des partenaires





  - Créer le fichier `eolia-frontend/src/data/partners.ts`
  - Définir l'interface `Partner` avec tous les champs nécessaires
  - Implémenter les données des 4 partenaires (Fronius, IMEON, Energiestro, Installateurs)
  - _Requirements: 3.1, 4.1, 5.1, 6.1_

- [x] 3. Créer le composant PartnerCard





  - Créer le dossier `eolia-frontend/src/components/partners/`
  - Créer le fichier `PartnerCard.tsx` avec l'interface `PartnerCardProps`
  - Implémenter le design de la carte (icône, nom, tagline, highlights, bouton)
  - Ajouter les effets hover et les transitions
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 4. Refondre la page Partners.tsx principale






  - [x] 4.1 Créer la section Hero avec gradient sky

    - Titre "Nos Partenaires" et sous-titre explicatif
    - Style cohérent avec le reste du site EOLIA
    - _Requirements: 2.1, 2.5_

  - [x] 4.2 Créer la section éducative sur l'intermittence

    - Explication du principe de l'éolienne et des énergies intermittentes
    - Comparaison visuelle vent/soleil/eau
    - Texte sur l'importance d'équipements adaptés
    - _Requirements: 2.2, 2.3, 2.4_

  - [x] 4.3 Implémenter la grille des 4 cartes partenaires

    - Utiliser le composant PartnerCard
    - Grille responsive (1 col mobile, 2 col tablette, 4 col desktop)
    - _Requirements: 7.2, 7.6_

  - [x] 4.4 Créer la section CTA en bas de page

    - Boutons vers calculateur et contact
    - _Requirements: 7.5_

- [x] 5. Créer la page détaillée Fronius





  - Créer le dossier `eolia-frontend/src/pages/partners/`
  - Créer `FroniusDetail.tsx` avec toutes les sections (présentation, avantages éolien, gamme, garanties)
  - Mettre en avant : robustesse, 75+ ans, adapté éolien, garantie 10 ans, SAV
  - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 6. Créer la page détaillée IMEON





  - Créer `ImeonDetail.tsx` avec toutes les sections
  - Mettre en avant : Bretagne, IA intégrée, coté en bourse, garantie 20 ans
  - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 7. Créer la page détaillée Energiestro





  - Créer `EnergiestroDetail.tsx` avec toutes les sections
  - Expliquer le principe du volant d'inertie en béton
  - Mettre en avant : garanti à vie, 10 kWh, zéro usure, écologique
  - Ajouter lien externe vers energiestro.fr
  - _Requirements: 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 8. Créer la page détaillée Installateurs





  - Créer `InstallersDetail.tsx` avec toutes les sections
  - Présenter le réseau, critères de sélection, garanties
  - Ajouter formulaire/lien de contact
  - _Requirements: 4.2, 4.3, 4.4, 4.5, 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 9. Configurer les routes dans App.tsx





  - Importer les 4 nouvelles pages détaillées
  - Ajouter les routes `/partenaires/fronius`, `/partenaires/imeon`, `/partenaires/energiestro`, `/partenaires/installateurs`
  - Vérifier que la route `/partenaires` existante pointe vers la page refaite
  - _Requirements: 1.2, 8.1_

- [ ]* 10. Tests et validation
  - [ ]* 10.1 Vérifier la navigation complète (Header → Partners → Detail → Back)
  - [ ]* 10.2 Tester le responsive sur mobile, tablette et desktop
  - [ ]* 10.3 Vérifier les liens externes (energiestro.fr)
