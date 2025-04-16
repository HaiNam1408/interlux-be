import { HttpStatus } from "@nestjs/common";

export interface ApiResponseInterface {
    statusCode: HttpStatus;
    message: string;
    data?: any;
}

class ApiResponse<T> implements ApiResponseInterface {
    statusCode: HttpStatus;
    message: string;
    data?: T;

    constructor(message: string, statusCode: HttpStatus, data?: T) {
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
        return this;
    }

    static success<T>(data: T, message: string = "Operation successful"): ApiResponse<T> {
        return new ApiResponse<T>(message, HttpStatus.OK, data);
    }

    static fromError(error: any): ApiResponse<any> {
        let errorMessage: string;
        let statusCode: HttpStatus;
        switch (error.status) {
            case HttpStatus.NOT_FOUND:
                errorMessage = "Resource not found";
                statusCode = HttpStatus.NOT_FOUND;
                break;
            case HttpStatus.UNAUTHORIZED:
                errorMessage = "Unauthorized access";
                statusCode = HttpStatus.UNAUTHORIZED;
                break;
            case HttpStatus.FORBIDDEN:
                errorMessage = "Forbidden";
                statusCode = HttpStatus.FORBIDDEN;
                break;
            case HttpStatus.BAD_REQUEST:
                errorMessage = "Bad request";
                statusCode = HttpStatus.BAD_REQUEST;
                break;
            case HttpStatus.INTERNAL_SERVER_ERROR:
                errorMessage = "Internal server error";
                statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
                break;
            default:
                errorMessage =
                    error.meta?.cause ??
                    error.message ??
                    error.name ??
                    "An unexpected error occurred";
                statusCode = error.status ?? HttpStatus.BAD_REQUEST;
                break;
        }
        return new ApiResponse(errorMessage, statusCode);
    }
}

export default ApiResponse;
