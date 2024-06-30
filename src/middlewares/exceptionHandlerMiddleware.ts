import { Request, Response, NextFunction } from 'express';
import {CustomException} from "@exceptions/response";

export const ExceptionHandlerMiddleware = (err: CustomException, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({error: message, data: err.data});
};