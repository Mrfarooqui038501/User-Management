import { User } from "../models/User.js";
import { Follower } from "../models/Follower.js";




// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        { model: User, as: "Followers", attributes: ["id", "name"] },
        { model: User, as: "Following", attributes: ["id", "name"] },
      ],
    });
    res.json(users);
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        { model: User, as: "Followers", attributes: ["id", "name"] },
        { model: User, as: "Following", attributes: ["id", "name"] },
      ],
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Get user by ID error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Create user
export const createUser = async (req, res) => {
  try {
    const { name, email, phone, dob, image_url } = req.body;

    if (!name || !email || !phone || !dob) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({ name, email, phone, dob, image_url });
    res.status(201).json({ message: "User created", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create user", error: err.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await user.update(req.body);
    res.json({ message: "User updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await user.destroy();
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Follow a user
export const followUser = async (req, res) => {
  try {
    const followerId = req.body.followerId || req.body.follower_id;
    const followingId = req.body.followingId || req.body.following_id;

    if (!followerId || !followingId) return res.status(400).json({ message: "followerId and followingId required" });
    if (parseInt(followerId) === parseInt(followingId)) return res.status(400).json({ message: "Cannot follow yourself" });

    const follower = await User.findByPk(followerId);
    const following = await User.findByPk(followingId);
    if (!follower || !following) return res.status(404).json({ message: "User not found" });

    const exists = await Follower.findOne({ where: { follower_id: followerId, following_id: followingId } });
    if (exists) return res.status(400).json({ message: "Already following" });

    await Follower.create({ follower_id: followerId, following_id: followingId });
    res.status(200).json({ message: `${follower.name} is now following ${following.name}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  try {
    const followerId = req.body.followerId || req.body.follower_id;
    const followingId = req.body.followingId || req.body.following_id;

    if (!followerId || !followingId) return res.status(400).json({ message: "followerId and followingId required" });

    const record = await Follower.findOne({ where: { follower_id: followerId, following_id: followingId } });
    if (!record) return res.status(404).json({ message: "Follow relationship not found" });

    await record.destroy();
    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
