/**
 * Bridge Design System - Type Definitions
 * IRC:6-2016 & IRC:112-2015 Compliant
 */

// ============================================
// INPUT TYPES
// ============================================

export interface DesignInput {
  // Hydraulic Parameters
  discharge: number;        // m³/s - 100-year flood discharge
  floodLevel: number;       // m MSL - Highest recorded flood level
  bedLevel: number;         // m MSL - River bed elevation
  bedSlope: number;         // m/m - River longitudinal slope

  // Geometric Parameters
  span: number;             // m - Clear span length
  width: number;            // m - Deck width including footpaths
  numberOfLanes: number;    // - Traffic lanes for loading

  // Material Parameters
  fck: number;              // N/mm² - Concrete strength
  fy: number;               // N/mm² - Steel yield strength
  soilBearingCapacity: number; // kPa - Safe bearing capacity

  // Optional
  loadClass?: string;       // e.g., "70R" for Class 70 tracked vehicle
}

// ============================================
// HYDRAULIC CALCULATIONS
// ============================================

export interface HydraulicsOutput {
  flowDepth: number;           // m - Flow depth at design
  flowArea: number;            // m² - Cross-sectional area
  velocity: number;            // m/s - Mean flow velocity
  laceysSiltFactor: number;    // - Lacey's silt factor
  afflux: number;              // m - Water level rise
  designWaterLevel: number;    // m MSL - HFL + Afflux
  froudeNumber: number;        // - Flow regime indicator
  contraction: number;         // m - Contraction scour
  crossSectionData: CrossSectionData[];
}

export interface CrossSectionData {
  chainage: number;
  groundLevel: number;
  floodDepth: number;
  width: number;
  area: number;
  velocity: number;
}

// ============================================
// PIER DESIGN
// ============================================

export interface PierDesign {
  // Dimensions
  numberOfPiers: number;
  pierWidth: number;       // m
  pierLength: number;      // m
  pierDepth: number;       // m
  baseWidth: number;       // m
  baseLength: number;      // m
  spacing: number;         // m

  // Materials & Volumes
  pierConcrete: number;    // m³
  baseConcrete: number;    // m³
  pierSteel: number;       // kg/m³

  // Hydraulic Forces
  hydrostaticForce: number;  // kN
  dragForce: number;         // kN
  totalHorizontalForce: number; // kN

  // Stability Factors (FOS)
  slidingFOS: number;        // Factor of Safety - min 1.5
  overturnFOS: number;       // Factor of Safety - min 2.0
  bearingFOS: number;        // Factor of Safety - min 3.0

  // Status
  status: 'SAFE' | 'WARNING' | 'CRITICAL';
  remarks: string;
}

// ============================================
// ABUTMENT DESIGN
// ============================================

export interface AbutmentDesign {
  type: 'TYPE1' | 'C1' | 'CANTILEVER';
  
  // Dimensions
  height: number;          // m
  baseWidth: number;       // m
  baseLength: number;      // m
  wingWallLength: number;  // m

  // Earth Pressure
  activeEarthPressure: number;  // kN/m
  passiveEarthPressure: number; // kN/m
  frictionAngle: number;        // degrees

  // Materials & Volumes
  concrete: number;        // m³
  steel: number;          // kg/m³

  // Stability
  slidingFOS: number;
  overturnFOS: number;
  bearingFOS: number;

  // Status
  status: 'SAFE' | 'WARNING' | 'CRITICAL';
  remarks: string;
}

// ============================================
// SLAB DESIGN (PIGEAUD)
// ============================================

export interface SlabDesign {
  aspectRatio: number;           // Span / Width
  
  // Loads
  deadLoad: number;              // kN/m²
  liveLoad: number;              // kN/m²
  designLoad: number;            // kN/m² - 1.5×DL + 1.75×LL

  // Moments (per Pigeaud)
  longitudinalMoment: number;    // kNm - Max in span direction
  transverseMoment: number;      // kNm - Max in width direction
  
  // Deflection
  maxDeflection: number;         // mm
  deflectionLimit: number;       // mm - L/250

  // Status
  status: 'SAFE' | 'WARNING' | 'CRITICAL';
  remarks: string;
}

// ============================================
// FOOTING DESIGN
// ============================================

export interface FootingDesign {
  length: number;                // m
  width: number;                 // m
  depth: number;                 // m
  
  // Pressures
  appliedPressure: number;       // kPa
  safeBearingCapacity: number;   // kPa
  bearingFOS: number;            // min 3.0

  // Concrete & Steel
  concrete: number;              // m³
  steel: number;                 // kg/m³

  // Settlement
  settlement: number;            // mm
  settlementLimit: number;       // mm - 50mm typical

  status: 'SAFE' | 'WARNING' | 'CRITICAL';
}

// ============================================
// STEEL REINFORCEMENT
// ============================================

export interface SteelDesign {
  pierId: number;
  steelGrade: number;            // N/mm²
  
  // Main Reinforcement
  mainBars: {
    diameter: number;            // mm
    spacing: number;             // mm
    count: number;
    quantity: number;            // kg/m³
  };

  // Shear Reinforcement
  stirrups: {
    diameter: number;
    spacing: number;
    quantity: number;
  };

  totalQuantity: number;         // kg/m³
  totalCost: number;             // Rs
}

// ============================================
// LOAD CASES
// ============================================

export interface LoadCase {
  caseNumber: number;
  description: string;
  
  // Load factors
  deadLoadFactor: number;
  liveLoadFactor: number;
  windLoadFactor: number;
  seismicLoadFactor: number;
  temperatureFactor: number;

  // Resultant forces
  resultantHorizontal: number;   // kN
  resultantVertical: number;     // kN
  resultantMoment: number;       // kNm

  // Stability checks
  slidingFOS: number;
  overturnFOS: number;
  bearingFOS: number;

  status: 'SAFE' | 'WARNING' | 'CRITICAL';
}

// ============================================
// COMPLETE DESIGN OUTPUT
// ============================================

export interface CompleteDesignOutput {
  // Metadata
  projectInfo: {
    span: number;
    width: number;
    discharge: number;
    floodLevel: number;
    bedLevel: number;
    flowDepth: number;
  };

  // Calculations
  hydraulics: HydraulicsOutput;
  pier: PierDesign;
  abutmentType1: AbutmentDesign;
  slab: SlabDesign;
  footing: FootingDesign;
  steel: SteelDesign[];
  loadCases: LoadCase[];

  // Bill of Quantities
  boq: BillOfQuantities;

  // Overall Status
  overallStatus: 'COMPLIANT' | 'REVIEW_REQUIRED' | 'NON_COMPLIANT';
  criticalIssues: string[];
  warnings: string[];
}

// ============================================
// BILL OF QUANTITIES
// ============================================

export interface BillOfQuantities {
  // Earthwork
  excavation: number;           // m³
  backfill: number;             // m³

  // Concrete
  pccGrade: { quantity: number; rate: number; cost: number };
  rccGrade: { quantity: number; rate: number; cost: number };

  // Steel
  steelQuantity: number;        // kg
  steelRate: number;            // Rs/kg
  steelCost: number;            // Rs

  // Total
  totalCost: number;            // Rs
  costPerMeterSpan: number;     // Rs/m
}

// ============================================
// VALIDATION ERRORS
// ============================================

export interface ValidationError {
  field: string;
  message: string;
  severity: 'ERROR' | 'WARNING';
}

export interface DesignValidation {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}
