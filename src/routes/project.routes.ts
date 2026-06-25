import { Router } from 'express';
import * as projectController from '../controllers/project.controller';
import { authorize, protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createProjectSchema, updateProjectSchema } from '../validations/project.validations';

const router = Router();

router.use(protect);

router.post('/', validate(createProjectSchema), projectController.createProject);
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProject);
router.patch('/:id', validate(updateProjectSchema), projectController.updateProject);
router.delete('/:id', authorize("Admin"), projectController.deleteProject);

export default router;