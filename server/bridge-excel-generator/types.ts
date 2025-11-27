/**
 * COMPREHENSIVE TYPE DEFINITIONS FOR BRIDGE EXCEL GENERATOR
 * Merges current app's detailed calculations with reference app's structure
 * 
 * This file defines all interfaces for:
 * - Project input data
 * - Hydraulics calculations
 * - Pier design (70 load cases, 168 stress points)
 * - Abutment design (155 load cases, 153 stress points)
 * - Slab design (34 stress points)
 * - Excel generation
 */

// ==================== PROJECT INPUT ====================

export interface ProjectInput {
  // Project Information
  projectName: string;
  location: string;
  district?: string;
  engineer?: string;
  riverName?: string;
  
  // Bridge Geometry
  spanLength: number;           // meters (same as 'span' in current app)
  numberOfSpans: number;        // count
  bridgeWidth: number;          // meters (same as 'width' in current app)
  totalLength?: number;         // meters (calculated)
  numberOfLanes?: number;       // count
  
  // Hydraulic Data
  discharge: number;            // Design discharge (m³/s or cumecs)
  hfl: number;                  // Highest Flood Level (m MSL) (same as 'floodLevel')
  bedLevel: number;             // Average bed level (m MSL)
  foundationLevel?: number;     // Foundation level (m MSL)
  bedSlope: number;             // Bed slope (1 in X)
  manningN?: number;            // Rugosity coefficient (default: 0.035)
  laceysSiltFactor?: number;    // Silt factor (default: 0.78)
  
  // Cross Section Data
  crossSectionData: CrossSectionPoint[];
  
  // Pier Data
  numberOfPiers: number;        // Count
  pierWidth: number;            // Width across flow (m)
  pierLength: number;           // Length along bridge (m)
  pierDepth: number;            // Depth from bed (m)
  pierBaseWidth: number;        // Base width (m)
  pierBaseLength: number;       // Base length (m)
  
  // Abutment Data
  abutmentHeight: number;       // Height (m)
  abutmentWidth: number;        // Width (m)
  abutmentDepth: number;        // Depth (m)
  dirtWallHeight: number;       // Dirt wall height (m)
  returnWallLength: number;     // Return wall length (m)
  
  // Material Properties
  concreteGrade?: string;       // M25, M30, M35
  fck: number;                  // Concrete strength (MPa)
  steelGrade?: string;          // Fe415, Fe500
  fy: number;                   // Steel yield strength (MPa)
  
  // Soil Properties
  sbc: number;                  // Safe bearing capacity (kPa) (same as 'soilBearingCapacity')
  phi: number;                  // Angle of internal friction (degrees)
  gamma: number;                // Unit weight of soil (kN/m³)
  
  // Design Levels (optional)
  rtl?: number;                 // Road top level (m MSL)
  agl?: number;                 // Average ground level (m MSL)
  nbl?: number;                 // Normal bed level (m MSL)
  ofl?: number;                 // Ordinary flood level (m MSL)
  dwl?: number;                 // Deep water level (m MSL)
  
  // Additional
  loadClass?: string;           // 'Class A' or 'Class AA'
}

export interface CrossSectionPoint {
  chainage: number;             // Distance (m)
  gl: number;                   // Ground level (m MSL) (same as 'groundLevel')
  width?: number;               // Width at this point (m)
}

// ==================== HYDRAULICS RESULTS ====================

export interface HydraulicsResult {
  // Area-Velocity Method
  crossSectionalArea: number;   // A (m²)
  wettedPerimeter?: number;     // P (m)
  hydraulicRadius?: number;     // R = A/P (m)
  velocity: number;             // V (m/s)
  discharge?: number;           // Q = A × V (cumecs)
  
  // Linear Waterway
  regimeWidth?: number;         // L = 4.8√Q (m)
  effectiveWaterway?: number;   // Actual waterway (m)
  
  // Scour Depth
  scourDepth?: number;          // dsm (m)
  designScourDepth?: number;    // 2 × dsm (m)
  
