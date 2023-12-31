import { Context, Next } from 'hono';
import { validator } from 'hono/validator';
import userSchema from '../schemas/UserSchema';

const userController = (() => {
	// app.get('/api/users')
	const get_users = async (c: Context) => {
		const { results } = await c.env.DB.prepare('SELECT * FROM Users').all();

		return c.json({ users: results, success: 'true' });
	};

	// app.post('/api/users')
	const create_user = [
		validator('json', (value, c) => {
			const parsed = userSchema.safeParse(value);

			if (!parsed.success) {
				return c.json({ error: 'Invalid schema' }, 400);
			}

			return parsed.data;
		}),

		async (c: Context) => {
			const { id, name, rank } = await c.req.json();

			const sqlCommand = `INSERT INTO Users (id, name, rank) VALUES ("${id}", "${name}", "${rank}")`;

			try {
				const { success } = await c.env.DB.prepare(sqlCommand).run();

				if (success) {
					return c.json({ success: true }, 201);
				}
			} catch (error) {
				return c.json({ error: 'Something went wrong' }, 500);
			}
		},
	];

	const update_rank = async (c: Context) => {
		const { id } = c.req.param();
		const { rank } = await c.req.parseBody();

		const sqlCommand = `UPDATE Users SET rank = ${rank} WHERE id = ?`;

		const { success } = await c.env.DB.prepare(sqlCommand).bind(id).run();

		if (success) {
			c.status(201);
			return c.json({
				success: true,
			});
		} else {
			c.status(400);
			return c.json({
				error: 'Something went wrong',
			});
		}
	};

	const update_name = async (c: Context) => {
		const { id } = c.req.param();
		const { name } = await c.req.parseBody();

		const sqlCommand = `UPDATE Users SET name = ${name} WHERE id = ?`;

		const { success } = await c.env.DB.prepare(sqlCommand).bind(id).run();

		if (success) {
			c.status(201);
			return c.json({
				success: true,
			});
		} else {
			c.status(400);
			return c.json({
				error: 'Something went wrong',
			});
		}
	};

	const delete_user = async (c: Context) => {
		const { id } = c.req.param();

		const sqlCommand = `DELETE FROM Users WHERE id = ?`;

		const { success } = await c.env.DB.prepare(sqlCommand).bind(id).run();

		if (success) {
			c.status(201);
			return c.json({
				success: true,
			});
		} else {
			c.status(400);
			return c.json({
				error: 'Something went wrong',
			});
		}
	};

	const get_user_by_id = async (c: Context) => {
		const { id } = c.req.param();

		const sqlCommand = `SELECT * FROM Users WHERE id = ?`;

		const user = await c.env.DB.prepare(sqlCommand).bind(id).first();

		if (user) {
			return c.json({ user, success: 'true' }, 200);
		} else {
			return c.json({ error: 'Unable to find user' }, 404);
		}
	};

	return {
		get_users,
		create_user,
		update_rank,
		update_name,
		delete_user,
		get_user_by_id,
	};
})();

export default userController;
