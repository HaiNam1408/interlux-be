export declare class DatabaseService {
    private prisma;
    constructor();
    findOneById<T>(id: number, modelName: string): Promise<T | null>;
}
