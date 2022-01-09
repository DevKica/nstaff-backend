import jwt from "jsonwebtoken";
import { sessionDocument } from "../models/session.model";
import { signSessionFormat } from "../services/user/session.service";
import { ObjectId } from "mongoose";

export interface decodedFormat extends signSessionFormat {
    sessionId: sessionDocument["userId"];
    canRefresh: boolean;
}

export interface customEmailTokenFormat {
    userConfirmationId: string | ObjectId;
    objectId: string;
    passwordReset?: boolean;
    newEmail?: string;
}

export interface multiDecodedFormatJWT extends decodedFormat, customEmailTokenFormat, jwt.JwtPayload {}

export function signJWT(data: Object, secret: string, expiredTime: string) {
    return jwt.sign(data, secret, { expiresIn: expiredTime });
}

export function verifyJWT(token: string, secret: string) {
    try {
        const decoded = <multiDecodedFormatJWT>jwt.verify(token, secret);
        return {
            expired: false,
            decoded,
        };
    } catch (e: any) {
        return {
            expired: e.message === "jwt expired",
            decoded: null,
        };
    }
}
