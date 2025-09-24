import express, { json } from "express";
import { Trainmodel, GenarateImage, GenerateImagesFromPrompt } from "common/types";
import { primsaClient } from "db";
const USER_ID = "123";

const PORT = process.env.PORT || 8080

const app = express();
app.use(express.json());

app.post("/ai/training",async (req,res) => {
    const parsedBody = Trainmodel.safeParse(req.body)

    if(!parsedBody.success) {
        res.status(411).json({
            message: "Input incorrect"
        })
        return
    }

    const data = await primsaClient.model.create({
        data: {
            username: parsedBody.data.name,
            type: parsedBody.data.type,
            age: parsedBody.data.age,
            eyeColor: parsedBody.data.eyeColor,
            bald: parsedBody.data.bald,
            ethinicity: parsedBody.data.ethinicity,
            userId: USER_ID 
        }
    })
    res.json({
        modelId: data.id
    })
});

app.post("/ai/generate", async (req,res) => {
    const parsedBody = GenarateImage.safeParse(req.body)

    if(!parsedBody.success) {
        res.status(411).json({

        })
        return
    }

    const data = await primsaClient.outputImages.create({
        data: {
            prompt: parsedBody.data.prompt,
            userId: USER_ID,
            modelId: parsedBody.data?.modelId,
            imageUrl: ""
        }
    }) 

    res.json({
        imageId: data.id
    })
});

app.post("/pack/generate", async (req,res) => {
    const parsedBody = GenerateImagesFromPrompt.safeParse(req.body)

    if(!parsedBody.success) {
        res.status(411).json({
            message: "Input incorrect"
        })
        return;
    }

    const prompts = await primsaClient.packPrompts.findMany({
        where: {
            packId: parsedBody.data.packId
        }
    })

    const images = await primsaClient.outputImages.createManyAndReturn({
        data: prompts.map((prompt) => ({
            prompt: prompt.prompt,
            userId: USER_ID,
            modelId: parsedBody.data.modelId,
            imageUrl: ""
        }))
    })

    res.json({
        images: images.map((image) => image.id)
    })
});

app.get("/pack/bulk",async (req,res) => {
    const packs = await primsaClient.packs.findMany({})

    res.json({
        packs
    })
});

app.get("/image/bulk",async (req,res) => {
    const ids = req.query.ids as string[]
    const limit = req.query.limit as string ?? "10";
    const offset = req.query.offset as string ?? "0";

    const imagesData = await primsaClient.outputImages.findMany({
        where: {
            id: { in: ids },
            userId: USER_ID 
        },
        skip: parseInt(offset),
        take: parseInt(limit)
    })

    res.json({
        images: imagesData
    })
});

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});