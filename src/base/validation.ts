import z from 'zod'

export const IdParameter = z.object({
    id: z.string().uuid(),
})

export const SessionCookies = z.object({
    session: z.string().uuid(),
})