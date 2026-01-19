import { ConfigService } from '@nestjs/config';
export declare class FilesService {
    private readonly configService;
    private s3;
    private readonly MAX_FILE_SIZE;
    private readonly ALLOWED_EXTENSIONS;
    constructor(configService: ConfigService);
    private validateFile;
    deletePublicFile(fileName: string): Promise<void>;
    uploadFile(dataBuffer: Buffer, filename: string, folder: string, type: string): Promise<{
        fileName: string;
        filePath: string;
        type: string;
    }>;
    uploadMultipleFiles(files: {
        dataBuffer: Buffer;
        filename: string;
        folder?: string;
        type?: string;
    }[]): Promise<{
        fileName: string;
        filePath: string;
        type: string;
    }[]>;
    uploadAttachments(files: Express.Multer.File[], folder: string): Promise<Record<string, any>[]>;
    deleteMultipleFiles(fileNames: string[]): Promise<void>;
}
