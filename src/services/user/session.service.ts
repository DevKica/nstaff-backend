import config from "config";
import { signJWT } from "../../utils/jwtConfig";
import { userDocument } from "../../models/user.model";
import SessionModel, { sessionFilter, sessionInput, sessionUpdate } from "../../models/session.model";
export interface signSessionFormat {
    _id: userDocument["_id"];
    active: boolean;
    isAdmin: boolean;
    userAgent: string;
}

export async function signNewSession(user: signSessionFormat) {
    try {
        const MAIN_SECRET_TOKEN = config.get<string>("MAIN_SECRET_TOKEN");
        const ACCESS_TOKEN_TTL = config.get<string>("ACCESS_TOKEN_TTL");
        const REFRESH_TOKEN_TTL = config.get<string>("REFRESH_TOKEN_TTL");

        const session = await createSession({ userId: user._id, userAgent: user.userAgent });
        if (!session) throw Error;

        const accessToken = signJWT({ _id: user._id, active: user.active, isAdmin: user.isAdmin, sessionId: session._id }, MAIN_SECRET_TOKEN, ACCESS_TOKEN_TTL);

        const refreshToken = signJWT({ _id: user._id, active: user.active, isAdmin: user.isAdmin, sessionId: session._id, canRefresh: true }, MAIN_SECRET_TOKEN, REFRESH_TOKEN_TTL);

        return { accessToken, refreshToken };
    } catch (e: unknown) {
        return null;
    }
}

export async function createSession(input: sessionInput) {
    try {
        const session = await SessionModel.create(input);
        return session;
    } catch (e: unknown) {
        return null;
    }
}

export async function findSingleSession(query: sessionFilter) {
    try {
        const session = await SessionModel.findOne(query).lean();
        return session;
    } catch (e: unknown) {
        return null;
    }
}

export async function findAllSessions(query: sessionFilter) {
    try {
        const sessions = await SessionModel.find(query).lean();
        return sessions;
    } catch (e: unknown) {
        return null;
    }
}

export async function updateSingleSession(query: sessionFilter, update: sessionUpdate) {
    try {
        const sessions = await SessionModel.updateOne(query, update);
        return sessions;
    } catch (e: unknown) {
        return null;
    }
}

export async function updateManySessions(query: sessionFilter, update: sessionUpdate) {
    try {
        const sessions = await SessionModel.updateMany(query, update);
        return sessions;
    } catch (e: unknown) {
        return null;
    }
}

export async function deleteManySessions(query: sessionFilter) {
    try {
        const deleteStatus = await SessionModel.deleteMany(query);
        return deleteStatus;
    } catch (e: unknown) {
        return null;
    }
}
