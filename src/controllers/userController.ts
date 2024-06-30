import {NextFunction, Response} from 'express';
import UserDataUtils from "@dataUtils/userDataUtils"
import {BadRequestException, SomethingWentWrongException} from "@exceptions/response";
import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library';
import {ORMExceptionCodes} from "@/helpers/exceptionHelper";
import {User} from "@prisma/client";
import {AuthRequest} from "@middlewares/authenticateMiddleware";
import StringHelper from "@/helpers/stringHelper";
import UserRoleEnum from "@/enum/userRoleEnum";


class UserController {
    private dataUtils: UserDataUtils;

    constructor() {
        this.dataUtils = new UserDataUtils();
    }

    private validateUserCreation = (user: User) => {
        const error: object[] = []

        const validateEmail = StringHelper.validateEmail(user.email)
        if (!validateEmail.success) {
            error.push({"email": validateEmail.message})
        }

        const validateFirstName = StringHelper.validateString({value: user.firstName, key: "First Name"})
        if (!validateFirstName.success) {
            error.push({"firstName": validateFirstName.message})
        }

        const validateLastName = StringHelper.validateString({value: user.lastName, key: "Last Name"})
        if (!validateLastName.success) {
            error.push({"lastName": validateLastName.message})
        }

        const validatePhone = StringHelper.validatePhone(user.phone)
        if (!validateLastName.success) {
            error.push({"phone": validatePhone.message})
        }

        const validatePassword = StringHelper.validatePassword(user.password)
        if (!validatePassword.success) {
            error.push({"password": validatePassword.message})
        }

        const validateUserRole = StringHelper.validateEnum(user.role, UserRoleEnum)
        if (!validateUserRole.success) {
            error.push({"role": validateUserRole.message})
        }

        return error
    }

    createUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const validator = this.validateUserCreation(req.body)
            if (validator.length > 0) {
                next(new BadRequestException({data: validator}))
                return;
            }
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

    getUserDetails = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const user = await this.dataUtils.getUserDetails(req.user?.id!)
            res.status(200).json(user);
        } catch (error) {
            let message: string;
            if (typeof error === "string") {
                message = error;
            } else {
                message = "Something went wrong"
            }
            next(new BadRequestException({message}));
        }
    }


}

export default UserController
