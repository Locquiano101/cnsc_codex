// controllers/userController.js
import { Users } from "../../models/users.js";
// Create a new users
export const CreateNewUser = async (req, res) => {
  try {
    const { username, password, position, delivery_unit, organization } =
      req.body;

    if (!username || !password || !position) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    const newUser = new Users({
      username,
      password,
      position,
      organization,
      delivery_unit,
    });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("organization");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id).populate("organization");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await Users.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await Users.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
