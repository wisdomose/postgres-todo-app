import { sequelize } from "../../utils/db";
import {
  DataTypes,
  CreationOptional,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { hash, compare } from "bcrypt";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: string;
  declare email: string;
  declare password: string;
  declare key: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // verify the password is correct
  async validPassword(password: string) {
    return await compare(password, this.password);
  }
}

User.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    key: {
      type: DataTypes.UUID,
      unique: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "user",
  }
);

async function hashPwd(password: string) {
  return await hash(password, Number(process.env.SALT ?? "10"));
}

// hash the password before saving
User.beforeCreate(async (user, options) => {
  user.password = await hashPwd(user.password);
});

// hash password on update
User.beforeUpdate(async (user, options) => {
  // password was changed
  if (user.previous("password") !== user.getDataValue("password")) {
    user.password = await hashPwd(user.password);
  }
});

// (async () => await User.sync())();

export { User };
