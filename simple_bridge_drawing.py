#!/usr/bin/env python3
"""
Simple Bridge Drawing Generator
Creates basic PDF/PNG drawings from sample bridge parameters
"""

import sys
import os
from pathlib import Path

# Add the Bridge GAD directory to path
bridge_gad_path = Path(__file__).parent / "Bridge_GAD_Yogendra_Borse"
sys.path.append(str(bridge_gad_path))
sys.path.append(str(bridge_gad_path / "src"))

def main():
    print("🏗️  Simple Bridge Drawing Generator")
    print("=" * 40)
    
    try:
        # Import the bridge GAD components
        from src.bridge_gad.bridge_generator import BridgeGADGenerator
        from src.bridge_gad.output_formats import MultiFormatExporter
        
        # Use one of the sample files
        sample_file = bridge_gad_path / "SAMPLE_INPUT_FILES" / "bridge_parameters_simple.xlsx"
        if not sample_file.exists():
            print(f"❌ Sample file not found: {sample_file}")
            return 1
            
        print(f"📄 Using sample file: {sample_file.name}")
        
        # Create output directory
        output_dir = Path(__file__).parent / "OUTPUT"
        output_dir.mkdir(exist_ok=True)
        
        # Generate bridge drawing
        print("🔧 Generating bridge drawing...")
        generator = BridgeGADGenerator()
        
        # Setup document
        generator.setup_document()
        
        # Read variables from Excel
        if not generator.read_variables_from_excel(sample_file):
            print("❌ Failed to read Excel parameters")
            return 1
            
        print("✅ Parameters loaded successfully")
        
        # Generate the drawing components
        generator.draw_layout_and_axes()
        generator.draw_bridge_superstructure()
        generator.draw_piers_elevation()
        generator.draw_abutments()
        generator.draw_plan_view()
        generator.add_dimensions_and_labels()
        
        print("✅ Drawing components generated")
        
        # Export as PDF
        pdf_output = output_dir / "simple_bridge_drawing.pdf"
        print(f"📄 Exporting to PDF: {pdf_output.name}")
        
        exporter = MultiFormatExporter(generator)
        exporter.export(pdf_output, 'pdf')
        
        print("✅ PDF generated successfully!")
        
        # Export as PNG
        png_output = output_dir / "simple_bridge_drawing.png"
        print(f"🖼️  Exporting to PNG: {png_output.name}")
        
        exporter.export(png_output, 'png')
        
        print("✅ PNG generated successfully!")
        
        print("\n🎉 Generation Complete!")
        print(f"📁 PDF saved to: {pdf_output}")
        print(f"📁 PNG saved to: {png_output}")
        
        return 0
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    sys.exit(main())