import { z } from 'zod';

const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	rank: z
		.string()
		.transform((v) => parseInt(v))
		.refine((v) => !isNaN(v), { message: 'Not a number' }),
});

export type User = z.infer<typeof userSchema>;

export default userSchema;
