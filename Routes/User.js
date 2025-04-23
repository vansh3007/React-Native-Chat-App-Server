import express from "express";
import { createUser, getUsers, login } from "../Controller/User.js";
const router = express.Router();

router.post("/login", login);
router.post("/create-user", createUser);
router.get("/get-users", getUsers);

export default router;
