import { Response } from 'express';
import * as taskService from '../services/task.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { createResponse, successResponse, noContentResponse } from '../utils/api.response';
import { asyncHandler } from '../utils/async.handler';

export const createTask = asyncHandler(async (req: AuthRequest, res: Response) => {
    const task = await taskService.createTask(req.user!.id, req.body);
    const response = createResponse(task, 'Task created successfully');
    res.status(response.statusCode).json(response);
});

export const getProjectTasks = asyncHandler(async (req: AuthRequest, res: Response) => {
    const projectId = req.params.projectId as string;
    const data = await taskService.getTasksByProject(req.user!.id, projectId, req.query);

    const response = successResponse(data, 'Tasks retrieved successfully');
    res.status(response.statusCode).json(response);
});

export const getTask = asyncHandler(async (req: AuthRequest, res: Response) => {
    const task = await taskService.getTaskById(req.params.id as string, req.user!.id);
    const response = successResponse(task, 'Task retrieved successfully');
    res.status(response.statusCode).json(response);
});

export const updateTask = asyncHandler(async (req: AuthRequest, res: Response) => {
    const task = await taskService.updateTask(req.params.id as string, req.user!.id, req.body);
    const response = successResponse(task, 'Task updated successfully');
    res.status(response.statusCode).json(response);
});

export const deleteTask = asyncHandler(async (req: AuthRequest, res: Response) => {
    await taskService.deleteTask(req.params.id as string, req.user!.id);
    const response = noContentResponse('Task deleted successfully');
    res.status(response.statusCode).json(response);
});