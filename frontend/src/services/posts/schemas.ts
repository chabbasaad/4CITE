
import { z } from "zod";

export const postSchema = z.object({
    title: z.string().min(1).max(255),
    content: z.string().min(1),
    media: z.array(z.instanceof(File)).optional(),
  });
  
 export type PostSchemaType = z.infer<typeof postSchema>;