  // Afflux
  afflux: number;               // Afflux (m)
  designWaterLevel: number;     // HFL + afflux (m MSL)
  
  // Flow Characteristics
  froudeNumber: number;         // Fr = V/√(gh)
  flowType?: string;            // Subcritical/Supercritical
  
  // Additional from current app
  laceysSiltFactor: number;     // Silt factor
  contraction: number;          // Contraction loss (m)
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

// ==================== LOAD CASES ====================

export interface DetailedLoadCase {
  caseNumber: number;
  description: string;
  deadLoadFactor: number;
  liveLoadFactor: number;
  windLoadFactor: number;
  buoyancyFactor?: number;      // Optional for compatibility
  
  // Forces
  resultantHorizontal: number;  // Horizontal force (kN)
  resultantVertical: number;    // Vertical force (kN)
  moment?: number;              // Moment (kNm)
  
  // Stability Factors
  slidingFOS: number;           // ≥ 1.5
  overturningFOS: number;       // ≥ 1.8
  bearingFOS: number;           // ≥ 2.5
  
  // Status
  status: string;               // 'SAFE', 'UNSAFE', 'CHECK', 'ACCEPTABLE'
}

// Alias for compatibility with reference app
export type LoadCase = DetailedLoadCase;

// ==================== STRESS DISTRIBUTION ====================

export interface StressPoint {
  location: string;
  longitudinalStress: number;   // MPa
  transverseStress: number;     // MPa
  shearStress: number;          // MPa
  combinedStress: number;       // MPa
  status: string;               // 'Safe', 'Check', 'Unsafe'
}

// ==================== STEEL DETAILS ====================

export interface SteelDetails {
  diameter: number;             // mm
  spacing: number;              // mm c/c
  numberOfBars?: number;        // count
  quantity?: number;            // Alternative to numberOfBars
  area?: number;                // mm²
  weight?: number;              // kg
}

// ==================== PIER DESIGN RESULTS ====================

export interface PierDesignResult {
  // Geometry
  width: number;
  length: number;
  numberOfPiers: number;
  spacing: number;
  depth: number;
  baseWidth: number;
  baseLength: number;
  baseConcrete: number;
  pierConcrete: number;
  
  // Forces
  hydrostaticForce: number;
  dragForce: number;
  totalHorizontalForce: number;
  
  // Stability (Overall)
  slidingFOS: number;
  overturningFOS: number;
  bearingFOS: number;
  
  // Reinforcement
  mainSteel: SteelDetails;
  linkSteel: SteelDetails;
  
  // Detailed Analysis (from current app)
  loadCases: DetailedLoadCase[];        // 70 load cases
  stressDistribution: StressPoint[];    // 168 stress points
  
  // Optional detailed components (from reference app)
  geometry?: {
    width: number;
    length: number;
    depth: number;
    baseWidth: number;
    baseLength: number;
    spacing: number;
  };
  
  loads?: {
    deadLoad: number;
    liveLoad: number;
    hydrostaticForce: number;
    dragForce: number;
    totalHorizontalForce: number;
    buoyancy: number;
  };
  
  reinforcement?: {
    mainSteel: SteelDetails;
    linkSteel: SteelDetails;
    flaredBase: SteelDetails;
  };
  
  footing?: {
    length: number;
    width: number;
    thickness: number;
    reinforcement: SteelDetails;
    basePressure: {
      max: number;
      min: number;
      distribution: number[];
    };
  };
  
  pierCap?: {
    length: number;
    width: number;
    thickness: number;
    reinforcement: SteelDetails;
  };
}

// ==================== ABUTMENT DESIGN RESULTS ====================

export interface AbutmentDesignResult {
  // Geometry
  height: number;
  width: number;
  depth: number;
  baseWidth: number;
  baseLength: number;
  wingWallHeight: number;
  wingWallThickness: number;
  
  // Concrete Volumes
  abutmentConcrete: number;
  baseConcrete: number;
  wingWallConcrete: number;
  
