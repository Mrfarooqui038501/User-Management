import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
} from "../controllers/userController.js";

const router = express.Router();

// Follow / Unfollow routes first
router.post("/follow", followUser);
router.post("/unfollow", unfollowUser);

// CRUD routes
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
