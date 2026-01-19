export declare class SearchParams {
    private prisma;
    constructor();
    searchMultiOption<T>(modelName: string, options: {
        where?: Record<string, any>;
        select?: Record<string, boolean>;
        include?: Record<string, boolean>;
        orderBy?: Record<string, "asc" | "desc">;
    }): Promise<T[]>;
}
