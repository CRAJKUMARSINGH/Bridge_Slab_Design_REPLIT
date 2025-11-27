#!/usr/bin/env python3
"""
Basic Bridge Visualization
Creates simple visual representations of bridge data using basic Python libraries
"""

import json
import csv
from pathlib import Path
import math

def read_bridge_parameters(file_path):
    """Read bridge parameters from CSV file"""
    parameters = {}
    
    try:
        with open(file_path, 'r') as f:
            # Try to detect if it's CSV or just text
            content = f.read().strip()
            
            # If it's a simple key=value format
            if '=' in content and ',' not in content:
                for line in content.split('\n'):
                    if '=' in line:
                        key, value = line.split('=', 1)
                        try:
                            parameters[key.strip()] = float(value.strip())
                        except ValueError:
                            parameters[key.strip()] = value.strip()
            # If it's CSV
            else:
                f.seek(0)
                reader = csv.reader(f)
                header = next(reader)
                
                # Handle different CSV formats
                if 'Parameter' in header:
                    # Format: Parameter,Value,Description
                    for row in reader:
                        if len(row) >= 2:
                            try:
                                parameters[row[0]] = float(row[1])
                            except ValueError:
                                parameters[row[0]] = row[1]
                else:
                    # Simple format: key,value
                    for row in reader:
                        if len(row) >= 2:
                            try:
                                parameters[row[0]] = float(row[1])
                            except ValueError:
                                parameters[row[0]] = row[1]
                                
    except Exception as e:
        print(f"Warning: Could not read parameters file {file_path}: {e}")
        
    return parameters

def create_simple_dxf(parameters, output_file):
    """Create a simple DXF representation of a bridge using basic text format"""
    
    # Get bridge dimensions
    span = parameters.get('span1', parameters.get('lbridge', 20.0))
    width = parameters.get('ccbr', parameters.get('width', 10.0))
    pier_count = int(parameters.get('piern', 1))
    
    # Create DXF content (simplified format)
    dxf_content = """  0
SECTION
  2
HEADER
  9
$ACADVER
  1
AC1009
  0
ENDSEC
  0
SECTION
  2
TABLES
  0
ENDSEC
  0
SECTION
  2
BLOCKS
  0
ENDSEC
  0
SECTION
  2
ENTITIES
"""
    
    # Add bridge deck (rectangle)
    # Bottom line
    dxf_content += f"""  0
LINE
  8
0
 10
0.0
 20
0.0
 11
{span}
 21
0.0
"""
    
    # Top line
    dxf_content += f"""  0
LINE
  8
0
 10
0.0
 20
{width}
 11
{span}
 21
{width}
"""
    
    # Left line
    dxf_content += f"""  0
LINE
  8
0
 10
0.0
 20
0.0
 11
0.0
 21
{width}
"""
    
    # Right line
    dxf_content += f"""  0
LINE
  8
0
 10
{span}
 20
0.0
 11
{span}
 21
{width}
"""
    
    # Add piers
    if pier_count > 0:
        pier_spacing = span / (pier_count + 1)
        pier_width = parameters.get('piertw', 1.0)
        
        for i in range(pier_count):
            pier_x = (i + 1) * pier_spacing
            # Pier rectangle
            dxf_content += f"""  0
LINE
  8
0
 10
{pier_x - pier_width/2}
 20
0.0
 11
{pier_x + pier_width/2}
 21
0.0
"""
            dxf_content += f"""  0
LINE
  8
0
 10
{pier_x + pier_width/2}
 20
0.0
 11
{pier_x + pier_width/2}
 21
{width}
"""
            dxf_content += f"""  0
LINE
  8
0
 10
{pier_x + pier_width/2}
 20
{width}
 11
{pier_x - pier_width/2}
 21
{width}
"""
            dxf_content += f"""  0
LINE
  8
0
 10
{pier_x - pier_width/2}
 20
{width}
 11
{pier_x - pier_width/2}
 21
0.0
"""
    
    # Add abutments
    abutment_width = parameters.get('battr', 2.0)
    
    # Left abutment
    dxf_content += f"""  0
LINE
  8
0
 10
{-abutment_width}
 20
0.0
 11
0.0
 21
0.0
"""
    dxf_content += f"""  0
LINE
  8
0
 10
0.0
 20
0.0
 11
0.0
 21
{width}
"""
    dxf_content += f"""  0
LINE
  8
0
 10
0.0
 20
{width}
 11
{-abutment_width}
 21
{width}
"""
    dxf_content += f"""  0
LINE
  8
0
 10
{-abutment_width}
 20
{width}
 11
{-abutment_width}
 21
0.0
"""
    
    # Right abutment
    dxf_content += f"""  0
LINE
  8
0
 10
{span}
 20
0.0
 11
{span + abutment_width}
 21
0.0
"""
    dxf_content += f"""  0
LINE
  8
0
 10
{span + abutment_width}
 20
0.0
 11
{span + abutment_width}
 21
{width}
"""
    dxf_content += f"""  0
LINE
  8
0
 10
{span + abutment_width}
 20
{width}
 11
{span}
 21
{width}
"""
    dxf_content += f"""  0
LINE
  8
0
 10
{span}
 20
{width}
 11
{span}
 21
0.0
"""
    
    # End entities and file
    dxf_content += """  0
ENDSEC
  0
EOF
"""
    
    # Write DXF file
    with open(output_file, 'w') as f:
        f.write(dxf_content)
    
    print(f"✅ DXF file created: {output_file}")
    return output_file

