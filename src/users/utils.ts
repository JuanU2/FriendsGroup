import SessionsRepo from "../sessions/sessions.repository";

export async function authorizeBySession(userId: string, sessionId?: string) {
    if (!sessionId) {
        return false
    }
    const session = await SessionsRepo.get(sessionId)
    if (!session.isOk) {
        return false
    }
    if (session.value.userId !== userId) {
        return false
    }
    return true
}

export async function authorizeAdmin(sesionId?: string) {
    if (!sesionId) {
        return false
    }
    const session = await SessionsRepo.get(sesionId)
    if (!session.isOk) {
        return false
    }
    return session.value.user.userRole === "ADMIN"
}