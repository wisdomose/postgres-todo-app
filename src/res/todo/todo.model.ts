import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  Model,
} from "sequelize";
import { sequelize } from "../../utils/db";
import { User } from "../user/user.model";

class Todo extends Model<InferAttributes<Todo>, InferCreationAttributes<Todo>> {
  declare id: string;
  declare todo: string;
  declare completed: CreationOptional<boolean>;
  declare userId: string;
}

Todo.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    todo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    userId: DataTypes.UUID,
  },
  {
    sequelize,
    modelName: "todo",
  }
);

// one-to-many association
User.hasMany(Todo);
Todo.belongsTo(User);

// (async () => await Todo.sync())();

export { Todo };
