import z from 'zod';

export const SignupSchema = z.object({
    username: z.string().email(),
    password: z.string().min(8),
    type: z.enum(["user", "admin"]),
});

export const SigninSchema = z.object({
    username: z.string().email(),
    password: z.string().min(8),
});

export const UpdateMetadataSchema = z.object({
    avatarId: z.string()
});

export const CreateSpaceSchema = z.object({
    name: z.string(),
    dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/), // e.g., "100x100" 
    mapId: z.string(),
});

export const AddElementSchema = z.object({
    spaceId: z.string(),
    elementId: z.string(),
    x: z.number(),
    y: z.number(),
});

export const CreateElementSchema = z.object({
    imageUrl: z.string().url(),
    width: z.number().positive(),
    height: z.number().positive(),
    static: z.boolean(),
});

export const updateElementSchema = z.object({
    imageUrl: z.string().url(),
});

export const CreateAvatarSchema = z.object({
    name: z.string(),
    imageUrl: z.string().url(),
});

export const CrerateMapSchema = z.object({
    thumbnailUrl: z.string().url(),
    dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/), // e.g., "100x100"
    defaultElements: z.array(z.object({
        elementId: z.string(),
        x: z.number(),
        y: z.number(),
    })),
});