import {NextFunction, Request, Response} from "express";
import UserDataUtils from "@dataUtils/userDataUtils";
import {BadRequestException} from "@exceptions/response";
import AuthHelper from "@/helpers/authHelper";

class AuthController {
    private userUtils: UserDataUtils;

    constructor() {
        this.userUtils = new UserDataUtils();
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        const {email, password} = req.body;
        const verified = AuthHelper.verifyPassword("manav", "pbkdf2_sha256$600000$TIF1wlAYqC7Mfu8htjUco0$Qj1tFJ9hWJREWgfUokmWIaupEqnUfTVAe/MFr2cxDUU=")
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
            if (user.password !== password) {

            } else {
                res.status(201).json(await AuthHelper.generateToken(user));
            }
        }
    }

    logout = async (req: Request, res: Response, next: NextFunction) => {
        await AuthHelper.expireSession(req.user.id, req.user.sessionId)
        res.status(201).json({
            "message": "User Logged Out"
        });
    }
}

export default AuthController;