import z from 'zod'

const UserCreate = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    username: z.string().min(8),
    profilePic: z.string().optional(),
    userRole: z.string().optional(),
})

const UserUpdate = z.object({
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    username: z.string().min(8).optional(),
    profilePic: z.string().optional(),
})

const UserLogin = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

const UserSchema = {
    UserCreate,
    UserUpdate,
    UserLogin,
}

export default UserSchema