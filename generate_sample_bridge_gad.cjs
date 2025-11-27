/**
 * Script to generate Bridge GAD drawings for sample input files
 * Processes three sample inputs and saves timestamped outputs
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Get current timestamp for file naming
function getTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

// Sample input files to process
const sampleInputs = [
    'bridge_parameters_simple.xlsx',
    'bridge_parameters_comprehensive.xlsx',
    'sample_BridgeGAD-00.xlsx'
];

// Output formats to generate
const outputFormats = ['pdf', 'png']; // Changed from 'dxf' to more accessible formats

/**
 * Generate Bridge GAD drawing for a specific input file
 * @param {string} inputFile - Path to input Excel file
 * @param {string} outputFile - Path to output file (without extension)
 * @param {string} format - Output format (pdf, png, dxf, etc.)
 * @returns {Promise} Promise that resolves when generation is complete
 */
function generateBridgeGAD(inputFile, outputFile, format) {
    return new Promise((resolve, reject) => {
        // Path to the Bridge GAD generator
        const bridgeGADPath = path.join(__dirname, 'Bridge_GAD_Yogendra_Borse');
        const pythonModule = '-m';
        const bridgeGADModule = 'bridge_gad';
        const commandArgs = ['generate', inputFile, '--output', `${outputFile}.${format}`, '--formats', format];
        
        console.log(`🔧 Generating Bridge GAD drawing (${format.toUpperCase()})...`);
        console.log(`   Input: ${inputFile}`);
        console.log(`   Output: ${outputFile}.${format}`);
        
        // Spawn the Python process
        const pythonProcess = spawn('python', [pythonModule, bridgeGADModule, ...commandArgs], {
            cwd: bridgeGADPath,
            stdio: ['pipe', 'pipe', 'pipe'],
            encoding: 'utf8'
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
            const fullOutputPath = `${outputFile}.${format}`;
            // Even if there's an encoding error, check if the file was created
            if (code === 0 || fs.existsSync(fullOutputPath)) {
                console.log(`✅ Bridge GAD drawing (${format.toUpperCase()}) generated successfully`);
                resolve(fullOutputPath);
            } else {
                console.error(`❌ Error generating Bridge GAD drawing (${format.toUpperCase()})`);
                console.error(`Exit code: ${code}`);
                // Filter out encoding errors from stderr
                const cleanStderr = stderr.replace(/Error: 'charmap' codec can't encode character.*character maps to <undefined>/g, '');
                if (cleanStderr.trim()) {
                    console.error(`Stderr: ${cleanStderr}`);
                }
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
 * Process all sample input files
 */
async function processAllSamples() {
    console.log("🌉 Bridge GAD Sample Generation");
    console.log("=".repeat(40));
    
    const timestamp = getTimestamp();
    const outputDir = path.join(__dirname, 'OUTPUT');
    const inputDir = path.join(__dirname, 'Bridge_GAD_Yogendra_Borse', 'SAMPLE_INPUT_FILES');
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    let successCount = 0;
    const generatedFiles = [];
    
    // Process each sample input
    for (let i = 0; i < sampleInputs.length; i++) {
        const inputFilename = sampleInputs[i];
        const inputFile = path.join(inputDir, inputFilename);
        
        // Check if input file exists
        if (!fs.existsSync(inputFile)) {
            console.log(`⚠️  Skipping ${inputFilename} - file not found`);
            continue;
        }
        
        console.log(`\n📄 Processing sample ${i + 1}/${sampleInputs.length}: ${inputFilename}`);
        
        // Generate each format for this input
        for (const format of outputFormats) {
            try {
                // Create timestamped output filename (without extension)
                const outputFilenameBase = `BRIDGE_GAD_${i + 1}_${format.toUpperCase()}_${timestamp}`;
                const outputFileBase = path.join(outputDir, outputFilenameBase);
                
                // Generate the Bridge GAD drawing
                const generatedFile = await generateBridgeGAD(inputFile, outputFileBase, format);
                
                console.log(`📁 Output saved as: ${path.basename(generatedFile)}`);
                generatedFiles.push(path.basename(generatedFile));
                successCount++;
                
            } catch (error) {
                console.error(`❌ Failed to process ${inputFilename} as ${format.toUpperCase()}:`, error.message);
            }
        }
    }
    
    console.log(`\n🏁 Generation Complete`);
    console.log(`✅ Successfully generated ${successCount} drawings (${outputFormats.join(', ')})`);
    console.log(`📁 All outputs saved in: ${outputDir}`);
    
    if (generatedFiles.length > 0) {
        console.log(`\n📋 Generated files:`);
        generatedFiles.forEach(file => console.log(`   - ${file}`));
    }
}

// Run the sample processing if this script is executed directly
if (require.main === module) {
    processAllSamples().catch(error => {
        console.error("❌ Fatal error:", error.message);
        process.exit(1);
    });
}

module.exports = {
    processAllSamples,
    generateBridgeGAD
};