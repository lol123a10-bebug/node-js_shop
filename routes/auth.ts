import { Router, Request } from "express";
import { userModel } from "../models";
import { AES } from "crypto-js";

export const authRoute = Router();

interface RegisterRequest extends Request {
  body: {
    username: string;
    email: string;
    password: string;
  };
}

authRoute.post("/register", async (req: RegisterRequest, res) => {
  const { username, email, password } = req.body;

  const encryptedPassword = AES.encrypt(
    password,
    process.env.PASS_SECRET!
  ).toString();

  const newUser = new userModel({
    username,
    email,
    password: encryptedPassword,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

export interface LoginRequest extends Request {
  body: {
    username: string;
    password: string;
  };
}

authRoute.post("/login", async (req: LoginRequest, res) => {
  try {
    const { username, password } = req.body;

    const user = await userModel.findOne({ username });

    if (!user) {
      return res.status(401).json("Wrong credentials");
    }

    const decryptedPassword = AES.decrypt(
      user.password,
      process.env.PASS_SECRET!
    ).toString(CryptoJS.enc.Utf8);

    if (decryptedPassword !== password) {
      return res.status(401).send("Wrong password");
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});
