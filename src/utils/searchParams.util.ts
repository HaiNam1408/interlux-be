import { PrismaClient } from "@prisma/client";

export class SearchParams {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async searchMultiOption<T>(
        modelName: string,
        options: {
            where?: Record<string, any>;
            select?: Record<string, boolean>;
            include?: Record<string, boolean>;
            orderBy?: Record<string, "asc" | "desc">;
        },
    ): Promise<T[]> {
        const model = this.prisma[modelName as keyof PrismaClient] as any;

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

        return result as T[];
    }
}
