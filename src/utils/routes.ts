import { Application, Request, Response } from "express";
import { todoRoutes } from "../res/todo/todo.routes";
import { userRoutes } from "../res/user/user.routes";

export function routes(app: Application) {
  app.use("/todos", todoRoutes());
  app.use("/users", userRoutes());
  app.use("/health", (req: Request, res: Response) =>
    res.status(200).send("server running")
  );
}
