import { HttpStatus } from "@nestjs/common";
export interface ApiResponseInterface {
    statusCode: HttpStatus;
    message: string;
    data?: any;
}
declare class ApiResponse<T> implements ApiResponseInterface {
    statusCode: HttpStatus;
    message: string;
    data?: T;
    constructor(message: string, statusCode: HttpStatus, data?: T);
    static success<T>(data: T, message?: string): ApiResponse<T>;
    static fromError(error: any): ApiResponse<any>;
}
export default ApiResponse;
