# Ezra Portal

<div align="center">
  <img src="public/logo.svg" alt="Ezra Logo" width="120" />
  <h3>Enterprise AI Automation Platform for Franchise Operations</h3>
  <p>Client Portal & Marketing Site</p>
</div>

---

## Overview

Ezra is a **managed AI automation platform** designed for franchisors, franchisees, and multi-unit operators. This repository contains the front-end codebase for both the public marketing website and the secure client portal.

### Key Features

- **Universal POS Integration**: Connects to Zenoti, Stripe, Toast, Square, and more
- **Automated Data Extraction**: HachiAI-powered automation for systems without APIs
- **Real-time Analytics**: Comprehensive dashboards for sales, labor, and operations
- **Multi-location Support**: Scales from 3 to 200+ locations per client
- **Role-based Access**: Support for franchisors, franchisees, and managers

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| State | React Context |
| Date Handling | date-fns |

---

## Project Structure

```
ezra-portal/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (marketing)/        # Public marketing site routes
│   │   │   ├── page.tsx        # Home/Landing page
│   │   │   ├── bots/           # Bot product pages
│   │   │   ├── about/          # About page
│   │   │   └── contact/        # Contact page
│   │   ├── (auth)/             # Authentication routes
│   │   │   └── login/          # Login page
│   │   ├── app/                # Client portal (protected)
│   │   │   ├── page.tsx        # Executive dashboard
│   │   │   ├── locations/      # Business locations
│   │   │   ├── reports/        # Reports section
│   │   │   └── settings/       # Settings
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Base UI primitives
│   │   ├── charts/             # Chart wrapper components
│   │   ├── dashboard/          # Dashboard-specific components
│   │   ├── layout/             # Layout components (sidebar, nav)
│   │   └── marketing/          # Marketing site components
│   ├── data/                   # Mock data modules
│   │   ├── mockClients.ts
│   │   ├── mockLocations.ts
│   │   └── mockSalesData.ts
│   ├── hooks/                  # Custom React hooks
│   │   ├── useSalesData.ts
│   │   ├── useLocations.ts
│   │   └── useOverviewMetrics.ts
│   ├── lib/                    # Utility functions
│   │   ├── utils.ts
│   │   └── formatters.ts
│   ├── context/                # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   └── types/                  # TypeScript type definitions
│       └── index.ts
├── public/                     # Static assets
├── .env.example               # Environment variables template
├── tailwind.config.js         # Tailwind configuration
├── next.config.js             # Next.js configuration
└── package.json               # Dependencies and scripts
```

---

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/ezra-portal.git
   cd ezra-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |

---

## Mock Data

This codebase uses **mock data** for all dashboard visualizations. The mock data layer is designed to mirror the structure of real API responses for seamless integration later.

### Mock Data Modules

- **`mockClients.ts`**: Client/brand information
- **`mockLocations.ts`**: Store locations with metadata
- **`mockSalesData.ts`**: Daily sales metrics per location

### Data Hooks

```typescript
// Example usage
import { useSalesData } from '@/hooks/useSalesData';

function SalesDashboard({ storeId }: { storeId: string }) {
  const { data, isLoading, error } = useSalesData(storeId, {
    startDate: '2024-01-01',
    endDate: '2024-01-31',
  });
  
  // Render dashboard...
}
```

### Replacing with Real Data

When connecting to the actual backend:

1. Update `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
2. Modify hooks in `/src/hooks/` to call real API endpoints
3. The component layer requires no changes if API response shapes match

---

## Architecture Notes

### Authentication Flow (Mock)

The current implementation uses a mock authentication flow:
- Any email/password combination is accepted
- A fake JWT token is stored in localStorage
- The token is checked on protected routes

**For production**: Replace with your actual auth provider (Auth0, Clerk, custom JWT, etc.)

### Data Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   HachiAI /     │     │   Centralized    │     │   Ezra Portal   │
│   API Extractors│────▶│   Database       │────▶│   (This App)    │
│   (Producer)    │     │   MySQL/Postgres │     │   (Consumer)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### POS System Support

| System | Integration Method | Status |
|--------|-------------------|--------|
| Zenoti | VM + Browser Automation | Active |
| Stripe | Direct API | Active |
| Toast | API Integration | Planned |
| Square | API Integration | Planned |
| Clover | API Integration | Planned |

---

## Design System

### Colors

- **Primary (Ezra Cyan)**: `#06b6d4` - Used for CTAs, highlights, and brand elements
- **Surface**: Neutral grays for backgrounds and cards
- **Status**: Green (success), Amber (warning), Red (danger)

### Typography

- **Display**: Bold headlines, tight letter-spacing
- **Body**: Clean, readable content text
- **Mono**: Code and technical data

### Components

All components support both light and dark modes. Key components:

- `KPICard` - Metric display with trend indicators
- `DataTable` - Sortable, filterable tables with pagination
- `ChartCard` - Wrapper for Recharts visualizations
- `Sidebar` - Collapsible navigation
- `TopBar` - Header with user menu and breadcrumbs

---

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production

Ensure these are set in your production environment:

```
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://api.ezra.ai
```

---

## Contributing

1. Create a feature branch from `main`
2. Make your changes with clear commit messages
3. Run `npm run lint` and `npm run type-check`
4. Submit a pull request

---

## License

Proprietary - Ezra AI, Inc. All rights reserved.

---

<div align="center">
  <p>Built with ❤️ by the Ezra Engineering Team</p>
</div>
