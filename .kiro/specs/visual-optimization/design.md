# Design Document - Optimisation Visuelle EOLIA

## Overview

Ce document décrit les modifications techniques à apporter au frontend EOLIA pour densifier l'affichage, mieux utiliser la largeur d'écran et compacter les éléments visuels. L'approche est minimaliste : on ajuste les classes Tailwind existantes sans refonte architecturale.

## Architecture

L'architecture existante reste inchangée. Les modifications portent uniquement sur :
- Les classes Tailwind dans les composants React
- Aucun nouveau composant créé
- Aucune dépendance ajoutée

### Fichiers impactés

```
eolia-frontend/src/
├── index.css                          # Variables CSS (inchangé)
├── pages/
│   ├── Home.tsx                       # Hero, avantages, témoignages
│   ├── Products.tsx                   # Grille catalogue
│   ├── Dashboard.tsx                  # Espace client
│   └── Calculator.tsx                 # Page calculateur
├── components/
│   ├── shop/ProductCard.tsx           # Carte produit
│   └── layout/Header.tsx              # Navigation
```

## Components and Interfaces

### 1. Container Principal (toutes les pages)

**Modification globale** : Remplacer `max-w-7xl` par `max-w-[1400px]` ou `max-w-screen-xl` pour un compromis entre densité et lisibilité.

```tsx
// Avant
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Après
<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
```

### 2. ProductCard.tsx - Carte Produit Compacte

**Modifications :**

| Élément | Avant | Après |
|---------|-------|-------|
| Image ratio | `aspect-square` | `aspect-[4/3]` |
| Padding contenu | `p-4` | `p-3` |
| Taille titre | implicite | `text-sm` |
| Specs | `text-sm` | `text-xs` |
| Bouton | `px-4 py-2` | `px-3 py-1.5` |

```tsx
// Structure optimisée
<Link className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
  {/* Image - ratio 4:3 */}
  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
    {/* ... */}
  </div>
  
  {/* Content - padding réduit */}
  <div className="p-3 flex flex-col flex-grow">
    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1.5">
      {product.name}
    </h3>
    
    {/* Specs - texte plus petit */}
    <div className="space-y-0.5 mb-3 flex-grow">
      {mainSpecs.map(([key, value]) => (
        <div key={key} className="flex justify-between text-xs">
          <span className="text-gray-500">{key}</span>
          <span className="text-gray-700 font-medium">{value}</span>
        </div>
      ))}
    </div>
    
    {/* Prix et CTA - plus compact */}
    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
      <span className="text-lg font-bold text-primary">
        {formatPrice(product.price)}
      </span>
      <button className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-full text-xs font-medium">
        <ShoppingCart className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Ajouter</span>
      </button>
    </div>
  </div>
</Link>
```

### 3. Products.tsx - Grille Catalogue

**Modifications grille :**

```tsx
// Avant
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

// Après - plus de colonnes, gap réduit
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
```

**Modifications sections :**

```tsx
// Hero - padding réduit
<section className="bg-gradient-to-br from-emerald-800 to-emerald-600 text-white py-10">
  // py-16 → py-10

// Container
<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
  // py-8 → py-6
```

### 4. Home.tsx - Page d'Accueil

**Hero Section :**

```tsx
// Padding réduit
<section className="relative bg-gradient-to-br from-primary/5 via-white to-primary/10 py-4 lg:py-6 overflow-hidden">
  // py-6 lg:py-8 → py-4 lg:py-6
```

**Section Avantages :**

```tsx
// Section
<section className="py-8 lg:py-10 bg-white">
  // py-12 lg:py-14 → py-8 lg:py-10

// Titre
<div className="text-center mb-8">
  // mb-10 lg:mb-12 → mb-8

// Grille
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
  // gap-8 → gap-6

// Carte avantage
<div className="group p-4 rounded-2xl bg-gray-50 hover:bg-primary/5 transition-colors">
  // p-6 → p-4
  
  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
    // w-14 h-14 → w-12 h-12, mb-5 → mb-4
    <Zap className="h-6 w-6 text-primary" />
    // h-7 w-7 → h-6 w-6
```

**Section "Comment ça marche" :**

```tsx
<section className="py-8 lg:py-10 bg-gray-50">
  // py-12 lg:py-14 → py-8 lg:py-10

// Cercles numérotés
<div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg shadow-primary/25">
  // w-16 h-16 → w-12 h-12, mb-6 → mb-4, text-2xl → text-xl
```

**Section Témoignages :**

```tsx
// Grille
<div className="grid md:grid-cols-3 gap-6">
  // gap-8 → gap-6

// Carte témoignage
<div className="bg-gray-50 rounded-2xl p-5">
  // p-8 → p-5
  
  // Avatar
  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
    // w-12 h-12 → w-10 h-10
```

**Section CTA :**

```tsx
<section className="py-8 lg:py-10 bg-sky-600">
  // py-12 lg:py-14 → py-8 lg:py-10
```

### 5. Dashboard.tsx - Espace Client

**Welcome section :**

```tsx
<div className="mb-6 flex items-center justify-between">
  // mb-8 → mb-6
  
  <h1 className="text-3xl font-bold text-gray-900 mb-1">
    // text-4xl → text-3xl, mb-2 → mb-1
```

**Cartes principales (Anémomètre, Simulations) :**

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
  // gap-6 mb-6 → gap-4 mb-4

// Carte
<div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-4">
  // shadow-lg p-6 → shadow-md p-4
  
  // Icône
  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-3">
    // w-14 h-14 mr-4 → w-12 h-12 mr-3
    <Wind className="w-6 h-6 text-white" />
    // w-7 h-7 → w-6 h-6
```

**Cartes secondaires (Infos, Commandes, Adresses) :**

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
  // gap-6 mb-6 → gap-4 mb-4

// Carte
<div className="bg-white rounded-xl shadow-sm p-4">
  // shadow-md p-5 → shadow-sm p-4
  
  // Icône header
  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-2">
    // w-10 h-10 mr-3 → w-8 h-8 mr-2
    <User className="w-4 h-4 text-emerald-700" />
    // w-5 h-5 → w-4 h-4
  
  <h2 className="text-base font-bold text-gray-900">
    // text-lg → text-base
```

### 6. Header.tsx - Navigation

```tsx
// Espacement liens
<div className="hidden md:flex items-center gap-6">
  // gap-8 → gap-6
```

## Data Models

Aucune modification des modèles de données. Les changements sont purement visuels.

## Error Handling

Aucune gestion d'erreur supplémentaire nécessaire. Les modifications CSS ne peuvent pas générer d'erreurs runtime.

## Testing Strategy

### Tests visuels manuels

1. **Desktop (1920px)** : Vérifier que le contenu utilise bien la largeur disponible
2. **Laptop (1366px)** : Vérifier l'équilibre entre densité et lisibilité
3. **Tablette (768px)** : Vérifier la grille 2 colonnes produits
4. **Mobile (375px)** : Vérifier la lisibilité et les zones tactiles

### Checklist par page

- [ ] Home : Hero compact, avantages lisibles, témoignages alignés
- [ ] Products : 5 colonnes sur 2xl, cartes proportionnées
- [ ] Dashboard : Toutes les sections visibles sans scroll excessif
- [ ] Calculator : Formulaire et résultats bien équilibrés

### Points d'attention

- Vérifier que les textes ne sont pas tronqués de manière gênante
- S'assurer que les boutons restent facilement cliquables sur mobile
- Contrôler que les images ne sont pas déformées avec le nouveau ratio
