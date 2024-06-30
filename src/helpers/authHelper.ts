import {User} from "@prisma/client";
import * as fs from "node:fs";
import jwt from 'jsonwebtoken';
import path from 'path';
import {
    DIGEST,
    HASH_ALGORITHM,
    ITERATIONS,
    JWT_ALGORITHM,
    JWT_EXPIRY_SECONDS,
    KEY_LENGTH,
    SESSION_EXPIRY_SECONDS
} from "@/settings";
import UserPayload from "@interfaces/userPayload";
import {UnauthorizedException} from "@exceptions/response";
import StringHelper from "@/helpers/stringHelper";
import CacheHelper from "@/helpers/cacheHelper";
import cacheHelper from "@/helpers/cacheHelper";
import crypto from 'crypto';
import UserDataUtils from "@dataUtils/userDataUtils";
import moment from "moment";


interface Token {
    token: string;
    // refreshToken: string;
}


class AuthHelper {
    private static _instance: AuthHelper;
    private readonly publicKey;
    private readonly privateKey;
    private readonly algorithm;


    constructor() {
        // Initialize your AuthHelper variables and properties here
        this.privateKey = fs.readFileSync(path.resolve(__dirname, '../../private.pem'), 'utf8');
        this.publicKey = fs.readFileSync(path.resolve(__dirname, '../../public.pem'), 'utf8');
        this.algorithm = JWT_ALGORITHM;
    }


    static getInstance() {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new AuthHelper();
        return this._instance;
    }


    private getUserSessionCacheKey = (userId: bigint, sessionId: string) => {
        return `user:${userId}.session.${sessionId}`;
    }


    generateToken = async (user: User, sessionId?: string): Promise<Token> => {
        if (!sessionId) {
            sessionId = StringHelper.generateRandomNumber(10)
        }
        const userSessionCacheKey = this.getUserSessionCacheKey(user.id, sessionId);
        const payload = this.getUserPayload(user, sessionId)
        // const refreshToken = jwt.sign(payload, this.privateKey, {
        //     algorithm: 'RS256',
        //     expiresIn: REFRESH_TOKEN_EXPIRY_SECONDS,
        // });
        const token = jwt.sign(payload, this.privateKey, {
            algorithm: 'RS256',
            expiresIn: JWT_EXPIRY_SECONDS,
        });
        await Promise.allSettled(
            [
                CacheHelper.set(userSessionCacheKey, {
                    loggedInAt: moment().unix(),
                }.toString(), {
                    EX: SESSION_EXPIRY_SECONDS
                })
            ]
        )
        return {
            token,
            //refreshToken,
        }
    }

    getUserPayload = (user: User, sessionId?: string): UserPayload => {
        if (!sessionId) {
            sessionId = "";
        }
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            createdAt: user.createdAt,
            role: user.role,
            sessionId,
        }
    }


    generateNewTokenUsingRefreshToken = async (refreshToken: string): Promise<Token> => {
        const payload = await this.verifyJwtToken(refreshToken);
        if (!payload) {
            throw new UnauthorizedException({"message": "Token expired"});
        } else {
            const cacheRefreshToken = 0
        }
        const user = await new UserDataUtils().findById(payload.id as unknown as number)
        if (!user) {
            throw new UnauthorizedException({"message": "User not found"})
        }

        return this.generateToken(user, payload.sessionId);
    }


    // Verify JWT token
    // Can be used for both token and refresh token's
    verifyJwtToken = async (token: string): Promise<UserPayload | null> => {
        try {
            const payload = jwt.verify(token, this.publicKey, {algorithms: [this.algorithm]}) as UserPayload;
            const cacheKey = this.getUserSessionCacheKey(payload.id, payload.sessionId);
            if (await cacheHelper.get(cacheKey)) {
                return payload
            } else {
                return null
            }
        } catch (e) {
            return null;
        }
    };

    expireSession = async (userId: bigint, sessionId: string) => {
        const cacheKey = this.getUserSessionCacheKey(userId, sessionId);
        await cacheHelper.del(cacheKey)
    }

    expireAllUserSessions = async (userId: bigint) => {
        const cacheKey = this.getUserSessionCacheKey(userId, "*");
        return cacheHelper.deleteAllByPattern(cacheKey)
    }


    verifyPassword = (password: string, hashedPassword: string): boolean => {
        const [algorithm, iterations, salt, hash] = hashedPassword.split('$');
        if (algorithm !== 'pbkdf2_sha256') {
            return false;
        }

        const derivedKey = crypto.pbkdf2Sync(password, salt, parseInt(iterations), 32, 'sha256').toString('base64');

        return hash === derivedKey;
    };


    hashPassword = (password: string): string => {
        const salt = crypto.randomBytes(16).toString('hex'); // 32 characters
        const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('base64');
        return `${HASH_ALGORITHM}$${ITERATIONS}$${salt}$${hash}`;
    };


}

const instance = AuthHelper.getInstance()


export default instance;