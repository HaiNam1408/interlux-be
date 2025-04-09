import { HttpException, HttpStatus } from "@nestjs/common";

export const resError = (error: Error | HttpException): never => {
    if (error instanceof HttpException) {
        throw error;
    }
    throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
};

export const exceptionError = (message: string, status: HttpStatus): never => {
    throw new HttpException(message, status);
};