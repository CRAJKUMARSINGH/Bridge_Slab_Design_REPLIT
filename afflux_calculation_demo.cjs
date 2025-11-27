/**
 * Afflux Calculation Demo
 * Demonstrates the engineering calculations for afflux in bridge hydraulics
 */

// Function to calculate afflux using Molesworth formula
function calculateAfflux(V, A, a) {
    // Molesworth Formula for Afflux
    // h = ((V^2/17.85) + 0.0152) * (A^2/a^2 - 1)
    
    const term1 = (V * V) / 17.85;
    const term2 = 0.0152;
    const areaRatio = (A * A) / (a * a);
    const afflux = (term1 + term2) * (areaRatio - 1);
    
    return afflux;
}

// Function to calculate obstructed area
function calculateObstructedArea(deckArea, pierArea, abutmentArea) {
    return deckArea + pierArea + abutmentArea;
}

// Function to calculate flow velocity
function calculateVelocity(discharge, area) {
    return discharge / area;
}

// Sample data from the HTML sheet
const sampleData = {
    project: "DESIGN OF SUBMERSIBLE SKEW BRIDGE ACROSS BEDACH RIVER",
    discharge: 902.15, // Cumecs
    unobstructedArea: 490.30, // m²
    effectiveWaterway: 94.80, // m
    floodLevel: 100.60, // m
    deckLevel: 101.60, // m
    deckThickness: 0.83, // m
    numberOfPiers: 11,
    pierWidth: 1.20, // m
    avgRiverBedLevel: 96.60, // m
};

console.log("=== AFFLUX CALCULATION DEMO ===\n");

console.log("PROJECT INFORMATION:");
console.log(`Project: ${sampleData.project}`);
console.log(`Design Discharge: ${sampleData.discharge} Cumecs`);
console.log(`Highest Flood Level: ${sampleData.floodLevel} m`);
console.log(`Deck Slab Level: ${sampleData.deckLevel} m\n`);

// Step 1: Calculate unobstructed velocity
const unobstructedVelocity = calculateVelocity(sampleData.discharge, sampleData.unobstructedArea);
console.log("STEP 1: UNOBSTRUCTED FLOW CONDITIONS");
console.log(`Unobstructed Area (A): ${sampleData.unobstructedArea} m²`);
console.log(`Unobstructed Velocity (V): ${unobstructedVelocity.toFixed(2)} m/s\n`);

// Step 2: Calculate obstruction areas
console.log("STEP 2: OBSTRUCTION AREA CALCULATIONS");

// Deck slab obstruction
const deckObstructionHeight = sampleData.deckLevel - sampleData.floodLevel;
const deckObstructionArea = sampleData.effectiveWaterway * deckObstructionHeight;
console.log(`Deck Slab Obstruction:`);
console.log(`  - Height: ${deckObstructionHeight.toFixed(2)} m`);
console.log(`  - Area: ${deckObstructionArea.toFixed(2)} m²`);

// Pier obstruction
const pierObstructionHeight = sampleData.floodLevel - sampleData.avgRiverBedLevel;
const singlePierArea = sampleData.pierWidth * pierObstructionHeight;
const totalPierArea = sampleData.numberOfPiers * singlePierArea;
console.log(`Pier Obstruction:`);
console.log(`  - Height: ${pierObstructionHeight.toFixed(2)} m`);
console.log(`  - Single Pier Area: ${singlePierArea.toFixed(2)} m²`);
console.log(`  - Total Pier Area (${sampleData.numberOfPiers} piers): ${totalPierArea.toFixed(2)} m²`);

// Abutment obstruction (simplified calculation)
const abutmentArea = 4.60; // From HTML sheet
console.log(`Abutment Obstruction:`);
console.log(`  - Total Abutment Area: ${abutmentArea.toFixed(2)} m²`);

// Total obstruction
const totalObstruction = calculateObstructedArea(deckObstructionArea, totalPierArea, abutmentArea);
console.log(`\nTotal Obstruction Area: ${totalObstruction.toFixed(2)} m²`);

// Step 3: Calculate actual flow area
const actualFlowArea = sampleData.unobstructedArea - totalObstruction;
console.log(`\nSTEP 3: ACTUAL FLOW CONDITIONS`);
console.log(`Actual Flow Area (a): ${actualFlowArea.toFixed(2)} m²`);

// Step 4: Calculate afflux
const afflux = calculateAfflux(unobstructedVelocity, sampleData.unobstructedArea, actualFlowArea);
console.log(`\nSTEP 4: AFFLUX CALCULATION`);
console.log(`Using Molesworth Formula: h = ((V²/17.85) + 0.0152) × (A²/a² - 1)`);
console.log(`Afflux (h): ${afflux.toFixed(2)} m`);

// Step 5: Calculate afflux flood level
const affluxFloodLevel = sampleData.floodLevel + afflux;
const clearance = sampleData.deckLevel - affluxFloodLevel;
console.log(`\nSTEP 5: DESIGN VERIFICATION`);
console.log(`Afflux Flood Level: ${affluxFloodLevel.toFixed(2)} m`);
console.log(`Deck Slab Level: ${sampleData.deckLevel} m`);
console.log(`Clearance: ${clearance.toFixed(2)} m`);

// Step 6: Calculate obstructed velocity
const obstructedVelocity = sampleData.discharge / actualFlowArea;
console.log(`\nSTEP 6: OBSTRUCTED FLOW CONDITIONS`);
console.log(`Obstructed Velocity: ${obstructedVelocity.toFixed(2)} m/s`);

// Final assessment
console.log(`\n=== ENGINEERING ASSESSMENT ===`);
if (clearance > 0.5) {
    console.log("✅ DESIGN VERIFICATION: PASS");
    console.log("   Adequate clearance between deck and afflux level");
} else {
    console.log("❌ DESIGN VERIFICATION: FAIL");
    console.log("   Insufficient clearance - consider raising deck level");
}

if (afflux < 0.5) {
    console.log("✅ HYDRAULIC PERFORMANCE: GOOD");
    console.log("   Afflux is within acceptable limits (< 0.5m)");
} else {
    console.log("⚠️  HYDRAULIC PERFORMANCE: CAUTION");
    console.log("   High afflux - consider increasing waterway");
}

if (obstructedVelocity < 3.0) {
    console.log("✅ FLOW CONDITIONS: SAFE");
    console.log("   Velocity within safe limits (< 3.0 m/s)");
} else {
    console.log("⚠️  FLOW CONDITIONS: HIGH VELOCITY");
    console.log("   High velocity - potential for erosion");
}

console.log(`\n=== SUMMARY ===`);
console.log(`• Afflux Height: ${afflux.toFixed(2)} m`);
console.log(`• Afflux Flood Level: ${affluxFloodLevel.toFixed(2)} m`);
console.log(`• Deck Clearance: ${clearance.toFixed(2)} m`);
console.log(`• Obstructed Velocity: ${obstructedVelocity.toFixed(2)} m/s`);
console.log(`• Total Obstruction: ${totalObstruction.toFixed(2)} m²`);