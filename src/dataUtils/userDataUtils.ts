import {Prisma, User} from "@prisma/client";
import {BaseDataUtils} from "./base";
import AuthHelper from "@/helpers/authHelper";
import CacheHelper from "@/helpers/cacheHelper";

class UserDataUtils extends BaseDataUtils<User, Prisma.UserDelegate> {
    protected model: Prisma.UserDelegate<any> = this.prisma.user;

    createUser = async (data: User): Promise<User> => {
        const password = AuthHelper.hashPassword(data.password);
        return this.create({...data, password})
    }

    findUserByEmail = async (email: string): Promise<User | null> => {
        return this.model.findUnique({where: {email}})
    }

    getUserDetails = async (id: bigint): Promise<User> => {
        const cacheKey = `user:${id}.details`;
        const cacheExpiryTime = 15 * 60
        const userData = await CacheHelper.get(cacheKey)
        let user: User | null;
        if (!userData) {
            user = await this.findById(Number(id))
            if (!user) {
                throw "User not found"
            }
            await CacheHelper.set(cacheKey, JSON.stringify(user), {EX: cacheExpiryTime})
        } else {
            user = JSON.parse(userData) as unknown as User
        }
        return user
    }

}

export default UserDataUtils;