import { Hono } from 'hono';
import userController from '../controllers/userController';

const api = new Hono();

api.get('', (c) => c.text('hello'));

api.get('/users', userController.get_users);

api.get('/users/:id', userController.get_user_by_id);

api.post('/users', ...userController.create_user);

api.patch('/users/:id/rank', userController.update_rank);

api.patch('/users/:id/name', userController.update_name);

api.delete('/users/:id', userController.delete_user);

export default api;
