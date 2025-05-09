import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters long",
  }),
});
