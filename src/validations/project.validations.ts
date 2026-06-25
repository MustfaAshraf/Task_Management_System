import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string({ message: 'Title is required' })
    .min(1, 'Title cannot be empty'),
    description: z.string({ message: 'Description is required' })
    .min(1, 'Description cannot be empty'),
    status: z.enum(['Active', 'Completed', 'Archived']).optional()
  })
});

export const updateProjectSchema = z.object({
  body: z.object({
    title: z.string()
    .min(1, 'Title cannot be empty').optional(),
    description: z.string()
    .min(1, 'Description cannot be empty').optional(),
    status: z.enum(['Active', 'Completed', 'Archived']).optional()
  }).refine(
    (obj) => Object.values(obj).some((value) => value !== undefined),
    {
      message: 'At least one field must be provided to update',
      path: ['title'] 
    }
  )
});