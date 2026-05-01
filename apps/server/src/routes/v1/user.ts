import { Router } from "express";
import { UpdateMetadataSchema } from "../../types/index.js";
import  {client}  from "@repo/db";
import { userMiddleware } from "../../middlewares/user.js";

export const userRouter : Router = Router();

userRouter.post("/metadata", userMiddleware , async (req, res) => {
    const parsedData = UpdateMetadataSchema.safeParse(req.body)
    if(!parsedData) {
        res.status(400).json({message: "Validation failed"})
        return
    }
    await client.user.update({
        where: {
            id: req.userId
        },
        data: {
            avatarId: parsedData.data?.avatarId
        }
    })
    res.json({message: "Metadata updated"})
})

userRouter.get("/metadata/bulk", async (req, res) => {
    const userIdString = (req.query.userIds ?? "[]") as string
    const userIds = (userIdString). slice(1, userIdString?.length - 2).split(",");

    const metadata = await client.user.findMany({
        where: {
            id: {
                in: userIds
            }
        },
        select: {
            id: true,
            avatar: true
        }
    })

    res.json({
        avatars: metadata.map(m => ({
            userId: m.id,
            avatarId: m.avatar?.imageUrl
        }))
    })
})