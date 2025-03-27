import {z} from 'zod';

const passwordSchema = z
  .string()
  .min(6, { message: 'Password must be at least 6 characters' })
  .refine(val => /[A-Z]/.test(val), { message: 'Password must contain at least one uppercase letter' })
  .refine(val => /\d/.test(val), { message: 'Password must contain at least one digit' })
  .refine(val => /[a-z]/.test(val), { message: 'Password must contain at least one lowercase letter' });

export const formLoginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export const formRegisterSchema = formLoginSchema.merge(z.object({
    username: z.string()
    .min(2, { message: 'Username must be at least 2 characters' })
    .max(20, { message: 'Username must be at most 20 characters' }),
    repeatPassword: passwordSchema,
})).refine(data => data.password === data.repeatPassword, { message: 'Passwords do not match', path: ['repeatPassword'] });

export const formUpdateSchema = z.object({ 
    email: z.string().email({ message: 'Invalid email address' }),
    username: z.string()
    .min(2, { message: 'Username must be at least 2 characters' })
    .max(20, { message: 'Username must be at most 20 characters' }),
    bio: z.string().max(400, { message: 'Bio must be at most 400 characters' }).optional(),
});

export const resetPasswordEmail = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
})

export const resetPasswordSchema = z.object({ 
    password: passwordSchema,
    repeatPassword: passwordSchema,
}).refine(data => data.password === data.repeatPassword, { message: 'Passwords do not match', path: ['repeatPassword'] });

export type FormLogin = z.infer<typeof formLoginSchema>;
export type FormRegister = z.infer<typeof formRegisterSchema>;
export type FormUpdate = z.infer<typeof formUpdateSchema>;

export type ResetPasswordEmail = z.infer<typeof resetPasswordEmail>;
export type ResetPassword = z.infer<typeof resetPasswordSchema>;