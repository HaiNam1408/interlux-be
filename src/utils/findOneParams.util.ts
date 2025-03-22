import { PrismaClient } from "@prisma/client";

export class DatabaseService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async findOneById<T>(id: number, modelName: string): Promise<T | null> {
        const model = this.prisma[modelName as keyof PrismaClient] as any;

        if (!model || typeof model.findUnique !== "function") {
            throw new Error(`Invalid model name: ${modelName}`);
        }

        const result = await model.findUnique({
            where: {
                id: id,
                deleteAt: false,
            },
        });

        return result as T;
    }
}
