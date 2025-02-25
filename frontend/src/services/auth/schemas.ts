import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),

})


export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  role: z.string().nullable(), 
  posts_count: z.number(),
  followers_count: z.number(),
  following_count: z.number(),
});

// Infer the TypeScript type from the Zod schema
export type UserType = z.infer<typeof userSchema>; 

export type ResponseToken = {
    access_token : string,
    user: UserType,
}
// 

export type LoginSchemaType = z.infer<typeof loginSchema>


export const RegisterSchema = z.object({
    name: z.string().min(1, 'Name is required'), 
    email: z.string().email('Invalid email address'), 
    password: z.string().min(8, 'Password must be at least 8 characters'), 
    password_confirmation: z
      .string()
      .min(8, 'Password confirmation must be at least 8 characters'), 
    role: z.enum(['user', 'admin', 'content_creator']), 
  }).refine((data) => data.password === data.password_confirmation, {
    path: ['password_confirmation'], // Point the error to password_confirmation
    message: "Passwords don't match", // Custom error message for mismatch
  });



export type RegisterSchemaType = z.infer<typeof RegisterSchema>