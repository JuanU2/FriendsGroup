import { Prisma } from "@prisma/client";
import prisma from "../client";
import { DbResult } from "../types";
import { Result } from "@badrap/result";

type SessionWithUser = Prisma.SessionGetPayload<{include: {user: true}}>

type SessionCreate = {
    userId: string,
    expiresAt: Date,
    userAgent: string,
    ip: string,
}

async function create(createObj: SessionCreate ): DbResult<SessionWithUser> {
    try {
        const session = await prisma.session.create({
            data: createObj,
            include: {user: true},
        })
        return Result.ok(session)
    }
    catch (err) {
        return Result.err(err)
    }
}

async function get(id: string): DbResult<SessionWithUser> {
    try {
        const session = await prisma.session.findUniqueOrThrow({
            where: { id },
            include: {user: true},
        })
        return Result.ok(session)
    }
    catch (err) {
        return Result.err(err)
    }
}

const SessionsRepo = {
    create,
    get,
}

export default SessionsRepo