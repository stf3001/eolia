# Requirements Document

## Introduction

Cette fonctionnalité vise à supprimer complètement le diagnostic éolien de la plateforme EOLIA. Le diagnostic actuel ne remplit pas son rôle : les données ne sont pas sauvegardées et ne sont pas utilisées par le calculateur de production. Pour simplifier le parcours utilisateur et éviter toute confusion, le diagnostic sera retiré ainsi que le CTA associé sur la page d'accueil.

## Glossary

- **Diagnostic éolien** : Formulaire multi-étapes permettant d'évaluer le potentiel éolien d'un site (page `/diagnostic`)
- **CTA (Call-To-Action)** : Bouton d'appel à l'action incitant l'utilisateur à effectuer une action
- **Page d'accueil** : Page principale du site accessible via la route `/`
- **Calculateur** : Outil de calcul de production éolienne (page `/calculateur`)

## Requirements

### Requirement 1

**User Story:** En tant qu'administrateur du site, je veux supprimer la page de diagnostic éolien, afin de retirer une fonctionnalité inutilisée qui n'apporte pas de valeur.

#### Acceptance Criteria

1. WHEN un utilisateur accède à la route `/diagnostic`, THE Application SHALL afficher une page 404 ou rediriger vers la page d'accueil.
2. THE Application SHALL ne plus inclure le fichier `Diagnostic.tsx` dans le code source.
3. THE Application SHALL ne plus déclarer la route `/diagnostic` dans le routeur.

### Requirement 2

**User Story:** En tant qu'utilisateur, je veux que la page d'accueil ne propose plus le diagnostic éolien, afin de ne pas être dirigé vers une fonctionnalité inexistante.

#### Acceptance Criteria

1. THE Page d'accueil SHALL ne plus afficher le bouton "Faire un diagnostic" dans la section CTA.
2. THE Page d'accueil SHALL conserver les deux autres CTA : "Calculer ma production" et "Recevoir mon anémomètre".
3. THE Page d'accueil SHALL adapter le texte d'introduction de la section CTA pour refléter les deux options restantes.

### Requirement 3

**User Story:** En tant que développeur, je veux que le code soit nettoyé de toute référence au diagnostic, afin de maintenir une base de code propre.

#### Acceptance Criteria

1. THE Application SHALL ne contenir aucun import du composant `Diagnostic` dans les fichiers source.
2. THE Application SHALL ne contenir aucun lien (`<Link>`) pointant vers `/diagnostic`.
