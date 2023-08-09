import { z } from 'zod';

const AccountSchema = z.object({
	id: z.number().int(),
	account_number: z.number().int(),
	is_rich: z.boolean(),
});

export type Account = z.infer<typeof AccountSchema>;

export default AccountSchema;
