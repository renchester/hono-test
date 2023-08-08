import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
	DB: D1Database;
};

/**
 * GENERAL SETUP
 */

const app = new Hono<{ Bindings: Bindings }>();
const api = app.basePath('/api');

// OR
// const api = new Hono();
// app.route('/api', api);

app.use('', cors());

app.get('', (c) => c.text('Welcome to the API'));

api.get('', (c) => c.text('hello'));

api.get('/books', (c) => {
	return c.json({ books: 'books' });
});

api.get('/users', async (c) => {
	const { results } = await c.env.DB.prepare('SELECT * FROM Users').all();

	const json = JSON.stringify(results);

	return c.json(json);
});

api.post('/users', async (c) => {
	const { id, name, rank } = await c.req.parseBody();

	const sqlCommand = `INSERT INTO Users (id, name, rank) VALUES (${id}, ${name}, ${rank})`;

	try {
		const { success } = await c.env.DB.prepare(sqlCommand).run();

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
	} catch (error) {
		c.status(500);
		return c.json({
			error: 'Something went wrong',
		});
	}

	return c.text('congrats');
});

export default app;
