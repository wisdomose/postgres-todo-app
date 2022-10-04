import { Request, Response } from "express";
import { User } from "../user/user.model";
import { Todo } from "./todo.model";
import { Op } from "sequelize";
import { pick, removeUndefined } from "../../utils/helpers";
import { genId } from "./todo.service";
import { validate } from "uuid";
import { Create, DeleteOne, GetOne, Update } from "./todo.schema";

// create todo
export async function createTodo(
  req: Request<{}, {}, Create["body"]>,
  res: Response
) {
  try {
    const { description } = req.body;

    const user = res.locals.user;

    if (!user) throw new Error("Invalid API key");

    if (!description) throw new Error("No description found");

    const todo = await Todo.create({
      id: await genId(),
      todo: description,
      userId: user.id,
    });

    return res.status(200).send(todo);
  } catch (error: any) {
    return res.status(200).json({
      message: error?.message ?? "Something went wrong",
      code: error?.status ?? 400,
    });
  }
}

// get all todos
// todo implement pagination
export async function getAll(req: Request, res: Response) {
  const user: User = res.locals.user;

  try {
    const todos = await Todo.findAll({
      where: {
        userId: user.id,
      },
      attributes: {
        exclude: ["userId"],
      },
    });

    return res.status(200).send({ todos, owner: pick(user, ["email", "id"]) });
  } catch (error: any) {
    return res.status(200).json({
      message: error?.message ?? "Something went wrong",
      code: error?.status ?? 400,
    });
  }
}

// get a todo
export async function getOne(req: Request<GetOne["params"]>, res: Response) {
  try {
    const { id } = req.params;
    if (!id) throw new Error("No id");

    if (!validate(id)) throw new Error("Invalid id");

    const user = res.locals.user;

    const todo = await Todo.findOne({
      where: {
        [Op.and]: [{ id }, { userId: user.id }],
      },
      attributes: {
        exclude: ["userId"],
      },
      include: { model: User, attributes: ["id", "email"] },
    });

    if (!todo) {
      throw new Error("No todo found");
    }

    return res.status(200).send(todo);
  } catch (error: any) {
    return res.status(200).json({
      message: error?.message ?? "Something went wrong",
      code: error?.status ?? 400,
    });
  }
}

// todo delete all todos
// delete a todo
export async function deleteTodo(
  req: Request<DeleteOne["params"]>,
  res: Response
) {
  try {
    const user = res.locals.user;
    const { id } = req.params;
    if (!id) throw new Error("No id");

    if (!validate(id)) throw new Error("Invalid id");

    await Todo.destroy({
      where: {
        [Op.and]: [{ id }, { userId: user.id }],
      },
    });

    return res.status(200).end();
  } catch (error: any) {
    return res.status(200).json({
      message: error?.message ?? "Something went wrong",
      code: error?.status ?? 400,
    });
  }
}

// update a todo
export async function updateTodo(
  req: Request<Update["params"], {}, Update["body"]>,
  res: Response
) {
  try {
    const user: User = res.locals.user;
    const { id } = req.params;
    const { description, completed } = req.body;
    const update: Record<string, any> = { todo: description, completed };

    removeUndefined(update);

    if (!id) throw new Error("No id");

    if (!validate(id)) throw new Error("Invalid id");

    const todo = await Todo.update(update, {
      where: {
        [Op.and]: [{ id }, { userId: user.id }],
      },
      fields: ["todo", "completed"],
      returning: true,
    });

    return res.status(200).send(todo[1][0]);
  } catch (error: any) {
    return res.status(200).json({
      message: error?.message ?? "Something went wrong",
      code: error?.status ?? 400,
    });
  }
}
