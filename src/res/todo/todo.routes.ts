import { Router } from "express";
import { protectedRoute } from "../../middlewares/protected";
import { schemaValidator } from "../../middlewares/validator";
import {
  createTodo,
  deleteTodo,
  getAll,
  getOne,
  updateTodo,
} from "./todo.controller";
import {
  create,
  deleteOne,
  getAllSchema,
  getOneSchema,
  update,
} from "./todo.schema";

export function todoRoutes() {
  const router = Router();

  // create a todo
  router.post("/", schemaValidator(create), protectedRoute, createTodo);

  // get all todos
  router.get("/", schemaValidator(getAllSchema), protectedRoute, getAll);

  // get a todo
  router.get("/:id", schemaValidator(getOneSchema), protectedRoute, getOne);

  // update a todo
  router.post("/:id", schemaValidator(update), protectedRoute, updateTodo);

  // delete a todo
  router.delete("/:id", schemaValidator(deleteOne), protectedRoute, deleteTodo);

  return router;
}
