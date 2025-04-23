import users from "../Models/User.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    const { email, password } = req.body;

  try {
    const user = await users.findOne({ email });
    const token = jwt.sign({ userId: user?._id }, process.env.JWT_SECRET);

    if (!user) {
      return res.status(200).json({ message: "user not exist" });
    }

      if (user.email == email && user.password == password) {
    console.log(user);
      return res
        .status(200)
        .json({ message: "user verified", token: token, user: user });
    } else {
      return res.status(200).json({ message: "user not verified" });
    }
  } catch (error) {
    return res.status(500).json({ message: "something went wrong..." });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {

    const userWithEmail = await users.findOne({ email });
    if (userWithEmail) {
      return res
        .status(409)
        .json({ message: "User already registered with this email" });
    }

    const user = await users.create({name, email, password });
    const token = jwt.sign({ userId: user?._id }, process.env.JWT_SECRET);


    return res
      .status(201)
      .json({ message: "User created", token: token, user: user });
  } catch (error) {
    console.error("Something went wrong:", error);
    return res.status(500).json({ message: "Something went wrong..." });
  }
};

export const getUsers = async (req, res) => {
  try {
    const allUsers = await users.find({});
    return res.status(200).json(allUsers);
  } catch (error) {
    console.error("Fetch users error:", error);
    return res.status(500).json({ message: "Something went wrong..." });
  }
};

