import {Prisma, User} from "@prisma/client";
import {BaseDataUtils} from "./base";

class UserDataUtils extends BaseDataUtils<User, Prisma.UserDelegate>{
    protected model: Prisma.UserDelegate<any> = this.prisma.user;

    createUser = async (data: User): Promise<User> => {
        return this.create(data)
    }

    findUserByEmail = async (email: string): Promise<User | null> => {
        return this.model.findUnique({where: {email}})
    }

}

export default UserDataUtils