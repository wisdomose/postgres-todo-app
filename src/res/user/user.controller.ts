import { Request, Response } from "express";
import { pick, removeUndefined } from "../../utils/helpers";
import { Todo } from "../todo/todo.model";
import { User } from "./user.model";
import { emailTaken, genId } from "./user.service";
import { validate } from "uuid";
import { Create, Find, Login, Update } from "./user.schema";

// create an account
export async function createUser(
  req: Request<{}, {}, Create["body"]>,
  res: Response
) {
  try {
    const { email, password } = req.body;
    if (!email) throw new Error("No email");
    if (!password) throw new Error("No password");

    const taken = await emailTaken({ email });
    if (taken) throw new Error("This email is already in use");

    const user = await User.create({
      id: await genId(),
      key: await genId(true),
      email,
      password,
    });

    return res
      .status(200)
      .send(
        pick(user.toJSON(), ["email", "id", "key", "createdAt", "updatedAt"])
      );
  } catch (error: any) {
    return res.status(200).json({
      message: error?.message ?? "Something went wrong",
      code: error?.status ?? 400,
    });
  }
}

// login a user
export async function loginUser(
  req: Request<{}, {}, Login["body"]>,
  res: Response
) {
  try {
    const { email, password } = req.body;

    if (!email) throw new Error("No email");
    if (!password) throw new Error("No password");

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) throw new Error("Invalid login credentials");

    const validPassword = await user.validPassword(password);
    if (!validPassword) throw new Error("Invalid login credentials");

    return res.status(200).send(pick(user.toJSON(), ["email", "id", "key"]));
  } catch (error: any) {
    return res.status(200).json({
      message: error?.message ?? "Something went wrong",
      code: error?.status ?? 400,
    });
  }
}

// find a user
export async function findUser(
  req: Request<Find["params"], {}, {}>,
  res: Response
) {
  try {
    const { id } = req.params;
    if (!id) throw new Error("No id");

    // if id is not a valid uuid
    if (!validate(id)) throw new Error("Invalid id");

    const user = await User.findByPk(id);
    return res
      .status(200)
      .send(
        pick(user?.toJSON() ?? {}, ["email", "id", "createdAt", "updatedAt"])
      );
  } catch (error: any) {
    return res.status(200).json({
      message: error?.message ?? "Something went wrong",
      code: error?.status ?? 400,
    });
  }
}

// update
export async function updateUser(
  req: Request<{}, {}, Update["body"]>,
  res: Response
) {
  try {
    const { id } = res.locals.user;

    const { email, password } = req.body;

    const update = { email, password };
    removeUndefined(update);

    // check if email is unique
    if (email) {
      const taken = await emailTaken({ email, id });
      if (taken) throw new Error("This email is already in use");
    }

    const [a, user] = await User.update(update, {
      where: {
        id,
      },
      individualHooks: true,
      returning: true,
    });
    return res.status(200).send(pick(user[0].toJSON(), ["email", "id"]));
  } catch (error: any) {
    return res.status(200).json({
      message: error?.message ?? "Something went wrong",
      code: error?.status ?? 400,
    });
  }
}

// delete
export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = res.locals.user;

    // delete todos the user created
    await Todo.destroy({
      where: {
        userId: id,
      },
    });

    // delete user account
    await User.destroy({
      where: {
        id,
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
