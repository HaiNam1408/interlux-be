import { HttpException, HttpStatus } from "@nestjs/common";
export declare const resError: (error: Error | HttpException) => never;
export declare const exceptionError: (message: string, status: HttpStatus) => never;
