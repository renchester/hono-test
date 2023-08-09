import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import api from './routes/api';

type Bindings = {
	DB: D1Database;
};

/**
 * ===== GENERAL SETUP =====
 */

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors()); // temporary, edit cors later

app.use('*', logger());

app.get('', (c) => c.text('Welcome to the ClubsAll API'));

/**
 * ===== ROUTES =====
 */

app.route('/api', api);

/**
 * ===== ERROR HANDLERS =====
 */

// Log the error
app.onError((err, c) => {
	console.error(`Error ${err.message}`);
	console.error(err.stack);
	return c.json({ error: '500 - Internal Server Error' }, 500);
});

// Not Found
app.notFound((c) => {
	return c.json({ error: '404 - Invalid Path' }, 404);
});

export default app;
