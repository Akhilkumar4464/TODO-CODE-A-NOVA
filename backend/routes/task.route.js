import express from 'express';
import { getTasks, createTask, updateTask, deleteTask, reorderTasks } from '../controllers/task.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply authentication middleware to all task routes
router.use(authMiddleware);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/reorder', reorderTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
