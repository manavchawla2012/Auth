import {NextFunction, Response, Request} from 'express';
import UserDataUtils from "@dataUtils/userDataUtils"
import {BadRequestException, SomethingWentWrongException} from "@exceptions/response";
import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library';
import {ORMExceptionCodes} from "@/helpers/exceptionHelper";
import {User} from "@prisma/client";


class UserController {
    private dataUtils: UserDataUtils;

    constructor() {
        this.dataUtils = new UserDataUtils();
    }

    createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.dataUtils.createUser(req.body as unknown as User);
            res.status(201).json(user);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === ORMExceptionCodes.UNIQUE_EXCEPTION) {
                    next(new BadRequestException({message: "User with email or phone already exists"}));
                }
            } else {
                next(new SomethingWentWrongException({message: "Some error occurred in creating user."}))
            }
        }
    }


}

export default UserController