def create_simple_bridge_svg(parameters, output_file):
    """Create a simple SVG representation of a bridge"""
    
    # Get bridge dimensions
    span = parameters.get('span1', parameters.get('lbridge', 20.0))
    width = parameters.get('ccbr', parameters.get('width', 10.0))
    pier_count = int(parameters.get('piern', 1))
    
    # SVG dimensions
    svg_width = 800
    svg_height = 600
    scale_x = svg_width / (span + 10) if span > 0 else 50
    scale_y = svg_height / (width + 10) if width > 0 else 50
    scale = min(scale_x, scale_y, 20)  # Limit scale for better visualization
    
    # Create SVG content
    svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="{svg_width}" height="{svg_height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .bridge-deck {{ fill: #87CEEB; stroke: #000080; stroke-width: 2; }}
    .pier {{ fill: #696969; stroke: #2F4F4F; stroke-width: 2; }}
    .abutment {{ fill: #A9A9A9; stroke: #2F4F4F; stroke-width: 2; }}
    .text {{ font-family: Arial, sans-serif; font-size: 14px; fill: #000000; }}
    .title {{ font-family: Arial, sans-serif; font-size: 20px; font-weight: bold; fill: #000080; }}
  </style>
  
  <!-- Title -->
  <text x="{svg_width//2}" y="30" text-anchor="middle" class="title">Bridge General Arrangement</text>
  
  <!-- Bridge Deck -->
  <rect x="50" y="200" width="{span * scale}" height="{width * scale}" class="bridge-deck" />
  
  <!-- Piers -->
'''
    
    # Add piers
    if pier_count > 0:
        pier_spacing = span / (pier_count + 1)
        for i in range(pier_count):
            pier_x = 50 + (i + 1) * pier_spacing * scale
            pier_width = parameters.get('piertw', 1.0) * scale
            pier_height = parameters.get('pierst', 8.0) * scale
            
            svg_content += f'  <rect x="{pier_x - pier_width/2}" y="{200 + width * scale}" width="{pier_width}" height="{pier_height}" class="pier" />\n'
    
    # Add abutments
    abutment_width = parameters.get('battr', 2.0) * scale
    abutment_height = parameters.get('pierst', 8.0) * scale
    
    # Left abutment
    svg_content += f'  <rect x="0" y="{200 + width * scale}" width="{abutment_width}" height="{abutment_height}" class="abutment" />\n'
    
    # Right abutment
    svg_content += f'  <rect x="{50 + span * scale}" y="{200 + width * scale}" width="{abutment_width}" height="{abutment_height}" class="abutment" />\n'
    
    # Add labels
    svg_content += f'''  <!-- Labels -->
  <text x="{50 + span * scale / 2}" y="180" text-anchor="middle" class="text">Span: {span}m</text>
  <text x="{50 + span * scale / 2}" y="{220 + width * scale}" text-anchor="middle" class="text">Width: {width}m</text>
  <text x="20" y="{250 + width * scale + abutment_height}" class="text">Piers: {pier_count}</text>
  
  <!-- Legend -->
  <rect x="{svg_width - 150}" y="100" width="20" height="20" class="bridge-deck" />
  <text x="{svg_width - 120}" y="115" class="text">Bridge Deck</text>
  
  <rect x="{svg_width - 150}" y="130" width="20" height="20" class="pier" />
  <text x="{svg_width - 120}" y="145" class="text">Pier</text>
  
  <rect x="{svg_width - 150}" y="160" width="20" height="20" class="abutment" />
  <text x="{svg_width - 120}" y="175" class="text">Abutment</text>
</svg>'''
    
    # Write SVG file
    with open(output_file, 'w') as f:
        f.write(svg_content)
    
    print(f"✅ SVG file created: {output_file}")
    return output_file

def create_simple_bridge_data(parameters, output_file):
    """Create a simple text representation of bridge data"""
    
    content = f"""BRIDGE GENERAL ARRANGEMENT DATA
============================

BASIC PARAMETERS:
  Span: {parameters.get('span1', parameters.get('lbridge', 20.0))} meters
  Width: {parameters.get('ccbr', parameters.get('width', 10.0))} meters
  Number of Piers: {int(parameters.get('piern', 1))}
  
STRUCTURAL ELEMENTS:
  Deck Thickness: {parameters.get('slbthc', 0.25)} meters
  Pier Width: {parameters.get('piertw', 1.0)} meters
  Pier Height: {parameters.get('pierst', 8.0)} meters
  Abutment Width: {parameters.get('battr', 2.0)} meters
  
HYDRAULIC DATA:
  Datum Level: {parameters.get('datum', 100.0)} meters
  Top RL: {parameters.get('toprl', 102.0)} meters
  Flood Level: {parameters.get('RTL', 101.0)} meters
  
SCALING:
  Plan Scale: 1:{parameters.get('scale1', 100)}
  Section Scale: 1:{parameters.get('scale2', 50)}
  
GENERATED: Basic visualization using Python
"""
    
    with open(output_file, 'w') as f:
        f.write(content)
    
    print(f"✅ Data file created: {output_file}")
    return output_file

def main():
    print("🏗️  Basic Bridge Visualization Generator")
    print("=" * 50)
    
    # Create output directory
    output_dir = Path(__file__).parent / "OUTPUT"
    output_dir.mkdir(exist_ok=True)
    
    # Try to find a sample input file
    bridge_gad_path = Path(__file__).parent / "Bridge_GAD_Yogendra_Borse"
    sample_files = [
        bridge_gad_path / "SAMPLE_INPUT_FILES" / "bridge_parameters_simple.xlsx",
        bridge_gad_path / "SAMPLE_INPUT_FILES" / "bridge_parameters_simple.csv",
        bridge_gad_path / "SAMPLE_INPUT_FILES" / "bridge_parameters.txt",
        bridge_gad_path / "SAMPLE_INPUT_FILES" / "bridge_parameters.json"
    ]
    
    input_file = None
    for file_path in sample_files:
        if file_path.exists():
            input_file = file_path
            break
    
    if not input_file:
        print("❌ No sample input file found")
        # Create a basic parameter set
        parameters = {
            'span1': 20.0,
            'lbridge': 20.0,
            'ccbr': 10.0,
            'width': 10.0,
            'piern': 1,
            'piertw': 1.0,
            'pierst': 8.0,
            'battr': 2.0,
            'slbthc': 0.25,
            'datum': 100.0,
            'toprl': 102.0,
            'RTL': 101.0,
            'scale1': 100,
            'scale2': 50
        }
        print("ℹ️  Using default parameters")
    else:
        print(f"📄 Using input file: {input_file.name}")
        # Try to read parameters
        parameters = read_bridge_parameters(str(input_file))
        if not parameters:
            # Fallback to default parameters
            parameters = {
                'span1': 20.0,
                'lbridge': 20.0,
                'ccbr': 10.0,
                'width': 10.0,
                'piern': 1,
                'piertw': 1.0,
                'pierst': 8.0,
                'battr': 2.0,
                'slbthc': 0.25,
                'datum': 100.0,
                'toprl': 102.0,
                'RTL': 101.0,
                'scale1': 100,
                'scale2': 50
            }
    
    print(f"🔧 Generating visualizations with {len(parameters)} parameters...")
    
    # Create DXF visualization
    dxf_file = output_dir / "basic_bridge_visualization.dxf"
    create_simple_dxf(parameters, dxf_file)
    
    # Create SVG visualization
    svg_file = output_dir / "basic_bridge_visualization.svg"
    create_simple_bridge_svg(parameters, svg_file)
    
    # Create text data file
    data_file = output_dir / "bridge_parameters_summary.txt"
    create_simple_bridge_data(parameters, data_file)
    
    print("\n🎉 Generation Complete!")
    print(f"📁 DXF visualization: {dxf_file}")
    print(f"📁 SVG visualization: {svg_file}")
    print(f"📁 Data summary: {data_file}")
    print("\nℹ️  These are basic visualizations:")
    print("   - DXF can be opened in CAD software")
    print("   - SVG can be opened in web browsers")
    print("   - TXT can be opened in text editors")

if __name__ == "__main__":
    main()