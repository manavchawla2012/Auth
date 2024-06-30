import {NextFunction, Response} from "express";
import UserDataUtils from "@dataUtils/userDataUtils";
import {BadRequestException} from "@exceptions/response";
import AuthHelper from "@/helpers/authHelper";
import {AuthRequest} from "@middlewares/authenticateMiddleware";

class AuthController {
    private userUtils: UserDataUtils;

    constructor() {
        this.userUtils = new UserDataUtils();
    }

    login = async (req: AuthRequest, res: Response, next: NextFunction) => {
        const {email, password} = req.body;
        let errorData: object[] = []
        if (!email) {
            errorData.push({"email": "Email Is Required"});
        }
        if (!password) {
            errorData.push({"password": "Password Is Required"});
        }

        if (errorData.length > 0) {
            next(new BadRequestException({data: errorData}))
            return;
        }
        const user = await this.userUtils.findUserByEmail(email ?? "")
        if (!user) {
            next(new BadRequestException({message: "Invalid email or password"}));
        } else {
            if (!AuthHelper.verifyPassword(password, user.password)) {
                next(new BadRequestException({message: "Invalid email or password"}));
            } else {
                res.status(201).json(await AuthHelper.generateToken(user));
            }
        }
    }

    logout = async (req: AuthRequest, res: Response) => {
        const user = req.user!
        await AuthHelper.expireSession(user?.id!, user.sessionId)
        res.status(201).json({
            "message": "User Logged Out"
        });
    }
}

export default AuthController;