# Design Document - EOLIA Platform

## Overview

EOLIA est une plateforme e-commerce React/TypeScript avec backend serverless AWS, reprenant l'architecture éprouvée d'Hydrolia. Le site commercialise des éoliennes verticales Tulipe avec un calculateur de production intégré, un système de commande clé en main, et un programme ambassadeur dual B2C/B2B.

### Stack Technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| UI Components | lucide-react (icônes), recharts (graphiques), framer-motion (animations) |
| State | React Context (Auth, Cart) |
| Backend | AWS Lambda Node.js 20.x, Serverless Framework |
| Database | DynamoDB (7 tables) |
| Auth | AWS Cognito + Amplify |
| Storage | AWS S3 (contrats PDF) |
| Email | AWS SES |
| Payment | Stripe |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend React/Vite                       │
│                    (localhost:5173)                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway (HTTP API)                    │
│                         + CORS                               │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Lambda      │  │   Lambda      │  │   Lambda      │
│   Auth        │  │   Business    │  │   Contracts   │
│  (Node.js)    │  │  (Node.js)    │  │  (Python)     │
└──────┬────────┘  └──────┬────────┘  └──────┬────────┘
       │                  │                  │
       ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Cognito     │  │   DynamoDB    │  │      S3       │
│  User Pool    │  │  (7 tables)   │  │  (Contracts)  │
└───────────────┘  └───────────────┘  └───────────────┘
```

## Components and Interfaces

### Frontend Structure

```
eolia-frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── calculator/
│   │   │   ├── CalculatorForm.tsx
│   │   │   ├── ResultsDisplay.tsx
│   │   │   └── ProductionChart.tsx
│   │   ├── shop/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── CartSidebar.tsx
│   │   │   └── CheckoutForm.tsx
│   │   ├── ambassador/
│   │   │   ├── AmbassadorDashboard.tsx
│   │   │   ├── ReferralsList.tsx
│   │   │   └── CommissionsTable.tsx
│   │   └── common/
│   │       ├── CookieBanner.tsx
│   │       └── ProtectedRoute.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Calculator.tsx
│   │   ├── Products.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Partners.tsx (IMEON/Fronius)
│   │   ├── Diagnostic.tsx
│   │   ├── Anemometer.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Ambassador.tsx
│   │   ├── B2BRegistration.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── FAQ.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── ConsuelProcess.tsx
│   │   └── Legal/ (CGV, Mentions, Cookies)
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── services/
│   │   ├── calculatorService.ts
│   │   ├── addressService.ts
│   │   ├── affiliateService.ts
│   │   ├── orderService.ts
│   │   └── paymentService.ts
│   ├── data/
│   │   ├── windData.json (12 départements)
│   │   ├── turbineModels.json (courbe Tulipe)
│   │   └── products.json (catalogue)
│   ├── types/
│   │   ├── calculator.ts
│   │   ├── product.ts
│   │   ├── order.ts
│   │   └── affiliate.ts
│   └── config/
│       └── aws-config.ts
```

### Backend Structure (Serverless)

```
eolia-backend/
├── src/
│   ├── functions/
│   │   ├── auth/
│   │   │   ├── register.ts
│   │   │   ├── login.ts
│   │   │   ├── confirmSignUp.ts
│   │   │   └── getMe.ts
│   │   ├── products/
│   │   │   ├── getProducts.ts
│   │   │   └── createProduct.ts
│   │   ├── orders/
│   │   │   ├── createOrder.ts
│   │   │   └── getOrders.ts
│   │   ├── addresses/
│   │   │   ├── createAddress.ts
│   │   │   ├── getAddresses.ts
│   │   │   └── updateAddress.ts
│   │   ├── affiliates/
│   │   │   ├── registerB2B.ts
│   │   │   ├── getProfile.ts
│   │   │   └── validateCode.ts
│   │   ├── referrals/
│   │   │   ├── createManual.ts
│   │   │   └── getReferrals.ts
│   │   ├── commissions/
│   │   │   └── getCommissions.ts
│   │   ├── payments/
│   │   │   └── createPaymentIntent.ts
│   │   ├── contracts/
│   │   │   ├── generateContract.py
│   │   │   └── downloadContract.ts
│   │   └── notifications/
│   │       └── sendEmail.ts
│   ├── services/
│   │   ├── dynamodb.ts
│   │   ├── cognito.ts
│   │   ├── stripeService.ts
│   │   └── affiliateService.ts
│   └── models/
│       ├── affiliate.ts
│       ├── referral.ts
│       └── commission.ts
├── serverless.yml
└── package.json
```

## Data Models

### DynamoDB Tables

#### Products
```typescript
interface Product {
  productId: string;        // PK
  name: string;
  category: 'turbine' | 'inverter' | 'accessory' | 'installation';
  subcategory?: string;     // Ex: 'forfait_pose_30m', 'pales', 'mat'
  price: number;
  powerKwc?: number;        // Pour éoliennes
  description: string;
  specs: Record<string, string>;
  imageUrl: string;
  stock: number;
  includes?: string[];      // Pour forfaits: ['DP mairie', 'Enedis', 'Consuel'...]
  createdAt: number;
}
```

#### Users
```typescript
interface User {
  userId: string;           // PK
  email: string;            // GSI
  name: string;
  familyName: string;
  role: 'client' | 'ambassadeur' | 'admin';
  createdAt: number;
}
```

#### Orders
```typescript
interface Order {
  orderId: string;          // PK
  createdAt: number;        // SK
  userId: string;           // GSI
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'validated' | 'shipped' | 'delivered';
  type: 'standard' | 'anemometer_loan';
  installationDetails?: {
    installationType: 'mono' | 'tri';
    meterPower: number;
    tgbtDistance: '<30m' | '30-60m' | '60-100m';
    postalCode: string;
  };
  shippingAddress: Address;
  paymentIntentId: string;
  affiliateCode?: string;
  suspensiveConditions?: string;
}
```

#### Addresses
```typescript
interface Address {
  userId: string;           // PK
  addressId: string;        // SK
  label: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  isDefault: boolean;
}
```

#### Affiliates
```typescript
interface Affiliate {
  affiliateId: string;      // PK
  userId: string;           // GSI
  email: string;            // GSI
  code: string;             // GSI (8 chars unique)
  type: 'B2C' | 'B2B';
  status: 'active' | 'suspended';
  // B2C
  referralCount?: number;
  referralLimit?: number;   // 10 pour B2C
  // B2B
  companyName?: string;
  siret?: string;
  contractUrl?: string;
  cumulativeRevenue?: number;
  currentTier?: number;     // 5, 7.5, 10, 12.5
  createdAt: number;
}
```

#### Referrals
```typescript
interface Referral {
  referralId: string;       // PK
  createdAt: number;        // SK
  affiliateId: string;      // GSI
  email: string;
  firstName: string;
  lastName: string;
  status: 'pending' | 'converted';
  totalPurchases: number;
}
```

#### Commissions
```typescript
interface Commission {
  commissionId: string;     // PK
  createdAt: number;        // SK
  affiliateId: string;      // GSI
  orderId: string;
  amount: number;
  type: 'voucher' | 'cash';
  status: 'pending' | 'validated' | 'paid';
  orderAmount: number;
  commissionRate: number;
}
```

## Calculator Service (Frontend)

```typescript
// src/services/calculatorService.ts

