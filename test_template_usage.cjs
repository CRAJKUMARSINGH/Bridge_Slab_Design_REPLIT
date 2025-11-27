/**
 * Test Template Usage Instructions
 * 
 * This script provides instructions on how to use the test templates with the app.
 */

console.log("=== TEST TEMPLATES USAGE INSTRUCTIONS ===\n");

console.log("TEMPLATES LOCATION:");
console.log("Root folder contains the following test templates:");
console.log("  - TEMPLATE_1.xls");
console.log("  - TEMPLATE_2.xls");
console.log("  - TEMPLATE_3.xls\n");

console.log("OUTPUT LOCATION:");
console.log("Generated files are saved in the OUTPUT folder with date-time stamps:");
console.log("  - OUTPUT_1_YYYY-MM-DD_HH-MM-SS.xls");
console.log("  - OUTPUT_2_YYYY-MM-DD_HH-MM-SS.xls");
console.log("  - OUTPUT_3_YYYY-MM-DD_HH-MM-SS.xls\n");

console.log("API ENDPOINTS (when app is running):");
console.log("To use templates with the app, use these endpoints:");
console.log("  GET /api/projects/:id/export/excel/1  → Uses TEMPLATE_1.xls");
console.log("  GET /api/projects/:id/export/excel/2  → Uses TEMPLATE_2.xls");
console.log("  GET /api/projects/:id/export/excel/3  → Uses TEMPLATE_3.xls\n");

console.log("GENERATING TIMESTAMPED OUTPUTS:");
console.log("Run this command to generate new timestamped outputs:");
console.log("  node generate_test_outputs.cjs\n");

console.log("FILES GENERATED IN OUTPUT FOLDER:");
console.log("Check the OUTPUT folder for the latest timestamped files.");