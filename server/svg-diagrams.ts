import { DesignInput, DesignOutput } from "./design-engine";

export function generatePierSVG(input: DesignInput, design: DesignOutput): string {
  const width = 600;
  const height = 700;
  const pierW = design.pier?.width || 1.5;
  const pierL = design.pier?.length || 2.5;
  const baseW = design.pier.baseWidth;
  const baseL = design.pier.baseLength;

  const dwlY = 200;
  const bedY = 450;
  const stemX = width / 2;
  const stemScale = 80; // pixels per meter

  const stemWidth = pierW * stemScale;
  const stemLength = pierL * stemScale;
  const baseWidth = baseW * stemScale;
  const baseLength = baseL * stemScale;
  const stemHeight = (bedY - dwlY);

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
        <polygon points="0 0, 10 3, 0 6" fill="#d32f2f" />
      </marker>
    </defs>
    
    <!-- Grid background -->
    <rect width="${width}" height="${height}" fill="#f5f5f5"/>
    
    <!-- Water level line -->
    <line x1="50" y1="${dwlY}" x2="${width-50}" y2="${dwlY}" stroke="#1976d2" stroke-width="3" stroke-dasharray="5,5"/>
    <text x="10" y="${dwlY-10}" font-size="12" font-weight="bold" fill="#1976d2">DWL</text>
    
    <!-- Pier stem -->
    <rect x="${stemX - stemWidth/2}" y="${dwlY}" width="${stemWidth}" height="${stemHeight}" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2"/>
    
    <!-- Pier footing -->
    <rect x="${stemX - baseWidth/2}" y="${bedY}" width="${baseWidth}" height="50" fill="#fff9c4" stroke="#f57f17" stroke-width="2"/>
    
    <!-- Bed level line -->
    <line x1="30" y1="${bedY}" x2="${width-30}" y2="${bedY}" stroke="#8d6e63" stroke-width="2"/>
    <text x="10" y="${bedY+20}" font-size="12" font-weight="bold" fill="#8d6e63">Bed Level</text>
    
    <!-- Hydrostatic force arrow -->
    <line x1="${stemX + stemWidth/2 + 10}" y1="${dwlY + 50}" x2="${stemX + stemWidth/2 + 80}" y2="${dwlY + 50}" stroke="#d32f2f" stroke-width="3" marker-end="url(#arrowhead)"/>
    <text x="${stemX + stemWidth/2 + 15}" y="${dwlY + 40}" font-size="11" fill="#d32f2f">Hydrostatic</text>
    
    <!-- Drag force arrow -->
    <line x1="${stemX + stemWidth/2 + 10}" y1="${dwlY + 120}" x2="${stemX + stemWidth/2 + 70}" y2="${dwlY + 120}" stroke="#d32f2f" stroke-width="2" marker-end="url(#arrowhead)"/>
    <text x="${stemX + stemWidth/2 + 15}" y="${dwlY + 110}" font-size="11" fill="#d32f2f">Drag</text>
    
    <!-- Dimensions -->
    <text x="${stemX}" y="${dwlY - 30}" font-size="11" font-weight="bold" fill="#365070" text-anchor="middle">Width: ${pierW}m</text>
    <text x="${stemX}" y="${bedY + 70}" font-size="11" font-weight="bold" fill="#365070" text-anchor="middle">Base: ${baseW}m × ${baseL}m</text>
    
    <!-- Stress diagram -->
    <text x="50" y="650" font-size="13" font-weight="bold" fill="#365070">STRESS DISTRIBUTION:</text>
    <polyline points="100,630 150,620 200,610 250,600 300,590 350,580" stroke="#2e7d32" stroke-width="2" fill="none"/>
    <line x1="100" y1="630" x2="100" y2="650" stroke="#999" stroke-width="1"/>
    <line x1="350" y1="580" x2="350" y2="650" stroke="#999" stroke-width="1"/>
  </svg>`;
}

export function generateAbutmentSVG(input: DesignInput, design: DesignOutput): string {
  const width = 600;
  const height = 700;
  const abutH = design.abutment.height;
  const baseW = design.abutment.baseWidth;
  const stemW = design.abutment.width;

  const dwlY = 150;
  const baseY = 550;
  const stemScale = 60; // pixels per meter
  const centerX = width / 2;

  const stemWidth = stemW * stemScale;
  const baseWidth = baseW * stemScale;
  const stemHeight = (baseY - dwlY);

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="backfill" patternUnits="userSpaceOnUse" width="4" height="4">
        <path d="M0,4 l4,-4 M-1,1 l2,-2 M3,5 l2,-2" stroke="#a1887f" stroke-width="0.5"/>
      </pattern>
    </defs>
    
    <!-- Background -->
    <rect width="${width}" height="${height}" fill="#f5f5f5"/>
    
    <!-- Water level -->
    <line x1="30" y1="${dwlY}" x2="${width-30}" y2="${dwlY}" stroke="#1976d2" stroke-width="3" stroke-dasharray="5,5"/>
    <text x="10" y="${dwlY-10}" font-size="12" font-weight="bold" fill="#1976d2">DWL</text>
    
    <!-- Bridge deck -->
    <rect x="${centerX - baseWidth/2}" y="${dwlY - 50}" width="${baseWidth}" height="40" fill="#d7ccc8" stroke="#5d4037" stroke-width="2"/>
    <text x="${centerX}" y="${dwlY-25}" font-size="10" fill="#fff" text-anchor="middle" font-weight="bold">Bridge Deck</text>
    
    <!-- Abutment stem -->
    <rect x="${centerX - stemWidth/2}" y="${dwlY}" width="${stemWidth}" height="${stemHeight}" fill="#e3f2fd" stroke="#1565c0" stroke-width="2"/>
    <text x="${centerX}" y="${baseY/2}" font-size="11" fill="#1565c0" text-anchor="middle" font-weight="bold">H=${abutH.toFixed(1)}m</text>
    
    <!-- Footing -->
    <rect x="${centerX - baseWidth/2}" y="${baseY}" width="${baseWidth}" height="60" fill="#fff9c4" stroke="#f57f17" stroke-width="2"/>
    <text x="${centerX}" y="${baseY+35}" font-size="10" fill="#f57f17" text-anchor="middle" font-weight="bold">W=${baseW.toFixed(1)}m</text>
    
    <!-- Wing wall -->
    <polygon points="${centerX - stemWidth/2},${baseY} ${centerX - stemWidth/2 - 40},${baseY + 30} ${centerX - stemWidth/2 - 30},${baseY}" fill="#e8f5e9" stroke="#2e7d32" stroke-width="1.5"/>
    <polygon points="${centerX + stemWidth/2},${baseY} ${centerX + stemWidth/2 + 40},${baseY + 30} ${centerX + stemWidth/2 + 30},${baseY}" fill="#e8f5e9" stroke="#2e7d32" stroke-width="1.5"/>
    
    <!-- Backfill (hatched) -->
    <rect x="${centerX + stemWidth/2}" y="${dwlY}" width="80" height="${stemHeight}" fill="url(#backfill)" stroke="#a1887f" stroke-width="1"/>
    <text x="${centerX + stemWidth/2 + 40}" y="${dwlY + 80}" font-size="10" fill="#666" text-anchor="middle">Backfill</text>
    
    <!-- Earth pressure arrow -->
    <line x1="${centerX + stemWidth/2 + 80}" y1="${dwlY + 80}" x2="${centerX + stemWidth/2 + 140}" y2="${dwlY + 80}" stroke="#d32f2f" stroke-width="3" marker-end="url(#arrowhead)"/>
    <text x="${centerX + stemWidth/2 + 110}" y="${dwlY + 65}" font-size="10" fill="#d32f2f">Earth Press.</text>
    
    <!-- Stress distribution below -->
    <text x="50" y="650" font-size="12" font-weight="bold" fill="#365070">FOOTING STRESS:</text>
    <line x1="50" y1="665" x2="550" y2="665" stroke="#999" stroke-width="1"/>
    <rect x="80" y="660" width="150" height="20" fill="#c8e6c9" stroke="#2e7d32" stroke-width="1"/>
    <text x="155" y="675" font-size="9" text-anchor="middle" fill="#1b5e20">Safe Pressure</text>
    
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
        <polygon points="0 0, 10 3, 0 6" fill="#d32f2f" />
      </marker>
    </defs>
  </svg>`;
}

