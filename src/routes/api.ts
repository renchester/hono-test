import { Hono } from 'hono';
import userController from '../controllers/userController';
import { validator } from 'hono/validator';
import AccountSchema from '../schemas/AccountSchema';

type Bindings = {
	DB: D1Database;
};

const api = new Hono<{ Bindings: Bindings }>();

api.get('', (c) => c.text('hello'));

// USER ROUTES

api.get('/users', userController.get_users);

api.get('/users/:id', userController.get_user_by_id);

api.post('/users', ...userController.create_user);

api.patch('/users/:id/rank', userController.update_rank);

api.patch('/users/:id/name', userController.update_name);

api.delete('/users/:id', userController.delete_user);

// ACCOUNT ROUTES

api.get('/accounts', async (c) => {
	const { results } = await c.env.DB.prepare('SELECT * FROM Accounts').all();

	return c.json({ accounts: results }, 200);
});

api.post(
	'/accounts',
	validator('json', (value, c) => {
		const parsed = AccountSchema.safeParse(value);

		if (!parsed.success) {
			return c.json({ error: 'Invalid schema' }, 400);
		}

		return parsed.data;
	}),
	async (c) => {
		const { id, account_number, is_rich } = await c.req.json();

		const sqlCommand = `INSERT INTO Accounts (id, account_number, is_rich) VALUES ("${id}", "${account_number}", "${is_rich}")`;

		try {
			const { success } = await c.env.DB.prepare(sqlCommand).run();

			if (success) return c.json({ success: true }, 201);
		} catch (error) {
			return c.json({ error: 'Something went wrong' }, 500);
		}
	}
);

export default api;
