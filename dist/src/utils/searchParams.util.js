"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchParams = void 0;
const client_1 = require("@prisma/client");
class SearchParams {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async searchMultiOption(modelName, options) {
        const model = this.prisma[modelName];
        if (!model || typeof model.findMany !== "function") {
            throw new Error(`Invalid model name: ${modelName}`);
        }
        const where = {
            ...options.where,
            deleteAt: false,
        };
        const result = await model.findMany({
            where,
            select: options.select,
            include: options.include,
            orderBy: options.orderBy,
        });
        return result;
    }
}
exports.SearchParams = SearchParams;
//# sourceMappingURL=searchParams.util.js.map