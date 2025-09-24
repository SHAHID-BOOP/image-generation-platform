import {z} from "zod";

export const Trainmodel = z.object({
    name: z.string(),
    type: z.enum(["Man", "woman", "others"]),
    age: z.number(),
    ethinicity: z.enum(["White",
        "Black",
        "Asian_American",
        "East_Asian",
        "South_East_Asian",
        "South_Asian",
        "Middle_Eastern",
        "Pacific",
        "Hispanic"
    ]),
    eyeColor: z.enum(["Brown", "Blue", "Hazel", "Gray"]),
    bald: z.boolean(),
    images: z.array(z.string())
})

export const GenarateImage = z.object({
    prompt: z.string(),
    modelId: z.string(),
    num: z.number()
})

export const GenerateImagesFromPrompt = z.object({
    modelId: z.string(),
    packId: z.string()
})