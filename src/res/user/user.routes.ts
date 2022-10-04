import { Router } from "express";
import { protectedRoute } from "../../middlewares/protected";
import { schemaValidator } from "../../middlewares/validator";
import {
  createUser,
  deleteUser,
  findUser,
  loginUser,
  updateUser,
} from "./user.controller";
import { create, del, find, login, update } from "./user.schema";

export function userRoutes() {
  const router = Router();

  // create a new user
  router.post("/create", schemaValidator(create), createUser);

  // login user
  router.post("/login", schemaValidator(login), loginUser);

  // todo find all users
  router.get("/", schemaValidator(find), () => {});

  // find a user
  router.get("/:id", schemaValidator(find), findUser);

  // update user
  router.post("/update", schemaValidator(update), protectedRoute, updateUser);

  // delete user
  router.delete("/", schemaValidator(del), protectedRoute, deleteUser);

  return router;
}
