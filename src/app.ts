import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes'
import projectRoutes from './routes/project.routes';
import taskRoutes from './routes/task.routes';
import { errorHandler, notFound } from './middlewares/error.handler.middleware';

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(helmet()); 

app.get('/', (req, res) => {
  res.send('Welcome to our Project & Task Management System');
});

app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;