  // Forces
  activeEarthPressure: number;
  verticalLoad: number;
  
  // Stability (Overall)
  slidingFOS: number;
  overturningFOS: number;
  bearingFOS: number;
  
  // Detailed Analysis (from current app)
  loadCases: DetailedLoadCase[];        // 155 load cases
  stressDistribution: StressPoint[];    // 153 stress points
  
  // Optional detailed components (from reference app)
  geometry?: {
    height: number;
    width: number;
    depth: number;
    baseWidth: number;
    baseLength: number;
    dirtWallHeight: number;
    returnWallLength: number;
  };
  
  earthPressure?: {
    ka: number;                 // Active earth pressure coefficient
    pa: number;                 // Total active earth pressure (kN)
    location: number;           // Distance from base (m)
  };
  
  loads?: {
    deadLoad: number;
    liveLoad: number;
    earthPressure: number;
    soilSurcharge: number;
    waterPressure: number;
  };
  
  reinforcement?: {
    abutmentBody: SteelDetails;
    dirtWall: SteelDetails;
    returnWall: SteelDetails;
    footing: SteelDetails;
    abutmentCap: SteelDetails;
  };
}

// ==================== SLAB DESIGN RESULTS ====================

export interface SlabDesignResult {
  thickness: number;
  slabConcrete: number;
  mainSteelMain: number;
  mainSteelDistribution: number;
  stressDistribution: StressPoint[];    // 34 stress points
}

// ==================== QUANTITIES ====================

export interface QuantitiesResult {
  totalConcrete: number;        // m³
  totalSteel: number;           // tonnes
  formwork: number;             // m²
}

// ==================== ESTIMATION RESULTS ====================

export interface EstimationResult {
  // Quantities
  quantities: {
    concrete: {
      m25?: number;             // m³
      m30?: number;             // m³
      m35?: number;             // m³
      total: number;            // m³
    };
    steel: {
      fe415?: number;           // MT
      fe500?: number;           // MT
      total: number;            // MT
    };
    formwork: number;           // m²
    excavation?: {
      ordinary: number;         // m³
      hardRock: number;         // m³
      total: number;            // m³
    };
    backfill?: number;          // m³
  };
  
  // Bill of Quantities
  boq?: BOQItem[];
  
  // Cost Summary
  cost?: {
    subtotal: number;           // ₹
    gst: number;                // ₹
    total: number;              // ₹
    ratePerMeter: number;       // ₹/m
  };
}

export interface BOQItem {
  itemNo: string;
  description: string;
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
}

// ==================== COMPLETE DESIGN OUTPUT ====================

export interface DesignOutput {
  projectInfo: {
    span: number;
    width: number;
    discharge: number;
    floodLevel: number;
    bedLevel: number;
    flowDepth: number;
  };

  hydraulics: HydraulicsResult;
  pier: PierDesignResult;
  abutment: AbutmentDesignResult;
  slab: SlabDesignResult;
  quantities: QuantitiesResult;
}

// Alternative complete design result (reference app style)
export interface CompleteDesignResult {
  input: ProjectInput;
  hydraulics: HydraulicsResult;
  pier: PierDesignResult;
  abutmentType1: AbutmentDesignResult;
  abutmentC1?: AbutmentDesignResult;
  estimation?: EstimationResult;
}

// ==================== ENHANCED INPUT ====================

// Enhanced input with calculated results (for Excel generation)
export interface EnhancedProjectInput extends ProjectInput {
  hydraulics?: HydraulicsResult;
  pier?: PierDesignResult;
  abutmentType1?: AbutmentDesignResult;
  abutmentC1?: AbutmentDesignResult;
  slab?: SlabDesignResult;
  pierDesign?: {
    spanCC?: number;
  };
}

// ==================== COMPATIBILITY ALIASES ====================

// Aliases for backward compatibility with current app
export type DesignInput = ProjectInput;

// ==================== EXPORTS ====================

// All types are already exported with 'export interface' above
// No need for additional export statements
