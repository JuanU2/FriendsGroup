import prisma from '../client'
import { UserCreate, UserUpdate, UserWithBasicData, userInclude } from './user.types'
import { DbResult } from '../types'
import { Result } from '@badrap/result'
import bcrypt from 'bcrypt'

async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10)
}

async function create(createObj: UserCreate): DbResult<UserWithBasicData> {
    try {
        const user = await prisma.user.create({
            data: {
                password: await hashPassword(createObj.password),
                email: createObj.email,
                username: createObj.username,
                userRole: createObj.userRole,
            },
            include: userInclude,
        })
        return Result.ok(user)
    }
    catch (err) {
        return Result.err(err)
    }
}

async function update(id: string, updateObj: UserUpdate): DbResult<UserWithBasicData> {
    try {
        const user = await prisma.user.update({
            where: { id },
            data: updateObj,
            include: userInclude,
        })
        return Result.ok(user)
    }
    catch (err) {
        return Result.err(err)
    }
}

async function get(id: string): DbResult<UserWithBasicData> {
    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: { id },
            include: userInclude,
        })
        return Result.ok(user)
    }
    catch (err) {
        return Result.err(err)
    }
}

async function getByEmail(email: string): DbResult<UserWithBasicData> {
    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: { email },
            include: userInclude,
        })
        return Result.ok(user)
    }
    catch (err) {
        return Result.err(err)
    }
}

async function getMany(): DbResult<UserWithBasicData[]> {
    try {
        const users = await prisma.user.findMany({
            include: userInclude,
        })
        return Result.ok(users)
    }
    catch (err) {
        return Result.err(err)
    }
}

async function remove(id: string): DbResult<void> {
    try {
        await prisma.user.delete({
            where: { id },
        })
        return Result.ok(undefined)
    }
    catch (err) {
        return Result.err(err)
    }
}

const UserRepo = {
    create,
    update,
    get,
    getMany,
    remove,
    getByEmail,
}

export default UserRepo