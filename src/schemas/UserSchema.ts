import { z } from 'zod';

const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	rank: z.number(),
});

export type User = z.infer<typeof userSchema>;

export default userSchema;
