import UserPayload from "@interfaces/userPayload";

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}