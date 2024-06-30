import {NextFunction, Request, Response} from "express";
import AuthHelper from "@/helpers/authHelper";
import {UnauthorizedException} from "@exceptions/response";
import UserPayload from "@interfaces/userPayload";

export interface AuthRequest extends Request {
    user?: UserPayload
}

const AuthenticateMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')
    if (!token) {
        next(new UnauthorizedException({message: "No token provided"}))
    } else {
        const user = await AuthHelper.verifyJwtToken(token)
        if (!user) {
            next(new UnauthorizedException({message: "Token expired"}))
        } else {
            req.user = user;
            next();
        }
    }
}

export default AuthenticateMiddleware;