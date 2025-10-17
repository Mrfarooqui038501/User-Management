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
    console.log("📥 Received user data:", req.body);

    const { name, email, phone, dob, image_url } = req.body;

    // Validation
    if (!name || !email || !phone || !dob) {
      return res.status(400).json({ 
        message: "All fields are required",
        missing: {
          name: !name,
          email: !email,
          phone: !phone,
          dob: !dob
        }
      });
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      dob,
      image_url: image_url || null
    };

    const user = await User.create(userData);
    console.log("✅ User created successfully:", user.id);
    
    res.status(201).json({
      message: "User created successfully",
      user
    });
  } catch (err) {
    console.error("❌ Create user error:", err);
    
    
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: "Validation error",
        errors: err.errors.map(e => ({
          field: e.path,
          message: e.message
        }))
      });
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        message: "Email or phone already exists"
      });
    }

    res.status(500).json({ 
      message: "Failed to create user",
      error: err.message 
    });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    await user.update(req.body);
    console.log("✅ User updated:", user.id);
    
    res.json({
      message: "User updated successfully",
      user
    });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(400).json({ message: err.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    await user.destroy();
    console.log("✅ User deleted:", req.params.id);
    
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Follow a user
export const followUser = async (req, res) => {
  try {
    const { followerId, followingId } = req.body;
    
    if (followerId === followingId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }
    
    const follower = await User.findByPk(followerId);
    const following = await User.findByPk(followingId);
    
    if (!follower || !following) {
      return res.status(404).json({ message: "User not found" });
    }

    const [record, created] = await Follower.findOrCreate({ 
      where: { follower_id: followerId, following_id: followingId } 
    });

    if (!created) {
      return res.status(400).json({ message: "Already following this user" });
    }

    res.json({ message: `${follower.name} is now following ${following.name}` });
  } catch (err) {
    console.error("Follow user error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  try {
    const { followerId, followingId } = req.body;

    const record = await Follower.findOne({ 
      where: { follower_id: followerId, following_id: followingId } 
    });
    
    if (!record) {
      return res.status(404).json({ message: "Follow relationship not found" });
    }

    await record.destroy();
    res.json({ message: "Unfollowed successfully" });
  } catch (err) {
    console.error("Unfollow user error:", err);
    res.status(500).json({ message: err.message });
  }
};