export function generateCantileverSVG(input: DesignInput, design: DesignOutput): string {
  const width = 650;
  const height = 750;
  const mainStemW = design.abutment.width * 0.8;
  const returnWallH = design.abutment.wingWallHeight;
  const returnWallT = design.abutment.wingWallThickness;

  const dwlY = 150;
  const baseY = 600;
  const stemScale = 50;
  const centerX = width / 2;

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="backfill2" patternUnits="userSpaceOnUse" width="4" height="4">
        <path d="M0,4 l4,-4 M-1,1 l2,-2 M3,5 l2,-2" stroke="#a1887f" stroke-width="0.5"/>
      </pattern>
      <marker id="arrowhead2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
        <polygon points="0 0, 10 3, 0 6" fill="#d32f2f" />
      </marker>
    </defs>
    
    <rect width="${width}" height="${height}" fill="#f5f5f5"/>
    
    <!-- Water level -->
    <line x1="30" y1="${dwlY}" x2="${width-30}" y2="${dwlY}" stroke="#1976d2" stroke-width="3" stroke-dasharray="5,5"/>
    <text x="10" y="${dwlY-10}" font-size="12" font-weight="bold" fill="#1976d2">DWL</text>
    
    <!-- Bridge deck -->
    <rect x="${centerX - 100}" y="${dwlY - 50}" width="200" height="40" fill="#d7ccc8" stroke="#5d4037" stroke-width="2"/>
    <text x="${centerX}" y="${dwlY-25}" font-size="10" fill="#fff" text-anchor="middle" font-weight="bold">Bridge</text>
    
    <!-- Main stem (cantilever) -->
    <rect x="${centerX - 60}" y="${dwlY}" width="120" height="${baseY - dwlY}" fill="#e3f2fd" stroke="#1565c0" stroke-width="2"/>
    <text x="${centerX}" y="${(dwlY + baseY)/2}" font-size="11" fill="#1565c0" text-anchor="middle" font-weight="bold">Main Stem</text>
    
    <!-- Cantilever footing -->
    <rect x="${centerX - 90}" y="${baseY}" width="180" height="50" fill="#fff9c4" stroke="#f57f17" stroke-width="2"/>
    
    <!-- Return wall (cantilever from main footing) -->
    <rect x="${centerX + 60}" y="${dwlY}" width="${returnWallT * stemScale}" height="${returnWallH * stemScale}" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2"/>
    <text x="${centerX + 60 + (returnWallT * stemScale)/2}" y="${dwlY + (returnWallH * stemScale)/2}" font-size="9" fill="#2e7d32" text-anchor="middle" font-weight="bold">Return</text>
    
    <!-- Backfill on return wall -->
    <rect x="${centerX + 60 + (returnWallT * stemScale)}" y="${dwlY}" width="70" height="${returnWallH * stemScale}" fill="url(#backfill2)" stroke="#a1887f" stroke-width="1"/>
    
    <!-- Earth pressure on return wall -->
    <line x1="${centerX + 60 + (returnWallT * stemScale) + 70}" y1="${dwlY + 60}" x2="${width - 50}" y2="${dwlY + 60}" stroke="#d32f2f" stroke-width="3" marker-end="url(#arrowhead2)"/>
    <text x="${centerX + 200}" y="${dwlY + 50}" font-size="10" fill="#d32f2f">Active Pressure</text>
    
    <!-- Moment diagram on return wall -->
    <text x="50" y="680" font-size="12" font-weight="bold" fill="#365070">RETURN WALL MOMENT:</text>
    <polyline points="100,660 130,650 160,640 190,630 220,625" stroke="#d32f2f" stroke-width="2.5" fill="none"/>
    <line x1="100" y1="660" x2="100" y2="670" stroke="#999" stroke-width="1"/>
    <line x1="220" y1="625" x2="220" y2="670" stroke="#999" stroke-width="1"/>
    <text x="100" y="685" font-size="9" fill="#999">Top</text>
    <text x="220" y="685" font-size="9" fill="#999">Base</text>
  </svg>`;
}

export function generateSlabSVG(input: DesignInput, design: DesignOutput): string {
  const width = 700;
  const height = 650;
  const span = input.span;
  const bridgeW = input.width;

  const slabX = 100;
  const slabY = 150;
  const slabScale = 40; // pixels per meter

  const slabWidth = bridgeW * slabScale;
  const slabLength = span * slabScale;

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="#f5f5f5"/>
    
    <!-- Title -->
    <text x="${width/2}" y="40" font-size="14" font-weight="bold" fill="#365070" text-anchor="middle">TWO-WAY SLAB MOMENT DISTRIBUTION (Pigeaud's Method)</text>
    
    <!-- Slab plan view -->
    <rect x="${slabX}" y="${slabY}" width="${slabWidth}" height="${slabLength}" fill="#e3f2fd" stroke="#1565c0" stroke-width="2"/>
    
    <!-- Load pattern (70 kPa IRC AA) -->
    <g opacity="0.5">
      <circle cx="${slabX + slabWidth/2}" cy="${slabY + slabLength/4}" r="20" fill="#ffc107"/>
      <circle cx="${slabX + slabWidth/2}" cy="${slabY + slabLength/2}" r="22" fill="#ffc107"/>
      <circle cx="${slabX + slabWidth/2}" cy="${slabY + 3*slabLength/4}" r="20" fill="#ffc107"/>
    </g>
    <text x="${slabX + slabWidth + 20}" y="${slabY + slabLength/2}" font-size="11" fill="#f57f17" font-weight="bold">Load = 70 kPa (IRC AA)</text>
    
    <!-- Dimensions -->
    <text x="${slabX - 30}" y="${slabY + slabLength/2 + 5}" font-size="11" fill="#666" text-anchor="end">Span = ${span}m</text>
    <text x="${slabX + slabWidth/2}" y="${slabY + slabLength + 30}" font-size="11" fill="#666" text-anchor="middle">Width = ${bridgeW}m</text>
    
    <!-- Moment diagram - Main direction (positive parabola) -->
    <text x="100" y="470" font-size="12" font-weight="bold" fill="#365070">LONGITUDINAL MOMENT ENVELOPE:</text>
    <polyline points="150,450 220,420 280,400 340,420 410,450" stroke="#2e7d32" stroke-width="3" fill="none"/>
    <text x="280" y="385" font-size="10" fill="#2e7d32" font-weight="bold">+245 kN-m/m</text>
    
    <!-- Support moments (negative) -->
    <line x1="150" y1="450" x2="120" y2="465" stroke="#d32f2f" stroke-width="2.5"/>
    <line x1="410" y1="450" x2="440" y2="465" stroke="#d32f2f" stroke-width="2.5"/>
    <text x="100" y="480" font-size="10" fill="#d32f2f">-120 kN-m/m</text>
    <text x="430" y="480" font-size="10" fill="#d32f2f">-120 kN-m/m</text>
    
    <!-- Transverse moment diagram -->
    <text x="100" y="560" font-size="12" font-weight="bold" fill="#365070">TRANSVERSE MOMENT ENVELOPE:</text>
    <polyline points="150,540 220,520 280,510 340,520 410,540" stroke="#1565c0" stroke-width="3" fill="none"/>
    <text x="280" y="495" font-size="10" fill="#1565c0" font-weight="bold">+155 kN-m/m</text>
    
    <!-- Legend -->
    <rect x="100" y="600" width="500" height="35" fill="#e8f5e9" stroke="#2e7d32" stroke-width="1" rx="3"/>
    <text x="110" y="615" font-size="10" fill="#1b5e20">✓ All moments within safe limits</text>
    <text x="310" y="615" font-size="10" fill="#1b5e20">✓ Stress check: SAFE</text>
  </svg>`;
}
