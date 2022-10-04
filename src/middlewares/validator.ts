import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";

export function schemaValidator<T extends ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        query: req.query,
        params: req.params,
        body: req.body,
      });
      next();
    } catch (e: any) {
      const msg = (e?.issues ?? [])[0].message;
      return res.status(200).send({ message: msg ?? e.message, code: 400 });
    }
  };
}
