import { z } from 'zod';

export const DesignInputSchema = z.object({
  discharge: z.number().min(1, 'Discharge must be > 0').max(1000, 'Discharge must be < 1000'),
  floodLevel: z.number(),
  bedLevel: z.number(),
  bedSlope: z.number().min(0.0001).max(0.01),
  span: z.number().min(5, 'Span must be >= 5m').max(100, 'Span must be <= 100m'),
  width: z.number().min(2, 'Width must be >= 2m').max(50, 'Width must be <= 50m'),
  lanes: z.number().min(1).max(4),
  concreteGrade: z.enum(['M20', 'M25', 'M30', 'M35', 'M40']),
  steelGrade: z.enum(['Fe415', 'Fe500']),
  sbcSoil: z.number().min(50).max(500),
});

export type DesignInputType = z.infer<typeof DesignInputSchema>;
