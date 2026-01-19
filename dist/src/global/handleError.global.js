"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exceptionError = exports.resError = void 0;
const common_1 = require("@nestjs/common");
const resError = (error) => {
    if (error instanceof common_1.HttpException) {
        throw error;
    }
    throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
};
exports.resError = resError;
const exceptionError = (message, status) => {
    throw new common_1.HttpException(message, status);
};
exports.exceptionError = exceptionError;
//# sourceMappingURL=handleError.global.js.map