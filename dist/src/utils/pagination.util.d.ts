import { PaginatedResult } from "src/common/interfaces/paginated.interface";
import { PrismaService } from "src/prisma.service";
export interface PaginationOptions {
    page: number;
    limit: number;
}
export declare class PaginationService {
    private prisma;
    constructor(prisma: PrismaService);
    paginate<T>(model: string, params: PaginationOptions, where?: any, select?: any, orderBy?: any): Promise<PaginatedResult<T>>;
}
