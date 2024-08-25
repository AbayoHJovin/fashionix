const User = require("../model/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signupUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      throw new Error("Missing credentials");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    const saveUser = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });
    res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.header("Authorization",  token).json({
      message: "Logged in successfully",
      token:token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};


exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.find();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

// Update user details
// exports.updateUserDetails = async (req, res) => {
//   const userId = req.user._id; // assuming user ID is available in req.user
//   const { name, email, profilePicture } = req.body;
//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     user.username = name || user.username;
//     user.email = email || user.email;
//     user.profilePicture = profilePicture || user.profilePicture;

//     await user.save();

//     res.status(200).json({ success: true, message: "User updated successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message || "Internal server error" });
//   }
// };



exports.updateUserDetails = async (req, res) => {
  const userId = req.query.userId; 
  const { name, email, profilePicture } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = name || user.username;
    user.email = email || user.email;
    user.profilePicture = profilePicture || user.profilePicture;

    await user.save();

    res.status(200).json({ success: true, message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};
