import { z } from "zod";
const key = z.string({ required_error: "No API key" });
export const create = z.object({
  body: z.object({
    description: z.string({ required_error: "No description found" }),
  }),
  query: z.object({ key }),
});

export const getAllSchema = z.object({
  query: z.object({ key }),
});

export const getOneSchema = z.object({
  query: z.object({ key }),
  params: z.object({
    id: z.string({ required_error: "No id" }),
  }),
});

export const deleteOne = z.object({
  query: z.object({ key }),
  params: z.object({
    id: z.string({ required_error: "No id" }),
  }),
});

export const update = z.object({
  query: z.object({ key }),
  params: z.object({
    id: z.string({ required_error: "No id" }),
  }),
  body: z.object({
    description: z.string().optional(),
    completed: z.boolean().optional(),
  }),
});

export type Create = z.infer<typeof create>;
export type GetOne = z.infer<typeof getOneSchema>;
export type GetAll = z.infer<typeof getAllSchema>;
export type DeleteOne = z.infer<typeof deleteOne>;
export type Update = z.infer<typeof update>;
