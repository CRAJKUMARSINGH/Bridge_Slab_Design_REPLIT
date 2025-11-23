# Slab Bridge Design System

## Overview

This application is an **IRC Code-Compliant Submersible Bridge Design System** that automates the generation of detailed engineering documentation for slab bridges. The system accepts hydraulic and geometric parameters (either manually or via Excel upload), performs comprehensive structural calculations following IRC:6-2016 and IRC:112-2015 standards, and generates complete 44-sheet engineering reports in Excel and PDF formats.

**Core Purpose:** Transform bridge design input parameters into fully vetted, code-compliant engineering documentation with detailed calculations for hydraulics, pier design, abutment design, slab design, reinforcement schedules, and quantity estimates.

**Key Capabilities:**
- Excel template upload with automatic parameter extraction
- Complete design generation using IRC standards
- Pigeaud's analysis for slab design
- Multi-sheet workbook interface for data review and editing
- Export to comprehensive Excel reports (44+ sheets) and PDF documentation

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript
- Vite for build tooling and development server
- Wouter for client-side routing
- TanStack Query (React Query) for server state management
- Tailwind CSS with shadcn/ui component library

**Application Structure:**
- **Single Page Application (SPA)** with client-side routing
- **Component-based architecture** using shadcn/ui design system
- **State management** through React Query for server data synchronization
- **Route structure:**
  - `/` - Projects list page (home)
  - `/workbook/:id` - Multi-sheet workbook interface for viewing/editing bridge designs

**Key Design Decisions:**
- **Workbook Interface:** Mimics Excel-like experience with multiple sheets (General Input, Hydraulics, Load Analysis, Structural Analysis, etc.) for familiar engineer workflow
- **Real-time calculations:** Design parameters update dynamically as users modify inputs
- **Sheet-based navigation:** Sidebar navigation groups design sheets into logical categories (Input Data, Analysis, Design, Output)

### Backend Architecture

**Technology Stack:**
- Node.js with Express.js
- TypeScript for type safety
- Drizzle ORM for database operations
- Neon Serverless PostgreSQL for data persistence

**Server Structure:**
- **Development mode** (`index-dev.ts`): Vite integration with HMR for seamless development
- **Production mode** (`index-prod.ts`): Serves pre-built static assets
- **API-first design:** RESTful endpoints under `/api` namespace

**Core Modules:**

1. **Design Engine** (`design-engine.ts`)
   - Implements IRC:6-2016 and IRC:112-2015 calculations
   - Generates complete design output from input parameters
   - Calculates hydraulics (afflux, velocity, Froude number)
   - Performs pier and abutment structural design
   - Computes slab design using Pigeaud's moment coefficients
   - Generates reinforcement schedules and quantity estimates

2. **Excel Parser** (`excel-parser.ts`)
   - Parses uploaded Excel templates to extract design parameters
   - Handles comprehensive 44-sheet workbooks
   - Extracts hydraulic data, geometry, and material properties

3. **Excel Export** (`excel-export.ts`)
   - Generates detailed 44+ sheet Excel workbooks
   - Formats calculations with proper styling and borders
   - Includes all design sheets: Project Info, Hydraulics, Pier Design, Abutment Design, Slab Design, Reinforcement Schedules, Quantities

4. **PDF Export** (`pdf-export.ts`)
   - Creates formatted PDF reports using jsPDF
   - Professional layout with headers, footers, and sectioned content
   - Includes tables for all design calculations

**API Endpoints:**
- `POST /api/upload-design-excel` - Upload Excel template, auto-generate design
- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get specific project with design data
- `POST /api/projects` - Create new project
- `PATCH /api/projects/:id` - Update project design data
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:id/export/excel` - Download Excel report
- `GET /api/projects/:id/export/pdf` - Download PDF report

### Data Storage

**Database Schema (PostgreSQL via Neon):**

**Users Table:**
- Basic authentication structure (currently unused in main workflow)
- UUID primary keys

**Projects Table:**
- `id` - Serial primary key
- `name` - Project name
- `location` - Project location
- `district` - Administrative district
- `engineer` - Engineer name
- `designData` - JSONB field containing complete design calculations
- `createdAt`, `updatedAt` - Timestamps

**Design Data Structure (stored as JSON):**
```typescript
{
  input: DesignInput,      // Raw parameters (discharge, span, width, etc.)
  output: DesignOutput,    // Complete calculations (hydraulics, pier, abutment, slab)
  workbookData: {          // Optional comprehensive workbook data
    projectInfo: {...},
    hydraulics: {...},
    pier: {...},
    abutment: {...},
    slab: {...},
    quantities: {...},
    allSheets: {...}       // All 44 sheets preserved
  }
}
```

**Storage Pattern:**
- In-memory fallback (`MemStorage` class) for development without database
- Production uses Drizzle ORM with Neon serverless PostgreSQL
- Database connection pooling via `@neondatabase/serverless`

**Why JSONB for design data:**
- Flexible schema for complex engineering calculations
- Preserves complete calculation hierarchy without flattening
- Easy to version and extend with new calculation methods
- Efficient querying when needed for specific design parameters

### File Upload System

**Multer Configuration:**
- Memory storage strategy (no disk writes)
- Single file upload endpoint
- Direct buffer processing by XLSX library
- Excel files parsed in-memory and discarded after processing

**Upload Flow:**
1. User uploads Excel template from home page
2. File stored in memory via multer
3. Excel parser extracts parameters
4. Design engine generates complete calculations
5. Project created in database with full design data
6. User redirected to workbook view

## External Dependencies

### Core Infrastructure
- **Neon Serverless PostgreSQL** - Cloud database hosting
- **Replit platform** - Deployment and hosting environment

### Key Libraries
- **ExcelJS** - Excel file generation and parsing (44-sheet workbooks)
- **XLSX** - Excel file reading for template uploads
- **jsPDF** - PDF report generation
- **Drizzle ORM** - Type-safe database operations
- **shadcn/ui** - React component library (built on Radix UI primitives)
- **Tailwind CSS** - Utility-first styling framework
- **TanStack Query** - Server state management
- **React Hook Form + Zod** - Form validation and handling

### Development Tools
- **Vite** - Build tool and dev server with HMR
- **TypeScript** - Type safety across frontend and backend
- **tsx** - TypeScript execution for Node.js development

### Engineering Calculation Standards
- **IRC:6-2016** - Indian Roads Congress loading standards
- **IRC:112-2015** - Code of practice for concrete road bridges
- **Pigeaud's Method** - Slab moment coefficient analysis

**Note:** The application implements engineering calculations internally; no external engineering API dependencies are required. All structural analysis follows established IRC codes implemented in the design engine module.