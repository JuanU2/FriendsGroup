import { z } from "zod";
import UserSchema from "./validation";
import { Prisma } from "@prisma/client";

export const userInclude = {
    groups: true,
    invitations: true,
    createdInvites: true,
}

export type UserWithBasicData = Prisma.UserGetPayload<{
    include: typeof userInclude
}>
export type UserCreate = z.infer<typeof UserSchema.UserCreate>
export type UserUpdate = z.infer<typeof UserSchema.UserUpdate>