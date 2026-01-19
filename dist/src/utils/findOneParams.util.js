"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const client_1 = require("@prisma/client");
class DatabaseService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async findOneById(id, modelName) {
        const model = this.prisma[modelName];
        if (!model || typeof model.findUnique !== "function") {
            throw new Error(`Invalid model name: ${modelName}`);
        }
        const result = await model.findUnique({
            where: {
                id: id,
                deleteAt: false,
            },
        });
        return result;
    }
}
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=findOneParams.util.js.map