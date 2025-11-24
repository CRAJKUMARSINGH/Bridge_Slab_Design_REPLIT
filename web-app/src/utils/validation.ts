/**
 * Input Validation - Zod Schemas
 */

import { z } from 'zod';

export const DesignInputSchema = z.object({
  // Hydraulic Parameters
  discharge: z.number()
    .min(100, 'Discharge must be at least 100 m³/s')
    .max(100000, 'Discharge cannot exceed 100,000 m³/s'),
  
  floodLevel: z.number()
    .min(0, 'Flood level must be positive'),
  
  bedLevel: z.number()
    .min(0, 'Bed level must be positive'),
  
  bedSlope: z.number()
    .min(0.0001, 'Bed slope must be greater than 0.0001 m/m')
    .max(0.01, 'Bed slope cannot exceed 0.01 m/m'),

  // Geometric Parameters
  span: z.number()
    .min(5, 'Span must be at least 5 m')
    .max(100, 'Span cannot exceed 100 m'),
  
  width: z.number()
    .min(5, 'Bridge width must be at least 5 m')
    .max(200, 'Bridge width cannot exceed 200 m'),
  
  numberOfLanes: z.number()
    .min(1, 'Must have at least 1 lane')
    .max(8, 'Cannot have more than 8 lanes')
    .int('Number of lanes must be integer'),

  // Material Parameters
  fck: z.number()
    .min(15, 'Concrete grade must be at least 15 N/mm²')
    .max(60, 'Concrete grade cannot exceed 60 N/mm²'),
  
  fy: z.number()
    .min(250, 'Steel grade must be at least 250 N/mm²')
    .max(550, 'Steel grade cannot exceed 550 N/mm²'),
  
  soilBearingCapacity: z.number()
    .min(50, 'SBC must be at least 50 kPa')
    .max(1000, 'SBC cannot exceed 1000 kPa'),

  // Optional
  loadClass: z.string().optional(),
}).refine(
  (data) => data.floodLevel > data.bedLevel,
  {
    message: 'Flood level must be higher than bed level',
    path: ['floodLevel'],
  }
);

export type DesignInput = z.infer<typeof DesignInputSchema>;

export const validateInput = (data: unknown) => {
  try {
    return {
      success: true,
      data: DesignInputSchema.parse(data),
      errors: [],
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.errors,
      };
    }
    throw error;
  }
};
