# Requirements Document

## Introduction

Ce document définit les exigences pour harmoniser la mise en page de toutes les pages secondaires du site EOLIA en prenant la page d'accueil comme référence. L'objectif est de réduire les espaces vides excessifs, d'utiliser la largeur disponible de manière cohérente, et de minimiser le scroll nécessaire tout en conservant une expérience utilisateur agréable.

## Glossary

- **EOLIA**: Le système de site web e-commerce pour éoliennes verticales Tulipe
- **Section**: Bloc de contenu délimité par une balise `<section>` avec son propre fond et padding
- **Conteneur**: Élément `div` avec classe `max-w-*` qui limite la largeur du contenu
- **Padding vertical**: Espacement haut/bas d'une section (classes Tailwind `py-*`)
- **Pages secondaires**: Pages identifiées avec padding excessif : WhyEolia, Vision, AboutUs, Contact, HowItWorks, ConsuelProcess, Ambassador, Partners

## Requirements

### Requirement 1

**User Story:** As a user, I want consistent vertical spacing across all pages, so that the site feels cohesive and I don't have to scroll excessively.

#### Acceptance Criteria

1. THE EOLIA system SHALL use padding `py-8 lg:py-10` for standard content sections on all pages
2. THE EOLIA system SHALL use padding `py-4 lg:py-6` for compact sections (trust indicators, category filters)
3. THE EOLIA system SHALL use padding `py-8 lg:py-10` for CTA sections on all pages
4. THE EOLIA system SHALL NOT use padding values exceeding `py-10` on any section

### Requirement 2

**User Story:** As a user, I want the content to use the available screen width effectively, so that I can see more information without excessive empty margins.

#### Acceptance Criteria

1. THE EOLIA system SHALL use container width `max-w-[1400px]` for main content sections on all pages
2. THE EOLIA system SHALL use container width `max-w-4xl` or `max-w-5xl` only for text-heavy sections requiring narrower reading width
3. THE EOLIA system SHALL maintain consistent horizontal padding `px-4 sm:px-6 lg:px-8` on all containers

### Requirement 3

**User Story:** As a user, I want the internal spacing within sections to be compact, so that the content feels dense and informative.

#### Acceptance Criteria

1. THE EOLIA system SHALL use margin `mb-8` for section headers (title + description blocks)
2. THE EOLIA system SHALL use gap `gap-6` or `gap-8` for grid layouts
3. THE EOLIA system SHALL use padding `p-4` to `p-6` for card components

### Requirement 4

**User Story:** As a user, I want subtle animations on all pages, so that the browsing experience feels modern and engaging.

#### Acceptance Criteria

1. THE EOLIA system SHALL apply Framer Motion fade-in animations to section content on all pages
2. THE EOLIA system SHALL use simple animation patterns: opacity 0→1 and translateY 20px→0
3. THE EOLIA system SHALL trigger animations on viewport entry with `viewport={{ once: true }}`
4. THE EOLIA system SHALL preserve existing color schemes and gradients
5. THE EOLIA system SHALL ensure animations remain performant on mobile devices

### Requirement 5

**User Story:** As a developer, I want the changes to be minimal and targeted, so that the risk of regression is low.

#### Acceptance Criteria

1. THE EOLIA system SHALL modify only padding and width-related classes
2. THE EOLIA system SHALL NOT restructure component hierarchies
3. THE EOLIA system SHALL NOT modify content or functionality
4. THE EOLIA system SHALL apply changes consistently across all affected pages
