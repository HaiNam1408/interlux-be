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

    private readonly ALLOWED_3D_EXTENSIONS = [
        'glb',
        'gltf',
    ];

    private readonly MAX_3D_FILE_SIZE = 50 * 1024 * 1024; // 50MB limit

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

    private validateFile(filename: string, dataBuffer: Buffer, is3DFile: boolean = false) {
        const fileExtension = filename.split('.').pop().toLowerCase();

        if (is3DFile) {
            if (!this.ALLOWED_3D_EXTENSIONS.includes(fileExtension)) {
                throw new HttpException(
                    `Unsupported 3D file type. Only ${this.ALLOWED_3D_EXTENSIONS.join(', ')} are allowed.`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (dataBuffer.length > this.MAX_3D_FILE_SIZE) {
                throw new HttpException(
                    `File size exceeds the 50MB limit for 3D files.`,
                    HttpStatus.BAD_REQUEST,
                );
            }
        } else {
            if (!this.ALLOWED_EXTENSIONS.includes(fileExtension)) {
                throw new HttpException(
                    `Unsupported file type. Only ${this.ALLOWED_EXTENSIONS.join(', ')} are allowed.`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (dataBuffer.length > this.MAX_FILE_SIZE) {
                throw new HttpException(
                    `File size exceeds the 5MB limit.`,
                    HttpStatus.BAD_REQUEST,
                );
            }
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
        is3DFile: boolean = false,
    ): Promise<{ fileName: string; filePath: string; type: string }> {
        try {
            this.validateFile(filename, dataBuffer, is3DFile);
            const fileExtension = filename.split(".").pop();
            const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 12)}.${fileExtension}`;
            const fileKey = `${folder}/${uniqueFilename}`;

            const params = {
                Bucket: this.configService.get<string>('R2_BUCKET_NAME'),
                Key: fileKey,
                Body: dataBuffer,
                ContentType: is3DFile
                    ? `model/${fileExtension}`
                    : `image/${fileExtension}`,
                ACL: ObjectCannedACL.public_read,
            };

            const command = new PutObjectCommand(params);
            await this.s3.send(command);
            return {
                fileName: fileKey,
                filePath: `${this.configService.get<string>('R2_PUBLIC_DOMAIN')}/${fileKey}`,
                type: type,
            };
        } catch (error) {
            throw new HttpException(error.message, error.status || 500);
        }
    }

    public async upload3DFile(
        dataBuffer: Buffer,
        filename: string,
        folder: string = '3d-models',
    ): Promise<{ fileName: string; filePath: string; type: string; format: string }> {
        try {
            const fileExtension = filename.split(".").pop().toLowerCase();
            const result = await this.uploadFile(
                dataBuffer,
                filename,
                folder,
                'model/3d',
                true
            );

            return {
                ...result,
                format: fileExtension,
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
            is3DFile?: boolean;
        }[],
    ): Promise<{ fileName: string; filePath: string; type: string }[]> {
        try {
            const uploadPromises = files.map((file) =>
                this.uploadFile(
                    file.dataBuffer,
                    file.filename,
                    file.folder,
                    file.type,
                    file.is3DFile
                ),
            );
            return await Promise.all(uploadPromises);
        } catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async uploadMultiple3DFiles(
        files: {
            dataBuffer: Buffer;
            filename: string;
            folder?: string;
        }[],
    ): Promise<{ fileName: string; filePath: string; type: string; format: string }[]> {
        try {
            const uploadPromises = files.map((file) =>
                this.upload3DFile(
                    file.dataBuffer,
                    file.filename,
                    file.folder || '3d-models'
                ),
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

    async upload3DModels(
        files: Express.Multer.File[],
        folder: string = '3d-models',
    ): Promise<Record<string, any>[]> {
        for (const file of files) {
            const fileExtension = file.originalname.split('.').pop().toLowerCase();
            if (!this.ALLOWED_3D_EXTENSIONS.includes(fileExtension)) {
                throw new HttpException(
                    `Unsupported 3D file type: ${fileExtension}. Only ${this.ALLOWED_3D_EXTENSIONS.join(', ')} are allowed.`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (file.size > this.MAX_3D_FILE_SIZE) {
                throw new HttpException(
                    `File size exceeds the 50MB limit for 3D files.`,
                    HttpStatus.BAD_REQUEST,
                );
            }
        }

        const models = await this.uploadMultiple3DFiles(
            files.map((file) => ({
                dataBuffer: file.buffer,
                filename: file.originalname,
                folder,
            })),
        );

        return models.map((model) => ({
            fileName: model.fileName,
            filePath: model.filePath,
            type: model.type,
            format: model.format,
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
