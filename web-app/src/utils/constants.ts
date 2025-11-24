/**
 * Bridge Design System - Constants & Configuration
 * IRC:6-2016 & IRC:112-2015 Standards
 */

// ============================================
// DESIGN STANDARDS
// ============================================

export const STANDARDS = {
  IRC_6_2016: 'IRC:6-2016',
  IRC_112_2015: 'IRC:112-2015',
  IS_456_2000: 'IS 456:2000',
  IS_1893_2016: 'IS 1893:2016'
};

// ============================================
// FACTORS OF SAFETY (FOS)
// ============================================

export const FACTORS_OF_SAFETY = {
  SLIDING_MIN: 1.5,          // Minimum FOS for sliding stability
  OVERTURNING_MIN: 2.0,      // Minimum FOS for overturning
  BEARING_MIN: 3.0,          // Minimum FOS for bearing capacity
  UPLIFT_MIN: 1.5,           // Minimum FOS for uplift
};

// ============================================
// MATERIAL PROPERTIES
// ============================================

export const CONCRETE_GRADES = {
  M15: 15,   // N/mm²
  M20: 20,
  M25: 25,
  M30: 30,
  M35: 35,
  M40: 40,
  M45: 45,
  M50: 50,
};

export const STEEL_GRADES = {
  Fe250: 250,  // N/mm²
  Fe415: 415,
  Fe500: 500,
  Fe550: 550,
};

export const CONCRETE_DENSITY = 2500; // kg/m³
export const STEEL_DENSITY = 7850;    // kg/m³

// ============================================
// HYDRAULIC CONSTANTS
// ============================================

export const HYDRAULIC_CONSTANTS = {
  GRAVITY: 9.81,                    // m/s²
  WATER_DENSITY: 1000,              // kg/m³
  MANNING_N: 0.035,                 // Coefficient for natural channels
  LACEY_SILT_FACTOR_RANGE: [0.4, 2.0], // m^(1/2)
};

// ============================================
// LOAD FACTORS (IRC:6-2016)
// ============================================

export const LOAD_FACTORS = {
  DEAD_LOAD: 1.5,
  LIVE_LOAD: 1.75,
  WIND_LOAD: 1.2,
  SEISMIC_LOAD: 1.0,
  TEMPERATURE_LOAD: 1.0,
};

// ============================================
// DEFLECTION LIMITS
// ============================================

export const DEFLECTION_LIMITS = {
  SIMPLY_SUPPORTED: 1/250,  // L/250
  CANTILEVER: 1/125,        // L/125
  SETTLEMENT_MAX: 50,       // mm
};

// ============================================
// SPACING REQUIREMENTS
// ============================================

export const SPACING_REQUIREMENTS = {
  MIN_BAR_SPACING: 75,      // mm
  MAX_BAR_SPACING_TEMP: 300, // mm for temperature reinforcement
  MIN_STIRRUP_SPACING: 300,  // mm
  MAX_STIRRUP_SPACING: 400,  // mm
};

// ============================================
// COVER REQUIREMENTS (mm)
// ============================================

export const CONCRETE_COVER = {
  MAIN_REINFORCEMENT: 50,
  STIRRUPS: 40,
  EXPOSURE_MODERATE: 50,
  EXPOSURE_SEVERE: 75,
};

// ============================================
// EARTH PRESSURE ANGLES (degrees)
// ============================================

export const EARTH_PRESSURE = {
  FRICTION_ANGLE_MIN: 30,
  FRICTION_ANGLE_MAX: 40,
  DENSITY_SOIL: 18,         // kN/m³
  DENSITY_SATURATED: 20,    // kN/m³
};

// ============================================
// UNIT CONVERSIONS
// ============================================

export const UNITS = {
  KPA_TO_MPA: 1 / 1000,
  MPA_TO_N_MM2: 1,
  KN_TO_N: 1000,
  M3_TO_CM3: 1000000,
};

// ============================================
// STATUS COLORS
// ============================================

export const STATUS_COLORS = {
  SAFE: '#10b981',           // Green
  WARNING: '#f59e0b',        // Amber
  CRITICAL: '#ef4444',       // Red
  COMPLIANT: '#10b981',
  REVIEW_REQUIRED: '#f59e0b',
  NON_COMPLIANT: '#ef4444',
};

// ============================================
// SHEET CATEGORIES
// ============================================

export const SHEET_CATEGORIES = {
  INPUT: 'INPUT',
  HYDRAULIC: 'HYDRAULIC',
  PIER: 'PIER',
  ABUTMENT: 'ABUTMENT',
  SLAB: 'SLAB',
  FOOTING: 'FOOTING',
  STEEL: 'STEEL',
  LOAD_CASES: 'LOAD_CASES',
  BOQ: 'BILL_OF_QUANTITIES',
  DOCUMENTATION: 'DOCUMENTATION',
};

// ============================================
// DEFAULT VALUES
// ============================================

export const DEFAULT_VALUES = {
  span: 10.0,
  width: 94.8,
  discharge: 902.15,
  floodLevel: 100.6,
  bedLevel: 96.6,
  fck: 30,
  fy: 500,
  soilBearingCapacity: 150,
  bedSlope: 0.001041667,
  numberOfLanes: 2,
};

// ============================================
// IRC:6-2016 VEHICLE LOADS
// ============================================

export const VEHICLE_LOADS = {
  CLASS_70R: {
    name: 'Class 70 Tracked Vehicle',
    wheelLoad: 70,  // kN per wheel
    contactArea: 0.9, // m²
    wheelSpacing: 4.0, // m
  },
  CLASS_40: {
    name: 'Class 40 Wheel',
    wheelLoad: 40,
    contactArea: 0.4,
    wheelSpacing: 3.5,
  },
};

// ============================================
// LOAD CASE DEFINITIONS
// ============================================

export const LOAD_CASES_DEFINITIONS = [
  {
    number: 1,
    description: 'Dead Load + Class 70R + Normal Temperature',
    dlFactor: 1.5,
    llFactor: 1.75,
    windFactor: 0,
    seismicFactor: 0,
    tempFactor: 0,
  },
  {
    number: 2,
    description: 'Dead Load + Class 70R + Maximum Temperature',
    dlFactor: 1.5,
    llFactor: 1.75,
    windFactor: 0,
    seismicFactor: 0,
    tempFactor: 1.0,
  },
  {
    number: 3,
    description: 'Dead Load + Seismic (EQ 0.1g)',
    dlFactor: 1.0,
    llFactor: 0,
    windFactor: 0,
    seismicFactor: 0.1,
    tempFactor: 0,
  },
];
