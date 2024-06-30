import { randomBytes } from "node:crypto";

class StringHelper {
    static generateRandomNumber = (length: number = 10, prefix: string = "") => {
        const bytes = Math.round(length/2)
        return prefix + randomBytes(bytes).toString('hex');
    }
}

export default StringHelper