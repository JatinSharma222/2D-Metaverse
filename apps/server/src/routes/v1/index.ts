import { Router } from "express";
import { adminRouter } from "./admin.js";
import { spaceRouter } from "./space.js";
import { userRouter } from "./user.js";


export const router = Router();

router.get('/', (req, res) => {
    res.json({
        message: "Hello from metaverse"
    })
})

router.post('/signup', (req, res) => {
    res.json({
        message: "signup endpoint"
    })
})

router.post('/signin', (req, res) => {
    res.json({
            message: "signin endpoint"
        })
})

router.get("/elements", (req, res) => {
    res.json({
        message: "Elements"
    })
})

router.get("/avatars", (req, res) => {
    res.json({
        message: "Avatars"
    })
})

router.use("/user", userRouter)
router.use("/space", spaceRouter)
router.use("/admin", adminRouter)