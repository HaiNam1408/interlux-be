import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    ObjectCannedACL,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
    private s3: S3Client;
    private readonly MAX_FILE_SIZE = 5 * 1024 * 1024;
    private readonly ALLOWED_EXTENSIONS = [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'webp',
        'heif',
        'heic',
        'svg',
    ];

    constructor(private readonly configService: ConfigService) {
        this.s3 = new S3Client({
            endpoint: this.configService.get<string>('AWS_PUBLIC_END_POINT'),
            region: 'apac',
            credentials: {
                accessKeyId: this.configService.get<string>('R2_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get<string>('R2_SECRET_ACCESS_KEY'),
            },
        });
    }

    private validateFile(filename: string, dataBuffer: Buffer) {
        const fileExtension = filename.split('.').pop().toLowerCase();
        if (!this.ALLOWED_EXTENSIONS.includes(fileExtension)) {
            throw new HttpException(
                `Unsupported file type. Only ${this.ALLOWED_EXTENSIONS.join(', ')} are allowed.`,
                HttpStatus.BAD_REQUEST,
            );
        }

        if (dataBuffer.length > this.MAX_FILE_SIZE) {
            throw new HttpException(
                `File size exceeds the 2MB limit.`,
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async deletePublicFile(fileName: string): Promise<void> {
        try {
            const params = {
                Bucket: this.configService.get<string>('R2_BUCKET_NAME'),
                Key: fileName,
            };
            const command = new DeleteObjectCommand(params);

            await this.s3.send(command);
        } catch (error) {
            throw new HttpException(error.message, error.status || 500);
        }
    }

    public async uploadFile(
        dataBuffer: Buffer,
        filename: string,
        folder: string = 'common',
        type: string,
    ): Promise<{ fileName: string; filePath: string; type: string }> {
        try {
            this.validateFile(filename, dataBuffer);
            const fileExtension = filename.split(".").pop();
            const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 12)}.${fileExtension}`;
            const fileKey = `${folder}/${uniqueFilename}`;

            const params = {
                Bucket: this.configService.get<string>('R2_BUCKET_NAME'),
                Key: fileKey,
                Body: dataBuffer,
                ContentType: fileExtension,
                ACL: ObjectCannedACL.public_read,
            };

            const command = new PutObjectCommand(params);
            const result = await this.s3.send(command);
            return {
                fileName: fileKey,
                filePath: `${this.configService.get<string>('R2_PUBLIC_DOMAIN')}/${fileKey}`,
                type: type,
            };
        } catch (error) {
            throw new HttpException(error.message, error.status || 500);
        }
    }

    async uploadMultipleFiles(
        files: {
            dataBuffer: Buffer;
            filename: string;
            folder?: string;
            type?: string;
        }[],
    ): Promise<{ fileName: string; filePath: string; type: string }[]> {
        try {
            const uploadPromises = files.map((file) =>
                this.uploadFile(file.dataBuffer, file.filename, file.folder, file.type),
            );
            return await Promise.all(uploadPromises);
        } catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async uploadAttachments(
        files: Express.Multer.File[],
        folder: string,
    ): Promise<Record<string, any>[]> {
        const attachments = await this.uploadMultipleFiles(
            files.map((file) => ({
                dataBuffer: file.buffer,
                filename: file.originalname,
                folder,
                type: file.mimetype,
            })),
        );
        return attachments.map((attachment) => ({
            fileName: attachment.fileName,
            filePath: attachment.filePath,
            type: attachment.type,
        }));
    }

    async deleteMultipleFiles(fileNames: string[]): Promise<void> {
        try {
            const deletePromises = fileNames.map((fileName) =>
                this.s3.send(
                    new DeleteObjectCommand({
                        Bucket: this.configService.get<string>('R2_BUCKET_NAME'),
                        Key: fileName,
                    }),
                ),
            );
            await Promise.all(deletePromises);
        } catch (error) {
            throw new HttpException(error.message, error.status || 500);
        }
    }
}
