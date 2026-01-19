"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = logger;
function logger(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log(`Request...`);
    next();
}
//# sourceMappingURL=logger.middleware.js.map