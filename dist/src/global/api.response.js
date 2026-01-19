"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
class ApiResponse {
    constructor(message, statusCode, data) {
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
        return this;
    }
    static success(data, message = "Operation successful") {
        return new ApiResponse(message, common_1.HttpStatus.OK, data);
    }
    static fromError(error) {
        let errorMessage;
        let statusCode;
        switch (error.status) {
            case common_1.HttpStatus.NOT_FOUND:
                errorMessage = "Resource not found";
                statusCode = common_1.HttpStatus.NOT_FOUND;
                break;
            case common_1.HttpStatus.UNAUTHORIZED:
                errorMessage = "Unauthorized access";
                statusCode = common_1.HttpStatus.UNAUTHORIZED;
                break;
            case common_1.HttpStatus.FORBIDDEN:
                errorMessage = "Forbidden";
                statusCode = common_1.HttpStatus.FORBIDDEN;
                break;
            case common_1.HttpStatus.BAD_REQUEST:
                errorMessage = "Bad request";
                statusCode = common_1.HttpStatus.BAD_REQUEST;
                break;
            case common_1.HttpStatus.INTERNAL_SERVER_ERROR:
                errorMessage = "Internal server error";
                statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
                break;
            default:
                errorMessage =
                    error.meta?.cause ??
                        error.message ??
                        error.name ??
                        "An unexpected error occurred";
                statusCode = error.status ?? common_1.HttpStatus.BAD_REQUEST;
                break;
        }
        return new ApiResponse(errorMessage, statusCode);
    }
}
exports.default = ApiResponse;
//# sourceMappingURL=api.response.js.map