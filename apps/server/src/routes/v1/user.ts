import { Router } from "express";

export const userRouter : Router = Router();

userRouter.post("/metadata", (req, res) => {
    res.json({
        message: "User metadata"
    })
})

userRouter.get("/metadata/bulk", (req, res) => {

})