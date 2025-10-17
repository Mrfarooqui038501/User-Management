import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./User.js";

export const Follower = sequelize.define("Follower", {
  follower_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  following_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
});

// Self-referencing associations
User.belongsToMany(User, {
  through: Follower,
  as: "Followers",
  foreignKey: "following_id",
  otherKey: "follower_id",
});

User.belongsToMany(User, {
  through: Follower,
  as: "Following",
  foreignKey: "follower_id",
  otherKey: "following_id",
});
