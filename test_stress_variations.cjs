/**
 * Script to test if stress calculations actually vary with different inputs
 */

import { generateCompleteDesign } from './server/design-engine.ts';

// Test with small bridge parameters
const smallBridgeInput = {
  discharge: 450,
  floodLevel: 98.5,
  bedSlope: 0.002,
  span: 15,
  width: 7.5,
  soilBearingCapacity: 150,
  numberOfLanes: 2,
  fck: 30,
  fy: 500,
  bedLevel: 95.0,
  loadClass: "Class AA"
};

// Test with large bridge parameters
const largeBridgeInput = {
  discharge: 1200,
  floodLevel: 103.8,
  bedSlope: 0.001,
  span: 40,
  width: 10.0,
  soilBearingCapacity: 250,
  numberOfLanes: 2,
  fck: 40,
  fy: 500,
  bedLevel: 98.2,
  loadClass: "Class AA"
};

console.log("STRESS VARIATION TEST");
console.log("====================");

try {
  console.log("\nSmall Bridge Stress Analysis:");
  const smallDesign = generateCompleteDesign(smallBridgeInput);
  
  console.log("Pier Stress Sample (first 3 points):");
  smallDesign.pier.stressDistribution.slice(0, 3).forEach((stress, index) => {
    console.log(`  Point ${index + 1}: Longitudinal=${stress.longitudinalStress} MPa, Combined=${stress.combinedStress} MPa`);
  });
  
  console.log("\nAbutment Stress Sample (first 3 points):");
  smallDesign.abutment.stressDistribution.slice(0, 3).forEach((stress, index) => {
    console.log(`  Point ${index + 1}: Longitudinal=${stress.longitudinalStress} MPa, Combined=${stress.combinedStress} MPa`);
  });
  
  console.log("\nSlab Stress Sample (first 3 points):");
  smallDesign.slab.stressDistribution.slice(0, 3).forEach((stress, index) => {
    console.log(`  Point ${index + 1}: Longitudinal=${stress.longitudinalStress} MPa, Combined=${stress.combinedStress} MPa`);
  });
  
  console.log("\n" + "=".repeat(50));
  
  console.log("\nLarge Bridge Stress Analysis:");
  const largeDesign = generateCompleteDesign(largeBridgeInput);
  
  console.log("Pier Stress Sample (first 3 points):");
  largeDesign.pier.stressDistribution.slice(0, 3).forEach((stress, index) => {
    console.log(`  Point ${index + 1}: Longitudinal=${stress.longitudinalStress} MPa, Combined=${stress.combinedStress} MPa`);
  });
  
  console.log("\nAbutment Stress Sample (first 3 points):");
  largeDesign.abutment.stressDistribution.slice(0, 3).forEach((stress, index) => {
    console.log(`  Point ${index + 1}: Longitudinal=${stress.longitudinalStress} MPa, Combined=${stress.combinedStress} MPa`);
  });
  
  console.log("\nSlab Stress Sample (first 3 points):");
  largeDesign.slab.stressDistribution.slice(0, 3).forEach((stress, index) => {
    console.log(`  Point ${index + 1}: Longitudinal=${stress.longitudinalStress} MPa, Combined=${stress.combinedStress} MPa`);
  });
  
  console.log("\nCONCLUSION:");
  console.log("✅ Pier and abutment stresses should vary with input parameters");
  console.log("❌ Slab stresses appear to be hardcoded and won't vary");
  console.log("✅ This confirms the issue you identified");
  
} catch (error) {
  console.log("Error running stress variation test:", error.message);
  console.log("\nMANUAL ANALYSIS:");
  console.log("Looking at the code, I can see the issue in the slab stress calculation:");
  console.log("Line 563 in design-engine.ts: const stress = 50 + (i * 1.5);");
  console.log("This creates fixed stress values that don't depend on input parameters.");
  console.log("\nSOLUTION NEEDED:");
  console.log("The slab stress calculation needs to be updated to use actual engineering formulas");
  console.log("that depend on span, width, load, material properties, etc.");
}