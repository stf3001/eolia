# Design Document

## Overview

Ajout d'un menu déroulant "À propos" dans le Header avec 4 nouvelles pages React. Structure simple inspirée d'Hydrolia, adaptée à l'éolien domestique.

## Architecture

Modification du Header existant pour ajouter un dropdown "À propos" + création de 4 pages dans `src/pages/`.

## Components

### Header Modification

Ajouter un dropdown "À propos" dans `navLinks` avec sous-menu :
- Qui sommes-nous → `/a-propos/qui-sommes-nous`
- Notre vision → `/a-propos/vision`
- Pourquoi Eolia → `/a-propos/pourquoi-eolia`
- Nous contacter → `/a-propos/contact`

### Nouvelles Pages

| Page | Fichier | Route |
|------|---------|-------|
| Qui sommes-nous | `AboutUs.tsx` | `/a-propos/qui-sommes-nous` |
| Notre vision | `Vision.tsx` | `/a-propos/vision` |
| Pourquoi Eolia | `WhyEolia.tsx` | `/a-propos/pourquoi-eolia` |
| Nous contacter | `Contact.tsx` | `/a-propos/contact` |

## Structure des Pages

Chaque page suit le même pattern qu'Hydrolia :
1. Hero section avec gradient et titre
2. Sections de contenu avec icônes Lucide
3. CTA en bas de page

### Contenu Placeholder

**Contact** (à modifier plus tard) :
- Adresse : 42 Avenue de l'Innovation, 75008 Paris
- Email : contact@eolia-energie.fr
- Téléphone : 01 23 45 67 89
- Horaires : Lun-Ven 9h-18h

## Routes

Ajouter dans `App.tsx` :
```tsx
<Route path="/a-propos/qui-sommes-nous" element={<AboutUs />} />
<Route path="/a-propos/vision" element={<Vision />} />
<Route path="/a-propos/pourquoi-eolia" element={<WhyEolia />} />
<Route path="/a-propos/contact" element={<Contact />} />
```

## Styling

Réutiliser les classes Tailwind existantes et le style des autres pages Eolia. Couleur primaire : `primary` (sky-600).
