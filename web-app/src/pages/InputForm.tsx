/**
 * Bridge Design Input Form
 * Collects all 10 design parameters
 */

import { useState, FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DesignInputSchema } from '../utils/validation';
import { DEFAULT_VALUES } from '../utils/constants';
import type { DesignInput } from '../types/design';

interface InputFormProps {
  onSubmit: (data: DesignInput) => void;
  isLoading?: boolean;
}

export function InputForm({ onSubmit, isLoading = false }: InputFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<DesignInput>({
    resolver: zodResolver(DesignInputSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const values = watch();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Hydraulic Parameters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-blue-900">
          Hydraulic Parameters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Discharge */}
          <div>
            <label htmlFor="discharge" className="block text-sm font-medium text-gray-700">
              Design Discharge (Q) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center mt-1">
              <input
                id="discharge"
                type="number"
                step="0.01"
                {...register('discharge', { valueAsNumber: true })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                data-testid="input-discharge"
              />
              <span className="ml-2 text-gray-600 text-sm">m³/s</span>
            </div>
            {errors.discharge && (
              <p className="text-red-500 text-sm mt-1">{errors.discharge.message}</p>
            )}
          </div>

          {/* Flood Level */}
          <div>
            <label htmlFor="floodLevel" className="block text-sm font-medium text-gray-700">
              Flood Level (HFL) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center mt-1">
              <input
                id="floodLevel"
                type="number"
                step="0.01"
                {...register('floodLevel', { valueAsNumber: true })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                data-testid="input-floodLevel"
              />
              <span className="ml-2 text-gray-600 text-sm">m MSL</span>
            </div>
            {errors.floodLevel && (
              <p className="text-red-500 text-sm mt-1">{errors.floodLevel.message}</p>
            )}
          </div>

          {/* Bed Level */}
          <div>
            <label htmlFor="bedLevel" className="block text-sm font-medium text-gray-700">
              Bed Level <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center mt-1">
              <input
                id="bedLevel"
                type="number"
                step="0.01"
                {...register('bedLevel', { valueAsNumber: true })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                data-testid="input-bedLevel"
              />
              <span className="ml-2 text-gray-600 text-sm">m MSL</span>
            </div>
            {errors.bedLevel && (
              <p className="text-red-500 text-sm mt-1">{errors.bedLevel.message}</p>
            )}
          </div>

          {/* Bed Slope */}
          <div>
            <label htmlFor="bedSlope" className="block text-sm font-medium text-gray-700">
              Bed Slope <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center mt-1">
              <input
                id="bedSlope"
                type="number"
                step="0.0001"
                {...register('bedSlope', { valueAsNumber: true })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                data-testid="input-bedSlope"
              />
              <span className="ml-2 text-gray-600 text-sm">m/m</span>
            </div>
            {errors.bedSlope && (
              <p className="text-red-500 text-sm mt-1">{errors.bedSlope.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Geometric Parameters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-green-900">
          Geometric Parameters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Span */}
          <div>
            <label htmlFor="span" className="block text-sm font-medium text-gray-700">
              Design Span <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center mt-1">
              <input
                id="span"
                type="number"
                step="0.5"
                {...register('span', { valueAsNumber: true })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                data-testid="input-span"
              />
              <span className="ml-2 text-gray-600 text-sm">m</span>
            </div>
            {errors.span && (
              <p className="text-red-500 text-sm mt-1">{errors.span.message}</p>
            )}
          </div>

          {/* Bridge Width */}
          <div>
            <label htmlFor="width" className="block text-sm font-medium text-gray-700">
              Bridge Width <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center mt-1">
              <input
                id="width"
                type="number"
                step="0.5"
                {...register('width', { valueAsNumber: true })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                data-testid="input-width"
              />
              <span className="ml-2 text-gray-600 text-sm">m</span>
            </div>
            {errors.width && (
              <p className="text-red-500 text-sm mt-1">{errors.width.message}</p>
            )}
          </div>

          {/* Number of Lanes */}
          <div>
            <label htmlFor="numberOfLanes" className="block text-sm font-medium text-gray-700">
              Number of Lanes <span className="text-red-500">*</span>
            </label>
            <input
              id="numberOfLanes"
              type="number"
              step="1"
              {...register('numberOfLanes', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              data-testid="input-numberOfLanes"
            />
            {errors.numberOfLanes && (
              <p className="text-red-500 text-sm mt-1">{errors.numberOfLanes.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Material Parameters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-purple-900">
          Material Parameters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Concrete Grade */}
          <div>
            <label htmlFor="fck" className="block text-sm font-medium text-gray-700">
              Concrete Grade (fck) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center mt-1">
              <input
                id="fck"
                type="number"
                step="5"
                {...register('fck', { valueAsNumber: true })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                data-testid="input-fck"
              />
              <span className="ml-2 text-gray-600 text-sm">N/mm²</span>
            </div>
            {errors.fck && (
              <p className="text-red-500 text-sm mt-1">{errors.fck.message}</p>
            )}
          </div>

          {/* Steel Grade */}
          <div>
            <label htmlFor="fy" className="block text-sm font-medium text-gray-700">
              Steel Grade (fy) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center mt-1">
              <input
                id="fy"
                type="number"
                step="50"
                {...register('fy', { valueAsNumber: true })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                data-testid="input-fy"
              />
              <span className="ml-2 text-gray-600 text-sm">N/mm²</span>
            </div>
            {errors.fy && (
              <p className="text-red-500 text-sm mt-1">{errors.fy.message}</p>
            )}
          </div>

          {/* Soil Bearing Capacity */}
          <div>
            <label htmlFor="soilBearingCapacity" className="block text-sm font-medium text-gray-700">
              Soil Bearing Capacity (SBC) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center mt-1">
              <input
                id="soilBearingCapacity"
                type="number"
                step="10"
                {...register('soilBearingCapacity', { valueAsNumber: true })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                data-testid="input-soilBearingCapacity"
              />
              <span className="ml-2 text-gray-600 text-sm">kPa</span>
            </div>
            {errors.soilBearingCapacity && (
              <p className="text-red-500 text-sm mt-1">{errors.soilBearingCapacity.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Summary Info */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <p className="text-sm text-gray-700">
          <strong>Flow Depth:</strong> {(values.floodLevel - values.bedLevel).toFixed(2)} m
          {' | '}
          <strong>Span/Width Ratio:</strong> {(values.span / values.width).toFixed(2)}
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
        data-testid="button-submit"
      >
        {isLoading ? 'Calculating...' : 'Generate Bridge Design'}
      </button>
    </form>
  );
}
