# Slab Bridge Design System - React Web Application

## Overview

This project is a production-ready React + TypeScript web application designed to be a complete IRC:6-2016 & IRC:112-2015 Compliant Bridge Design System. It converts a complex 46-sheet Excel template into an interactive web application, maintaining over 2,336 formulas for generating real, IRC-compliant bridge calculations. The system automatically analyzes over 70 load cases, outputs a bill of quantities with costs, and provides a professional user interface. The primary goal is to provide a robust, interactive tool for civil engineering professionals to design slab bridges according to Indian Road Congress standards.

## User Preferences

I prefer iterative development with clear communication at each step. Please ask for confirmation before making major architectural changes or implementing new features. I value detailed explanations for complex logic or design decisions. Ensure the code is clean, well-commented, and follows best practices for a React/TypeScript application.

## System Architecture

The application follows a modular architecture, separating the UI from the calculation engine.

**UI/UX Decisions:**
- **Frontend Framework:** React for building the user interface.
- **Styling:** Tailwind CSS for a utility-first approach, ensuring a responsive and professional design across mobile and desktop.
- **Form Handling:** React Hook Form is used for managing form states and inputs.
- **Input Validation:** Zod schemas provide robust, real-time validation for all user inputs.
- **Navigation:** Tab-based navigation (`App.tsx`) provides a clear user workflow.
- **Design Feedback:** Color-coded alerts (green/yellow/red) indicate compliance status and factors of safety.
- **Testing Focus:** Over 50 `data-testid` attributes are integrated for automated testing.

**Technical Implementations:**
- **Core Logic:** All 2,336+ formulas from the original Excel template are converted into pure TypeScript calculation modules, ensuring type safety and performance.
- **Calculation Modules:** Eight specialized modules (e.g., Hydraulics, Pier, Abutment, Slab, Footing, Steel, LoadCases) handle specific engineering calculations.
- **Orchestration:** An `orchestrator.ts` module acts as the master calculation chain, coordinating inputs and outputs across all modules and generating the bill of quantities.
- **IRC Standards:** Full compliance with IRC:6-2016, IRC:112-2015, IS 456:2000, and IS 1893:2016 is integrated into the calculation logic, including specific Factors of Safety and Load Factors.
- **Bill of Quantities (BOQ):** Generates detailed BOQ with line-item costs, total cost, and cost per meter of span, formatted in Indian Rupees.

**Feature Specifications:**
- **Input Form:** Allows users to input 10 key parameters (Discharge, Flood Level, Bed Level, Bed Slope, Span, Width, Concrete Grade (fck), Steel Grade (fy), Soil Bearing Capacity (SBC), Lanes).
- **Results Page:** Displays overall compliance status, detailed hydraulic analysis, pier design (FOS indicators), abutment design (FOS), and footing design details.
- **BOQ Page:** Presents comprehensive bill of quantities for earthwork, concrete, and steel.

## External Dependencies

**Frontend:**
-   **React** (UI library)
-   **TypeScript** (Type safety)
-   **Vite** (Build tool)
-   **Tailwind CSS** (Styling)
-   **React Hook Form** (Form handling)
-   **Zod** (Input validation)

**Development Utilities:**
-   **Node.js** (Runtime)
-   **npm** (Package manager)
-   **PostCSS** (CSS processing)
-   **Autoprefixer** (Browser prefixes)