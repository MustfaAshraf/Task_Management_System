import Project, { IProject } from '../models/project.model';
import { createNotFoundError } from '../utils/api.errors';
import { ApiFeatures } from '../utils/api.features';

export const createProject = async (userId: string, projectData: Partial<IProject>) => {
    const newProject = new Project({
        ...projectData,
        user: userId
    });
    return await newProject.save();
};

export const getProjectsByUser = async (userId: string, query: any) => {
    let mongooseQuery = Project.find({ user: userId });

    const features = new ApiFeatures(mongooseQuery, query)
        .filter()
        .sort()
        .paginate();

    const projects = await features.mongooseQuery;

    const filterObj = { ...query };
    const excludedFields = ['page', 'sort', 'limit'];
    excludedFields.forEach(el => delete filterObj[el]);

    const totalProjects = await Project.countDocuments({ user: userId, ...filterObj });
    const page = parseInt(query.page as string, 10) || 1;
    const limit = parseInt(query.limit as string, 10) || 10;

    return {
        projects,
        pagination: {
            totalProjects,
            currentPage: page,
            totalPages: Math.ceil(totalProjects / limit),
            limit
        }
    };
};

export const getProjectById = async (projectId: string, userId: string) => {
    const project = await Project.findOne({ _id: projectId, user: userId });
    if (!project) {
        throw createNotFoundError('Project not found or you do not have permission to view it');
    }
    return project;
};

export const updateProject = async (projectId: string, userId: string, updateData: Partial<IProject>) => {
    const project = await Project.findOneAndUpdate(
        { _id: projectId, user: userId },
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!project) {
        throw createNotFoundError('Project not found or you do not have permission to update it');
    }
    return project;
};

export const deleteProject = async (projectId: string, userId: string) => {
    const project = await Project.findOneAndDelete({ _id: projectId, user: userId });

    if (!project) {
        throw createNotFoundError('Project not found or you do not have permission to delete it');
    }
    return project;
};