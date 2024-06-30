interface ExceptionData {
    message?: string;
    data?: object;
    statusCode?: number;
}

export class CustomException extends Error {
    statusCode: number;
    data: any;
    message: string;


    private extractMessage = (data: any): string => {
        let defaultMessage = "Some error occurred. Please try again."
        if (typeof data === "string") {
            return data;
        } else if (Array.isArray(data)) {
            return this.extractMessage(data[0]);
        } else if (typeof data === 'object') {
            return this.extractMessage(Object.values(data)[0]);
        }
        return defaultMessage;
    }

    constructor(details: ExceptionData) {
        super("");
        this.message = details.message ?? this.extractMessage(details.data);
        this.name = this.constructor.name;
        this.statusCode = details.statusCode ?? 500;
        this.data = details.data ?? {};
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundException extends CustomException {
    constructor(details: ExceptionData) {
        super({...details, statusCode: 404});
    }
}

export class UnauthorizedException extends CustomException {
    constructor(details: ExceptionData) {
        super({...details, statusCode: 401});
    }
}

export class BadRequestException extends CustomException {
    constructor(details: ExceptionData) {
        super({...details, statusCode: 400});
    }
}

export class SomethingWentWrongException extends CustomException {
    constructor(details: ExceptionData) {
        super({...details, statusCode: 500});
    }
}