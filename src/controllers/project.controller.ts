import { Response, NextFunction } from 'express';
import * as projectService from '../services/project.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { createResponse, successResponse, noContentResponse } from '../utils/api.response';
import { asyncHandler } from '../utils/async.handler';

export const createProject = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.user!.id;
  const project = await projectService.createProject(userId, req.body);

  const response = createResponse(project, 'Project created successfully');
  res.status(response.statusCode).json(response);
})

export const getProjects = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.user!.id;
  const projects = await projectService.getProjectsByUser(userId, req.query);

  const response = successResponse(projects, 'Projects retrieved successfully');
  res.status(response.statusCode).json(response);
})

export const getProject = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.user!.id;
  const projectId = req.params.id;

  const project = await projectService.getProjectById(projectId as string, userId);

  const response = successResponse(project, 'Project retrieved successfully');
  res.status(response.statusCode).json(response);
})

export const updateProject = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.user!.id;
  const projectId = req.params.id;

  const project = await projectService.updateProject(projectId as string, userId, req.body);

  const response = successResponse(project, 'Project updated successfully');
  res.status(response.statusCode).json(response);
})

export const deleteProject = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.user!.id;
  const projectId = req.params.id;

  await projectService.deleteProject(projectId as string, userId);

  const response = noContentResponse('Project deleted successfully');
  res.status(response.statusCode).json(response);
})