interface CalculatorInputs {
  departmentCode: string;
  powerKwc: number;
  turbineCount: number;
  // Optionnel - données anémomètre
  anemometerSpeed?: number;
  anemometerMonth?: number;
}

interface CalculatorResults {
  annualProduction: number;      // kWh
  monthlyProduction: number[];   // 12 valeurs
  annualSavings: number;         // € (production × 0.26)
  scalingFactor?: number;        // Si anémomètre utilisé
}

// Données statiques
const WIND_DATA: Record<string, Record<number, number>> = {
  "75": { 1: 4.52, 2: 4.50, ... },  // Paris
  "29": { 1: 6.80, 2: 6.50, ... },  // Brest
  // ... 12 départements
};

const TULIPE_POWER_CURVE = {
  windSpeedMs: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  powerKw: [0, 0, 0.05, 0.25, 0.6, 1.0, 1.6, 2.3, 3.0, 3.6, 4.2, 4.7, 5.0, 5.05, 5.0],
  nominalKwc: 6.0
};

class EoliaCalculator {
  calculate(inputs: CalculatorInputs): CalculatorResults {
    // 1. Récupérer données vent du département
    // 2. Appliquer scaling si anémomètre fourni
    // 3. Interpoler sur courbe de puissance (scaling linéaire selon kWc)
    // 4. Calculer production mensuelle
    // 5. Appliquer bonus grappe +5% si turbineCount > 1
    // 6. Retourner résultats
  }
}
```

## Error Handling

### Frontend
- Validation formulaires avec messages d'erreur inline
- Toast notifications pour erreurs API
- Fallback UI pour erreurs de chargement

### Backend
- Réponses HTTP standardisées (200, 400, 401, 404, 500)
- Logs CloudWatch pour debugging
- Validation des inputs avec messages explicites

```typescript
// Format réponse erreur
{
  statusCode: 400,
  body: {
    error: "VALIDATION_ERROR",
    message: "Le SIRET doit contenir 14 chiffres"
  }
}
```

## Notes Pré-Déploiement

> **TODO AVANT DÉPLOIEMENT PRODUCTION :**
> - [ ] Vérifier si AWS WAF est nécessaire (protection DDoS, rate limiting)
> - [ ] Vérifier si Security Hub / GuardDuty sont nécessaires (conformité, détection menaces)
> - [ ] Configurer les alertes CloudWatch
> - [ ] Passer Stripe en mode production
> - [ ] Configurer le domaine eolia.fr

## Testing Strategy

### Frontend
- Tests unitaires: calculatorService (logique métier)
- Tests composants: formulaires critiques (Calculator, Checkout)

### Backend
- Tests Lambda locaux via serverless-offline
- Tests API avec curl/Postman

### Stripe
- Mode test avec cartes de test (4242...)

## Design System - Charte Green Tech

### Couleurs
```css
--color-primary: #065f46;      /* Vert émeraude */
--color-primary-light: #10b981;
--color-background: #ffffff;   /* Blanc pur */
--color-text: #1f2937;         /* Gris anthracite */
--color-text-light: #6b7280;
--color-border: #e5e7eb;
```

### Typography
- Font: System fonts (sans-serif)
- Headings: font-bold
- Body: font-normal

### Components
- Boutons: rounded-full, bg-primary, hover:opacity-90
- Cards: rounded-xl, shadow-lg
- Inputs: rounded-lg, border, focus:ring-primary
