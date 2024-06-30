import {randomBytes} from "node:crypto";

interface Validator {
    success: boolean;
    message: string;
}

interface StringValidatorOptions {
    key: string;
    value: string;

    minLength?: number;
    maxLength?: number;
}

class StringHelper {
    static generateRandomNumber = (length: number = 10, prefix: string = "") => {
        const bytes = Math.round(length / 2)
        return prefix + randomBytes(bytes).toString('hex');
    }

    static verifyPassword = (password: string): Validator => {
        if (!password) {
            return {success: false, message: 'Password is required'};
        }

        if (password.length < 8) {
            return {success: false, message: 'Password must be at least 8 characters long'};
        }

        return {success: true, message: 'Valid password'};
    }

    static validateEmail = (email: string): Validator => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            return {success: false, message: 'Email is required'};
        }

        if (!emailRegex.test(email)) {
            return {success: false, message: 'Invalid email format'};
        }

        return {success: true, message: 'Valid email'};
    }

    static validateString = (data: StringValidatorOptions): Validator => {
        if (!data.value) {
            return {success: false, message: `${data.key} is required.`}
        }
        if (data.minLength && data.value.length < data.minLength) {
            return {success: false, message: `${data.key} should be of minimum ${data.minLength} characters.`}
        }

        if (data.maxLength && data.value.length > data.maxLength) {
            return {success: false, message: `${data.key} can't be more than ${data.maxLength} characters.`}
        }
        return {success: true, message: 'Valid email'};
    }

    static validatePhone = (phoneNumber: string): Validator => {
        const phoneRegex = /^[6-9]\d{9}$/;

        if (!phoneNumber) {
            return {success: false, message: 'Phone number is required'};
        }

        if (!phoneRegex.test(phoneNumber)) {
            return {
                success: false,
                message: 'Invalid phone number format. It should be a 10-digit number starting with 6, 7, 8, or 9.'
            };
        }

        return {success: true, message: 'Valid phone number'};
    }

    static validatePassword = (password: string): Validator => {
        if (!password) {
            return {success: false, message: 'Password is required'};
        }

        if (password.length < 8) {
            return {success: false, message: 'Password must be at least 8 characters long'};
        }

        return {success: true, message: 'Valid password'};
    }

    static validateEnum = (value: any, enumObj: object): Validator => {
        if (!Object.values(enumObj).includes(value)) {
            return {success: false, message: 'Not a valid value'};
        }
        return {success: true, message: 'Valid password'};
    }
}

export default StringHelper