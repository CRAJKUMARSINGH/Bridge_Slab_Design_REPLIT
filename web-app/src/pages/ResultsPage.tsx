/**
 * Design Results Display Page
 */

import type { CompleteDesignOutput } from '../types/design';
import { STATUS_COLORS } from '../utils/constants';

interface ResultsPageProps {
  results: CompleteDesignOutput;
  onNewDesign: () => void;
}

export function ResultsPage({ results, onNewDesign }: ResultsPageProps) {
  const statusColor = STATUS_COLORS[results.overallStatus];
  
  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <div className="bg-white rounded-lg shadow p-6 border-l-4" style={{ borderColor: statusColor }}>
        <h2 className="text-2xl font-bold mb-2" style={{ color: statusColor }}>
          {results.overallStatus === 'COMPLIANT' && '✓ DESIGN COMPLIANT'}
          {results.overallStatus === 'REVIEW_REQUIRED' && '⚠ REVIEW REQUIRED'}
          {results.overallStatus === 'NON_COMPLIANT' && '✗ NON-COMPLIANT'}
        </h2>
        
        {results.criticalIssues.length > 0 && (
          <div className="mt-4 bg-red-50 p-4 rounded">
            <h3 className="font-bold text-red-900 mb-2">Critical Issues:</h3>
            <ul className="list-disc pl-6 space-y-1">
              {results.criticalIssues.map((issue, i) => (
                <li key={i} className="text-red-700">{issue}</li>
              ))}
            </ul>
          </div>
        )}
        
        {results.warnings.length > 0 && (
          <div className="mt-4 bg-yellow-50 p-4 rounded">
            <h3 className="font-bold text-yellow-900 mb-2">Warnings:</h3>
            <ul className="list-disc pl-6 space-y-1">
              {results.warnings.map((warning, i) => (
                <li key={i} className="text-yellow-700">{warning}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Hydraulics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4 text-blue-900">Hydraulic Analysis</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <div className="text-gray-600 text-sm">Flow Depth</div>
            <div className="text-2xl font-bold" data-testid="text-flowDepth">
              {results.hydraulics.flowDepth.toFixed(2)} m
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded">
            <div className="text-gray-600 text-sm">Velocity</div>
            <div className="text-2xl font-bold" data-testid="text-velocity">
              {results.hydraulics.velocity.toFixed(2)} m/s
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded">
            <div className="text-gray-600 text-sm">Afflux</div>
            <div className="text-2xl font-bold" data-testid="text-afflux">
              {results.hydraulics.afflux.toFixed(3)} m
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded">
            <div className="text-gray-600 text-sm">Design WL</div>
            <div className="text-2xl font-bold" data-testid="text-designWL">
              {results.hydraulics.designWaterLevel.toFixed(2)} m MSL
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded">
            <div className="text-gray-600 text-sm">Froude Number</div>
            <div className="text-2xl font-bold" data-testid="text-froude">
              {results.hydraulics.froudeNumber.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Pier Design */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4 text-green-900">Pier Design</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 mb-2"><strong>Number of Piers:</strong> <span data-testid="text-pierCount">{results.pier.numberOfPiers}</span></p>
            <p className="text-gray-600 mb-2"><strong>Pier Width:</strong> {results.pier.pierWidth.toFixed(2)} m</p>
            <p className="text-gray-600"><strong>Pier Spacing:</strong> {results.pier.spacing.toFixed(2)} m</p>
          </div>
          <div>
            <p className="text-gray-600 mb-2"><strong>Hydrostatic Force:</strong> {results.pier.hydrostaticForce.toFixed(1)} kN</p>
            <p className="text-gray-600 mb-2"><strong>Drag Force:</strong> {results.pier.dragForce.toFixed(1)} kN</p>
            <p className="text-gray-600"><strong>Total H-Force:</strong> {results.pier.totalHorizontalForce.toFixed(1)} kN</p>
          </div>
        </div>

        <h4 className="font-bold mt-4 mb-2">Stability Factors:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FOSIndicator label="Sliding" value={results.pier.slidingFOS} min={1.5} testId="pier-sliding" />
          <FOSIndicator label="Overturning" value={results.pier.overturnFOS} min={2.0} testId="pier-overturning" />
          <FOSIndicator label="Bearing" value={results.pier.bearingFOS} min={3.0} testId="pier-bearing" />
        </div>
        <p className="text-sm mt-2 text-gray-700"><strong>Status:</strong> <span data-testid="pier-status">{results.pier.status}</span></p>
      </div>

      {/* Abutment Design */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4 text-purple-900">Abutment Design (Type 1)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 mb-2"><strong>Height:</strong> {results.abutmentType1.height.toFixed(2)} m</p>
            <p className="text-gray-600 mb-2"><strong>Base Width:</strong> {results.abutmentType1.baseWidth.toFixed(2)} m</p>
            <p className="text-gray-600"><strong>Active Earth Pressure:</strong> {results.abutmentType1.activeEarthPressure.toFixed(1)} kN</p>
          </div>
        </div>

        <h4 className="font-bold mt-4 mb-2">Stability Factors:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FOSIndicator label="Sliding" value={results.abutmentType1.slidingFOS} min={1.5} testId="abutment-sliding" />
          <FOSIndicator label="Overturning" value={results.abutmentType1.overturnFOS} min={2.0} testId="abutment-overturning" />
          <FOSIndicator label="Bearing" value={results.abutmentType1.bearingFOS} min={3.0} testId="abutment-bearing" />
        </div>
      </div>

      {/* Footing Design */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4 text-orange-900">Footing Design</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 mb-2"><strong>Length × Width:</strong> {results.footing.length.toFixed(1)} m × {results.footing.width.toFixed(1)} m</p>
            <p className="text-gray-600 mb-2"><strong>Depth:</strong> {results.footing.depth.toFixed(2)} m</p>
            <p className="text-gray-600"><strong>Applied Pressure:</strong> {results.footing.appliedPressure.toFixed(1)} kPa</p>
          </div>
          <div>
            <p className="text-gray-600 mb-2"><strong>Safe Bearing Capacity:</strong> {results.footing.safeBearingCapacity.toFixed(1)} kPa</p>
            <p className="text-gray-600 mb-2"><strong>Settlement:</strong> {results.footing.settlement.toFixed(1)} mm</p>
            <p className="text-gray-600"><strong>Bearing FOS:</strong> {results.footing.bearingFOS.toFixed(2)} (min 3.0)</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onNewDesign}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
          data-testid="button-newDesign"
        >
          New Design
        </button>
      </div>
    </div>
  );
}

interface FOSIndicatorProps {
  label: string;
  value: number;
  min: number;
  testId: string;
}

function FOSIndicator({ label, value, min, testId }: FOSIndicatorProps) {
  const isSafe = value >= min;
  const color = isSafe ? '#10b981' : '#ef4444';
  
  return (
    <div className="p-4 rounded border-2" style={{ borderColor: color, backgroundColor: `${color}15` }}>
      <div className="text-gray-600 text-sm">{label}</div>
      <div className="text-2xl font-bold" style={{ color }} data-testid={testId}>
        {value.toFixed(2)}
      </div>
      <div className="text-xs text-gray-600">min {min.toFixed(1)}</div>
    </div>
  );
}
