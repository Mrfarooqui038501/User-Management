import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./User.js";

export const Follower = sequelize.define("Follower", {}, { tableName: "Followers" });

User.belongsToMany(User, { through: Follower, as: "Followers", foreignKey: "following_id" });
User.belongsToMany(User, { through: Follower, as: "Following", foreignKey: "follower_id" });
