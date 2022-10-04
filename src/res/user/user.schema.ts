import { z } from "zod";
const key = z.string({ required_error: "No API key" });

export const create = z.object({
  body: z.object({
    email: z.string({ required_error: "No email" }).email("Invalid email"),
    password: z.string({ required_error: "No password" }),
  }),
});

export const login = z.object({
  body: z.object({
    email: z.string({ required_error: "No email" }).email("Invalid email"),
    password: z.string({ required_error: "No password" }),
  }),
});

export const find = z.object({
  params: z.object({
    id: z.string({ required_error: "No id" }),
  }),
});

export const update = z.object({
  query: z.object({ key }),
  body: z.object({
    email: z
      .string({ required_error: "No email" })
      .email("Invalid email")
      .optional(),
    password: z.string({ required_error: "No password" }).optional(),
  }),
});

export const del = z.object({
  query: z.object({ key }),
});

export type Create = z.infer<typeof create>;
export type Login = z.infer<typeof login>;
export type Find = z.infer<typeof find>;
export type Update = z.infer<typeof update>;
export type Del = z.infer<typeof del>;
