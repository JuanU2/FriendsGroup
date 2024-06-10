import UserSchema from "./validation";
import { Request, Response } from "express";
import { UserWithBasicData } from "./user.types";
import UsersRepo from "./users.repository";
import SessionsRepo from "../sessions/sessions.repository";
import bcrypt from 'bcrypt';
import { IdParameter, SessionCookies } from "../base/validation";
import { BadRequestError } from "../errors";
import { authorizeAdmin, authorizeBySession } from "./utils";

async function create(req: Request, res: Response): Promise<Response<UserWithBasicData>> {
    const createObj = UserSchema.UserCreate.parse(req.body)
    const user = await UsersRepo.create(createObj)
    if (!user.isOk) {
        return res.status(400).json(user.error)
    }
    const session = await SessionsRepo.create({
        userId: user.value.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        userAgent: req.headers["user-agent"] as string,
        ip: req.headers["x-forwarded-for"] as string,
    })
    if (!session.isOk) {
        return res.status(400).json(session.error)
    }
    res.cookie("session", session.value.id)
    return res.status(201).json(user.value)
}


async function login(req: Request, res: Response): Promise<Response<UserWithBasicData>> {
    const loginObj = UserSchema.UserLogin.safeParse(req.body)
    if (!loginObj.success) {
        return res.status(400).json(loginObj.error)
    }
    const user = await UsersRepo.getByEmail(loginObj.data.email)
    if (!user.isOk 
        || !await bcrypt.compare(loginObj.data.password, user.value.password)) {
        return res.status(400).json(new Error("Invalid login"))
    }
    const session = await SessionsRepo.create({
        userId: user.value.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        userAgent: req.headers["user-agent"] as string,
        ip: req.headers["x-forwarded-for"] as string,
    })
    if (!session.isOk) {
        return res.status(400).json(session.error)
    }
    res.cookie("session", session.value.id)
    return res.status(200).json(user.value)
}

async function get(req: Request, res: Response): Promise<Response<UserWithBasicData>> {
    const cookie = SessionCookies.safeParse(req.cookies)
    const id = IdParameter.safeParse(req.params)
    if (!cookie.success || !id.success) {
        return res.status(400).json(BadRequestError)
    }
    if (!await authorizeBySession(id.data.id, cookie.data.session) 
        && !await authorizeAdmin(cookie.data.session)) {
        return res.status(401).json(new Error("Unauthorized"))
    }
    const user = await UsersRepo.get(id.data.id)
    if (!user.isOk) {
        return res.status(400).json(user.error)
    }
    return res.status(200).json(user.value)
}