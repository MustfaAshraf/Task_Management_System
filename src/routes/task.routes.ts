import { Router } from 'express';
import * as taskController from '../controllers/task.controller';
import { authorize, protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createTaskSchema, updateTaskSchema, queryTaskSchema } from '../validations/task.validations';

const router = Router();

router.use(protect);

router.post('/', validate(createTaskSchema), taskController.createTask);
router.get('/project/:projectId', validate(queryTaskSchema), taskController.getProjectTasks);
router.get('/:id', taskController.getTask);
router.patch('/:id', validate(updateTaskSchema), taskController.updateTask);
router.delete('/:id', authorize("Admin"), taskController.deleteTask);

export default router;