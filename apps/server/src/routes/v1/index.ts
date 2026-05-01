import { Router } from "express";
import { adminRouter } from "./admin.js";
import { spaceRouter } from "./space.js";
import { userRouter } from "./user.js";
import { SignupSchema } from "../../types/index.js";
import {client} from "@repo/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../../config.js";
import  {Role } from "@repo/db";

export const router: Router = Router();

router.get("/", (req, res) => {
  res.json({
    message: "Hello from metaverse",
  });
});

router.post("/signup", async (req, res) => {
  const parsedData = SignupSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Validation failed",
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);

  try {
    const user = await client.user.create({
      data: {
        username: parsedData.data.username,
        password: hashedPassword,
        role: parsedData.data.type == "admin" ? Role.Admin : Role.User,
      },
    });

    res.json({
      userId: user.id,
    });
  } catch (e) {
    res.status(400).json({
      message: "User already exists",
    });
    return;
  }
});

router.post("/signin", async (req, res) => {
  const parsedData = SignupSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(403).json({
      message: "Validation failed",
    });
    return;
  }

  try {
    const user = await client.user.findUnique({
      where: {
        username: parsedData.data.username,
      },
    });

    if (!user) {
      res.status(403).json({
        message: "User not found",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      parsedData.data.password,
      user.password,
    );

    if (!isPasswordValid) {
      res.status(403).json({
        message: "Invalid password",
      });
      return;
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      JWT_PASSWORD,
      {
        expiresIn: "7d",
      },
    );

    res.json({
      token: token,
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/elements", (req, res) => {
  res.json({
    message: "Elements",
  });
});

router.get("/avatars", (req, res) => {
  res.json({
    message: "Avatars",
  });
});

router.use("/user", userRouter);
router.use("/space", spaceRouter);
router.use("/admin", adminRouter);
