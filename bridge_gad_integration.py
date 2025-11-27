#!/usr/bin/env python3
"""
Bridge Design System + Bridge GAD Generator Integration
This script integrates our bridge design calculations with the Bridge GAD generator
to create professional general arrangement drawings.
"""

import sys
import os
from pathlib import Path
import json
import pandas as pd
import numpy as np

# Add the Bridge GAD directory to path
bridge_gad_path = Path(__file__).parent / "Bridge_GAD_Yogendra_Borse"
sys.path.append(str(bridge_gad_path))
sys.path.append(str(bridge_gad_path / "src"))

def create_bridge_parameters_from_design(design_data, output_file):
    """
    Create bridge parameters Excel file from our design data
    
    Args:
        design_data: Dictionary containing bridge design parameters
        output_file: Path to output Excel file
    """
    # Extract key parameters from design data
    span = design_data.get('projectInfo', {}).get('span', 20.0)
    width = design_data.get('projectInfo', {}).get('width', 7.5)
    flood_level = design_data.get('projectInfo', {}).get('floodLevel', 100.0)
    bed_level = design_data.get('projectInfo', {}).get('bedLevel', 95.0)
    
    # Bridge GAD parameters
    params = {
        'scale1': 100.0,  # Plan/elevation scale
        'scale2': 50.0,   # Sections scale
        'skew': 0.0,      # Skew angle in degrees
        'datum': bed_level,  # Datum level
        'toprl': flood_level + 2.0,  # Top RL
        'left': 0.0,      # Left chainage
        'right': span,    # Right chainage
        'xincr': span/4,  # X increment
        'yincr': 1.0,     # Y increment
        'noch': 5,        # Number of chainages
        'nspan': 1,       # Number of spans
        'lbridge': span,  # Bridge length
        'abtl': 0.0,      # Abutment left
        'RTL': flood_level + 1.0,  # Right top level
        'Sofl': flood_level - 0.5, # Scour level
        'kerbw': 0.3,     # Kerb width
        'kerbd': 0.2,     # Kerb depth
        'ccbr': width,    # Carriageway width
        'slbthc': 0.25,   # Slab thickness (center)
        'slbthe': 0.2,    # Slab thickness (ends)
        'slbtht': 0.15,   # Slab thickness (top)
        'capt': flood_level + 0.5,  # Cap top
        'capb': flood_level,        # Cap bottom
        'capw': 1.2,      # Cap width
        'piertw': 1.5,    # Pier top width
        'battr': 12.0,    # Abutment thickness
        'pierst': 8.0,    # Pier stem thickness
        'piern': 1,       # Number of piers
        'span1': span,    # Span 1
        'futrl': bed_level - 1.0,   # Foundation top RL
        'futd': 1.5,      # Foundation depth
        'futw': 3.0,      # Foundation width
        'futl': 6.0,      # Foundation length
        'dwth': 0.3,      # Wearing coat thickness
        'alcw': 1.2,      # Approach slab width
        'alcd': 0.8,      # Approach slab depth
        'alfb': 10.0,     # Approach slab front breadth
        'alfbl': flood_level - 0.2,  # Approach slab front bottom level
        'altb': 10.0,     # Approach slab top breadth
        'altbl': flood_level - 0.3,  # Approach slab top bottom level
        'alfo': 0.5,      # Approach slab front overhang
        'alfd': 1.2,      # Approach slab front depth
        'albb': 8.0,      # Approach slab back breadth
        'albbl': flood_level - 0.1,  # Approach slab back bottom level
        # Additional parameters for right abutment
        'alfbr': flood_level - 0.2,   # Right approach slab front bottom level
        'altbr': flood_level - 0.3,   # Right approach slab top bottom level
        'albbr': flood_level - 0.1,   # Right approach slab back bottom level
        'arfl': bed_level - 1.0       # Right foundation level
    }
    
    # Create DataFrame
    df = pd.DataFrame(list(params.items()), columns=['Parameter', 'Value'])
    df['Description'] = ''  # Add empty description column
    
    # Save to Excel
    df.to_excel(output_file, index=False)
    print(f"✅ Bridge parameters saved to {output_file}")
    
    return params

def generate_bridge_gad_from_design(design_data, output_dir="bridge_gad_output"):
    """
    Generate Bridge GAD from our design data
    
    Args:
        design_data: Dictionary containing bridge design parameters
        output_dir: Directory to save output files
    """
    # Create output directory
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)
    
    # Create parameters file
    params_file = output_path / "bridge_parameters.xlsx"
    create_bridge_parameters_from_design(design_data, params_file)
    
    print("✅ Bridge parameters created successfully")
    print("ℹ️  To generate the Bridge GAD drawing, run:")
    print(f"   cd {bridge_gad_path}")
    print(f"   python -m bridge_gad generate {params_file} --output {output_path / 'bridge_gad.dxf'}")
    print("   or use the web API by running:")
    print(f"   python -m bridge_gad serve")
    
    return str(params_file)

def main():
    """Main function to demonstrate integration"""
    print("🌉 Bridge Design System + Bridge GAD Generator Integration")
    print("=" * 60)
    
    # Example design data (this would come from our design engine)
    example_design = {
        "projectInfo": {
            "span": 25.0,
            "width": 8.5,
            "discharge": 800,
            "floodLevel": 102.5,
            "bedLevel": 97.0,
            "flowDepth": 5.5
        },
        "hydraulics": {
            "afflux": 0.3,
            "designWaterLevel": 102.8,
            "velocity": 2.1
        },
        "pier": {
            "width": 1.5,
            "length": 8.5,
            "numberOfPiers": 2,
            "depth": 8.0
        },
        "abutment": {
            "height": 9.5,
            "width": 3.0,
            "depth": 2.8
        }
    }
    
    print("🔧 Generating Bridge GAD from example design...")
    params_file = generate_bridge_gad_from_design(example_design)
    
    print("\n✅ Integration complete!")
    print(f"📁 Parameters file: {params_file}")
    print("🚀 You can now generate professional bridge drawings using the Bridge GAD generator")

if __name__ == "__main__":
    main()