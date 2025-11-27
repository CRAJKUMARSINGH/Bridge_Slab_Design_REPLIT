/**
 * Node.js script to generate Bridge GAD drawings from our design data
 * This script integrates our TypeScript design engine with the Python Bridge GAD generator
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

/**
 * Convert design data to Bridge GAD parameters format
 * @param {Object} designData - The design data from our engine
 * @param {string} outputPath - Path to save the parameters file
 */
function createBridgeGADParameters(designData, outputPath) {
    // Extract key parameters from design data
    const span = designData.projectInfo?.span || 20.0;
    const width = designData.projectInfo?.width || 7.5;
    const floodLevel = designData.projectInfo?.floodLevel || 100.0;
    const bedLevel = designData.projectInfo?.bedLevel || 95.0;
    
    // Create parameters object for Bridge GAD
    const params = {
        scale1: 100.0,    // Plan/elevation scale
        scale2: 50.0,     // Sections scale
        skew: 0.0,        // Skew angle in degrees
        datum: bedLevel,  // Datum level
        toprl: floodLevel + 2.0,  // Top RL
        left: 0.0,        // Left chainage
        right: span,      // Right chainage
        xincr: span/4,    // X increment
        yincr: 1.0,       // Y increment
        noch: 5,          // Number of chainages
        nspan: 1,         // Number of spans
        lbridge: span,    // Bridge length
        abtl: 0.0,        // Abutment left
        RTL: floodLevel + 1.0,    // Right top level
        Sofl: floodLevel - 0.5,   // Scour level
        kerbw: 0.3,       // Kerb width
        kerbd: 0.2,       // Kerb depth
        ccbr: width,      // Carriageway width
        slbthc: 0.25,     // Slab thickness (center)
        slbthe: 0.2,      // Slab thickness (ends)
        slbtht: 0.15,     // Slab thickness (top)
        capt: floodLevel + 0.5,   // Cap top
        capb: floodLevel,         // Cap bottom
        capw: 1.2,        // Cap width
        pietw: 1.5,       // Pier top width
        battr: 12.0,      // Abutment thickness
        pierst: 8.0,      // Pier stem thickness
        piern: 1,         // Number of piers
        span1: span,      // Span 1
        futrl: bedLevel - 1.0,    // Foundation top RL
        futd: 1.5,        // Foundation depth
        futw: 3.0,        // Foundation width
        futl: 6.0,        // Foundation length
        dwth: 0.3,        // Wearing coat thickness
        alcw: 1.2,        // Approach slab width
        alcd: 0.8,        // Approach slab depth
        alfb: 10.0,       // Approach slab front breadth
        alfbl: floodLevel - 0.2,  // Approach slab front bottom level
        altb: 10.0,       // Approach slab top breadth
        altbl: floodLevel - 0.3,  // Approach slab top bottom level
        alfo: 0.5,        // Approach slab front overhang
        alfd: 1.2,        // Approach slab front depth
        albb: 8.0,        // Approach slab back breadth
        albbl: floodLevel - 0.1,  // Approach slab back bottom level
        // Additional parameters for right abutment
        alfbr: floodLevel - 0.2,   // Right approach slab front bottom level
        altbr: floodLevel - 0.3,   // Right approach slab top bottom level
        albbr: floodLevel - 0.1,   // Right approach slab back bottom level
        arfl: bedLevel - 1.0       // Right foundation level
    };
    
    // Convert to CSV format (as expected by Bridge GAD)
    let csvContent = "Parameter,Value,Description\n";
    for (const [key, value] of Object.entries(params)) {
        csvContent += `${key},${value},\n`;
    }
    
    // Write to file
    fs.writeFileSync(outputPath, csvContent);
    console.log(`✅ Bridge GAD parameters saved to ${outputPath}`);
    
    return params;
}

/**
 * Generate Bridge GAD drawing using the Python generator
 * @param {string} paramsFile - Path to parameters file
 * @param {string} outputFile - Path to output drawing file
 * @returns {Promise} Promise that resolves when generation is complete
 */
function generateBridgeGAD(paramsFile, outputFile) {
    return new Promise((resolve, reject) => {
        // Path to the Bridge GAD generator
        const bridgeGADPath = path.join(__dirname, 'Bridge_GAD_Yogendra_Borse');
        const pythonScript = path.join(bridgeGADPath, 'simple_bridge_app.py');
        
        // Command to run the generator
        const command = 'python';
        const args = [pythonScript, paramsFile, outputFile];
        
        console.log(`🔧 Generating Bridge GAD drawing...`);
        console.log(`   Parameters: ${paramsFile}`);
        console.log(`   Output: ${outputFile}`);
        
        // Spawn the Python process
        const pythonProcess = spawn(command, args, {
            cwd: bridgeGADPath
        });
        
        let stdout = '';
        let stderr = '';
        
        pythonProcess.stdout.on('data', (data) => {
            stdout += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });
        
        pythonProcess.on('close', (code) => {
            if (code === 0) {
                console.log('✅ Bridge GAD drawing generated successfully');
                resolve(outputFile);
            } else {
                console.error('❌ Error generating Bridge GAD drawing');
                console.error(`Exit code: ${code}`);
                console.error(`Stderr: ${stderr}`);
                reject(new Error(`Bridge GAD generation failed with exit code ${code}`));
            }
        });
        
        pythonProcess.on('error', (error) => {
            console.error('❌ Failed to start Python process:', error);
            reject(error);
        });
    });
}

/**
 * Main function to demonstrate the integration
 */
async function main() {
    console.log("🌉 Bridge Design System + Bridge GAD Generator Integration");
    console.log("=".repeat(60));
    
    // Example design data (this would come from our design engine)
    const exampleDesign = {
        projectInfo: {
            span: 25.0,
            width: 8.5,
            discharge: 800,
            floodLevel: 102.5,
            bedLevel: 97.0,
            flowDepth: 5.5
        },
        hydraulics: {
            afflux: 0.3,
            designWaterLevel: 102.8,
            velocity: 2.1
        },
        pier: {
            width: 1.5,
            length: 8.5,
            numberOfPiers: 2,
            depth: 8.0
        },
        abutment: {
            height: 9.5,
            width: 3.0,
            depth: 2.8
        }
    };
    
    try {
        // Create output directory
        const outputDir = path.join(__dirname, 'bridge_gad_output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        // Create parameters file
        const paramsFile = path.join(outputDir, 'bridge_parameters.csv');
        createBridgeGADParameters(exampleDesign, paramsFile);
        
        // Generate Bridge GAD drawing
        const outputFile = path.join(outputDir, 'bridge_gad.dxf');
        await generateBridgeGAD(paramsFile, outputFile);
        
        console.log("\n🎉 Integration complete!");
        console.log(`📁 Parameters file: ${paramsFile}`);
        console.log(`📁 Bridge GAD drawing: ${outputFile}`);
        console.log("📐 You now have a professional bridge drawing generated from your design data!");
        
    } catch (error) {
        console.error("❌ Integration failed:", error.message);
        process.exit(1);
    }
}

// Run the main function if this script is executed directly
if (require.main === module) {
    main();
}

module.exports = {
    createBridgeGADParameters,
    generateBridgeGAD
};