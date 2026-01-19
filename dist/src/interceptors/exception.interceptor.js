"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
class ExceptionInterceptor {
    intercept(context, handler) {
        return handler
            .handle()
            .pipe((0, rxjs_1.catchError)((err) => (0, rxjs_1.throwError)(() => new common_1.BadRequestException())));
    }
}
exports.ExceptionInterceptor = ExceptionInterceptor;
//# sourceMappingURL=exception.interceptor.js.map