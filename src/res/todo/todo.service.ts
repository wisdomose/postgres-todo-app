import { v4 } from "uuid";
import { Todo } from "./todo.model";

export async function genId() {
  let unique = false;
  let id = v4();

  while (!unique) {
    const todo = await Todo.findByPk(id);
    // if no todo exists, the id is unique
    if (!todo) {
      unique = true;
    }
    // todo exists and id is not unique so generate new id
    else {
      id = v4();
    }
  }

  return id;
}
