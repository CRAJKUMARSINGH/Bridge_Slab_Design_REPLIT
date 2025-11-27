/**
 * TEST FILE FOR TYPE DEFINITIONS
 * Verifies that all types compile correctly
 */

import {
  ProjectInput,
  DesignInput,
  HydraulicsResult,
  PierDesignResult,
  AbutmentDesignResult,
  SlabDesignResult,
  DesignOutput,
  CompleteDesignResult,
  DetailedLoadCase,
  StressPoint,
  CrossSectionPoint
} from './types';

// Test ProjectInput
const testInput: ProjectInput = {
  projectName: "Test Bridge",
  location: "Test Location",
  district: "Test District",
  engineer: "Test Engineer",
  
  spanLength: 15,
  numberOfSpans: 1,
  bridgeWidth: 7.5,
  numberOfLanes: 2,
  
  discharge: 500,
  hfl: 100,
  bedLevel: 96.47,
  bedSlope: 500,
  manningN: 0.035,
  laceysSiltFactor: 0.78,
  
  crossSectionData: [
    { chainage: 0, gl: 96.47, width: 7.5 },
    { chainage: 15, gl: 96.47, width: 7.5 }
  ],
  
  numberOfPiers: 3,
  pierWidth: 1.2,
  pierLength: 7.5,
  pierDepth: 5.96,
  pierBaseWidth: 3.0,
  pierBaseLength: 11.25,
  
  abutmentHeight: 8.2,
  abutmentWidth: 3.5,
  abutmentDepth: 2.5,
  dirtWallHeight: 3.0,
  returnWallLength: 5.0,
  
  fck: 30,
  fy: 500,
  
  sbc: 200,
  phi: 30,
  gamma: 18,
  
  loadClass: "Class A"
};

// Test DesignInput (alias)
const testDesignInput: DesignInput = testInput;

// Test DetailedLoadCase
const testLoadCase: DetailedLoadCase = {
  caseNumber: 1,
  description: "Test Case",
  deadLoadFactor: 1.0,
  liveLoadFactor: 1.0,
  windLoadFactor: 0.0,
  resultantHorizontal: 100,
  resultantVertical: 500,
  slidingFOS: 2.0,
  overturningFOS: 2.5,
  bearingFOS: 3.0,
  status: "SAFE"
};

// Test StressPoint
const testStressPoint: StressPoint = {
  location: "Point 1",
  longitudinalStress: 10.5,
  transverseStress: 8.2,
  shearStress: 3.5,
  combinedStress: 12.8,
  status: "Safe"
};

console.log("✅ All types compiled successfully!");
console.log("Test Input:", testInput.projectName);
console.log("Test Load Case:", testLoadCase.description);
console.log("Test Stress Point:", testStressPoint.location);
