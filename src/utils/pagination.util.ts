import { Injectable } from "@nestjs/common";
import { PaginatedResult } from "src/common/interfaces/paginated.interface";
import { PrismaService } from "src/prisma.service";

export interface PaginationOptions {
    page: number;
    limit: number;
}

@Injectable()
export class PaginationService {
    constructor(private prisma: PrismaService) { }

    async paginate<T>(
        model: string,
        params: PaginationOptions,
        where: any = {},
        select: any = {},
        orderBy: any = {}
    ): Promise<PaginatedResult<T>> {
        const { page = 1, limit = 10 } = params;
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.prisma[model].findMany({
                where,
                select,
                orderBy,
                skip,
                take: limit,
            }),
            this.prisma[model].count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages,
            },
        };
    }
}
