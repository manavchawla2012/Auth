import {NextFunction, Request, Response} from "express";
import AuthHelper from "@/helpers/authHelper";
import {UnauthorizedException} from "@exceptions/response";

const AuthenticateMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')
    if (!token) {
        next(new UnauthorizedException({message: "No token provided"}))
    } else {
        const user = AuthHelper.verifyJwtToken(token)
        if (!user) {
            next(new UnauthorizedException({message: "Token expired"}))
        } else {
            req.user = user;
            next();
        }
    }
}

export default AuthenticateMiddleware;