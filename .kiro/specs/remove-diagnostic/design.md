# Design Document

## Overview

Suppression simple de la fonctionnalité diagnostic éolien : retrait de la page, de la route, et du CTA sur l'accueil.

## Fichiers à modifier

1. **Supprimer** : `eolia-frontend/src/pages/Diagnostic.tsx`
2. **Modifier** : `eolia-frontend/src/App.tsx` - retirer l'import et la route `/diagnostic`
3. **Modifier** : `eolia-frontend/src/pages/Home.tsx` - retirer le CTA "Faire un diagnostic" et adapter le texte

## Changements Home.tsx

Section CTA actuelle avec 3 boutons → 2 boutons restants :
- ~~Faire un diagnostic~~ (supprimé)
- Calculer ma production (conservé)
- Recevoir mon anémomètre (conservé)

Adapter le texte d'intro : "Deux façons de démarrer..." au lieu de "Trois façons..."
