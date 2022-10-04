import { NextFunction, Request, Response } from "express";
import { User } from "../res/user/user.model";
import { validate } from "uuid";

export async function protectedRoute(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { key } = req.query;
    if (!key) throw new Error("No API key");

    if (!validate(key as string)) throw new Error("Invalid API key");

    const user = await User.findOne({
      where: {
        key: key as string,
      },
    });
    if (!user) throw new Error("Invalid key");
    res.locals.user = user.toJSON();

    next();
  } catch (error: any) {
    return res.status(200).json({
      message: error?.message ?? "Something went wrong",
      code: error?.status ?? 400,
    });
  }
}
