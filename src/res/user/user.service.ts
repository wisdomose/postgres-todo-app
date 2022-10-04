import { User } from "./user.model";
import { Op } from "sequelize";
import { v4 } from "uuid";

export async function genId(isKey: boolean = false) {
  let unique = false;
  let id = v4();

  while (!unique) {
    const user = !isKey
      ? await User.findByPk(id)
      : await User.findOne({
          where: {
            key: id,
          },
        });
    // if no user exists, the id is unique
    if (!user) {
      unique = true;
    }
    // user exists and id is not unique so generate new id
    else {
      id = v4();
    }
  }

  return id;
}

export async function emailTaken({
  email,
  id,
}: {
  email: string;
  id?: string;
}) {
  const u = id
    ? await User.findOne({
        where: {
          [Op.and]: [
            { email },
            {
              id: {
                [Op.ne]: id,
              },
            },
          ],
        },
      })
    : await User.findOne({
        where: { email },
      });
  return !!u;
}
