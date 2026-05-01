import { Router } from "express";
import { client } from "@repo/db";
import { CreateSpaceSchema } from "../../types/index.js";
import { userMiddleware } from "../../middlewares/user.js";

export const spaceRouter: Router = Router();

spaceRouter.post("/", userMiddleware, async (req, res) => {
  const parsedData = CreateSpaceSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ message: "Validation failed" });
    return;
  }

  if (!parsedData.data.mapId) {
    const dimensions = parsedData.data.dimensions?.split("x");
    if (!dimensions || dimensions.length !== 2) {
      res
        .status(400)
        .json({
          message: "Dimensions are required for creating a space without a map",
        });
      return;
    }

    const space = await client.space.create({
      data: {
        name: parsedData.data.name,
        width: parseInt(dimensions[0] ?? "", 10),
        height: parseInt(dimensions[1] ?? "", 10),
        creatorId: req.userId as string,
      },
    });
    res.json({ spaceId: space.id });
    return;
  }

  const map = await client.map.findUnique({
    where: {
      id: parsedData.data.mapId,
    },
    select: {
      mapElements: true,
      width: true,
      height: true,
    },
  });

  if (!map) {
    res.status(400).json({ message: "Map not found" });
    return;
  }

  let space = await client.$transaction(async () => {
    const space = await client.space.create({
      data: {
        name: parsedData.data.name,
        width: map.width,
        height: map.height,
        creatorId: req.userId as string,
      },
    });

    await client.spaceElements.createMany({
      data: map.mapElements.map((e) => ({
        elementId: e.elementId,
        spaceId: space.id,
        x: e.x ?? 0,
        y: e.y ?? 0,
      })),
    });
    return space;
  });

  res.json({ spaceId: space.id });
});

spaceRouter.delete("/:spaceId", userMiddleware , async (req, res) => {
    const space = await client.space.findUnique({
        where: {
            id: req.params.spaceId
        }, select: {
            creatorId: true
        }
    })

    if(!space) {
        res.status(400).json({message: "Space not found"})
        return;
    }

    if(space.creatorId !== req.userId) {
        res.status(403).json({message: "Unauthorized"})
        return;
    }

    await client.space.delete({
        where: {
            id: req.params.spaceId
        }
    })

    res.status(200).json({message: "Space deleted"})
});

spaceRouter.get("/all", userMiddleware ,async(req, res) => {
    const spaces = await client.space.findMany({
        where: {
            creatorId: req.userId
        }
    })

    res.json({
        spaces: spaces.map(s => ({
            id: s.id,
            name: s.name,
            thumbnail: s.thumbnail,
            dimesions: `${s.width}x${s.height}`
        }))
    })
});

spaceRouter.post("/element", (req, res) => {});

spaceRouter.delete("/element", (req, res) => {});

spaceRouter.get("/:spaceId", (req, res) => {});
