/**
 * Bill of Quantities Page
 */

import type { BillOfQuantities } from '../types/design';

interface BOQPageProps {
  boq: BillOfQuantities;
}

export function BOQPage({ boq }: BOQPageProps) {
  const formatCost = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Bill of Quantities</h2>

        {/* Earthwork */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4 text-blue-900">Earthwork</h3>
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">Item</th>
                <th className="text-right px-4 py-2">Quantity</th>
                <th className="text-right px-4 py-2">Unit</th>
                <th className="text-right px-4 py-2">Rate</th>
                <th className="text-right px-4 py-2">Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-2">Excavation</td>
                <td className="text-right px-4 py-2" data-testid="excavation-qty">{boq.excavation.toFixed(1)}</td>
                <td className="text-right px-4 py-2">m³</td>
                <td className="text-right px-4 py-2">500</td>
                <td className="text-right px-4 py-2 font-bold">{formatCost(boq.excavation * 500)}</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Backfill</td>
                <td className="text-right px-4 py-2" data-testid="backfill-qty">{boq.backfill.toFixed(1)}</td>
                <td className="text-right px-4 py-2">m³</td>
                <td className="text-right px-4 py-2">300</td>
                <td className="text-right px-4 py-2 font-bold">{formatCost(boq.backfill * 300)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Concrete */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4 text-green-900">Concrete Works</h3>
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">Item</th>
                <th className="text-right px-4 py-2">Quantity</th>
                <th className="text-right px-4 py-2">Unit</th>
                <th className="text-right px-4 py-2">Rate</th>
                <th className="text-right px-4 py-2">Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-2">PCC Grade (Base Course)</td>
                <td className="text-right px-4 py-2">{boq.pccGrade.quantity.toFixed(1)}</td>
                <td className="text-right px-4 py-2">m³</td>
                <td className="text-right px-4 py-2">{formatCost(boq.pccGrade.rate)}</td>
                <td className="text-right px-4 py-2 font-bold">{formatCost(boq.pccGrade.cost)}</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">RCC Grade (Structural)</td>
                <td className="text-right px-4 py-2" data-testid="rcc-qty">{boq.rccGrade.quantity.toFixed(1)}</td>
                <td className="text-right px-4 py-2">m³</td>
                <td className="text-right px-4 py-2">{formatCost(boq.rccGrade.rate)}</td>
                <td className="text-right px-4 py-2 font-bold">{formatCost(boq.rccGrade.cost)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Steel */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4 text-purple-900">Steel Reinforcement</h3>
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">Item</th>
                <th className="text-right px-4 py-2">Quantity</th>
                <th className="text-right px-4 py-2">Unit</th>
                <th className="text-right px-4 py-2">Rate</th>
                <th className="text-right px-4 py-2">Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-2">Steel Reinforcement</td>
                <td className="text-right px-4 py-2" data-testid="steel-qty">{boq.steelQuantity.toFixed(0)}</td>
                <td className="text-right px-4 py-2">kg</td>
                <td className="text-right px-4 py-2">{formatCost(boq.steelRate)}</td>
                <td className="text-right px-4 py-2 font-bold">{formatCost(boq.steelCost)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-gray-600 mb-2">Total Project Cost</div>
              <div className="text-3xl font-bold text-blue-900" data-testid="total-cost">
                {formatCost(boq.totalCost)}
              </div>
            </div>
            <div>
              <div className="text-gray-600 mb-2">Cost per Meter Span</div>
              <div className="text-3xl font-bold text-green-900" data-testid="cost-per-meter">
                {formatCost(boq.costPerMeterSpan)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
