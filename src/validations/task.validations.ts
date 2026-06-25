import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string({ error: 'Title is required' })
    .min(1),
    description: z.string({ error: 'Description is required' })
    .min(1),
    status: z.enum(['Pending', 'In Progress', 'Done']).optional(),
    priority: z.enum(['Low', 'Medium', 'High']).optional(),
    dueDate: z.iso.datetime({ error: 'Invalid datetime format (use ISO 8601)' }),
    project: z.string({ error: 'Project ID is required' })
  })
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string()
    .min(1).optional(),
    description: z.string()
    .min(1).optional(),
    status: z.enum(['Pending', 'In Progress', 'Done']).optional(),
    priority: z.enum(['Low', 'Medium', 'High']).optional(),
    dueDate: z.iso.datetime().optional()
  }).refine(
    (obj) => Object.values(obj).some((value) => value !== undefined),
    {
      message: 'At least one field must be provided to update',
      path: ['title'] 
    }
  )
});

export const queryTaskSchema = z.object({
  query: z.object({
    status: z.enum(['Pending', 'In Progress', 'Done']).optional(),
    priority: z.enum(['Low', 'Medium', 'High']).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional()
  })
});