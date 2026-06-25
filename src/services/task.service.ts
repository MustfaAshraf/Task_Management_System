import Task from '../models/task.model';
import Project from '../models/project.model';
import { createNotFoundError, createForbiddenError } from '../utils/api.errors';
import { ApiFeatures } from '../utils/api.features';

const verifyProjectOwnership = async (projectId: string, userId: string) => {
    const project = await Project.findOne({ _id: projectId, user: userId });
    if (!project) {
        throw createNotFoundError('Project not found or you do not have access to it');
    }
    return project;
};

export const createTask = async (userId: string, taskData: any) => {
    await verifyProjectOwnership(taskData.project, userId);

    const newTask = new Task({
        ...taskData,
        project: taskData.project
    });
    return await newTask.save();
};

export const getTasksByProject = async (userId: string, projectId: string, query: any) => {
    await verifyProjectOwnership(projectId, userId);

    let mongooseQuery = Task.find({ project: projectId });

    const features = new ApiFeatures(mongooseQuery, query)
        .filter()
        .sort()
        .paginate();

    const tasks = await features.mongooseQuery;

    const filterObj = { ...query };
    const excludedFields = ['page', 'sort', 'limit'];
    excludedFields.forEach(el => delete filterObj[el]);

    const totalTasks = await Task.countDocuments({ project: projectId, ...filterObj });
    const page = parseInt(query.page as string, 10) || 1;
    const limit = parseInt(query.limit as string, 10) || 10;

    return {
        tasks,
        pagination: {
            totalTasks,
            currentPage: page,
            totalPages: Math.ceil(totalTasks / limit),
            limit
        }
    };
};

export const getTaskById = async (taskId: string, userId: string) => {
    const task = await Task.findById(taskId).populate('project');
    if (!task) throw createNotFoundError('Task not found');

    const project = task.project as any;
    if (project.user.toString() !== userId) {
        throw createForbiddenError('You do not have access to this task');
    }

    return task;
};

export const updateTask = async (taskId: string, userId: string, updateData: any) => {
    const task = await getTaskById(taskId, userId);

    Object.assign(task, updateData);
    return await task.save();
};

export const deleteTask = async (taskId: string, userId: string) => {
    const task = await getTaskById(taskId, userId);
    await task.deleteOne();
    return task;
};