"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = require("@nestjs/config");
let FilesService = class FilesService {
    constructor(configService) {
        this.configService = configService;
        this.MAX_FILE_SIZE = 5 * 1024 * 1024;
        this.ALLOWED_EXTENSIONS = [
            'jpg',
            'jpeg',
            'png',
            'gif',
            'webp',
            'heif',
            'heic',
            'svg',
        ];
        this.s3 = new client_s3_1.S3Client({
            endpoint: this.configService.get('AWS_PUBLIC_END_POINT'),
            region: 'apac',
            credentials: {
                accessKeyId: this.configService.get('R2_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get('R2_SECRET_ACCESS_KEY'),
            },
        });
    }
    validateFile(filename, dataBuffer) {
        const fileExtension = filename.split('.').pop().toLowerCase();
        if (!this.ALLOWED_EXTENSIONS.includes(fileExtension)) {
            throw new common_1.HttpException(`Unsupported file type. Only ${this.ALLOWED_EXTENSIONS.join(', ')} are allowed.`, common_1.HttpStatus.BAD_REQUEST);
        }
        if (dataBuffer.length > this.MAX_FILE_SIZE) {
            throw new common_1.HttpException(`File size exceeds the 2MB limit.`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deletePublicFile(fileName) {
        try {
            const params = {
                Bucket: this.configService.get('R2_BUCKET_NAME'),
                Key: fileName,
            };
            const command = new client_s3_1.DeleteObjectCommand(params);
            await this.s3.send(command);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status || 500);
        }
    }
    async uploadFile(dataBuffer, filename, folder = 'common', type) {
        try {
            this.validateFile(filename, dataBuffer);
            const fileExtension = filename.split(".").pop();
            const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 12)}.${fileExtension}`;
            const fileKey = `${folder}/${uniqueFilename}`;
            const params = {
                Bucket: this.configService.get('R2_BUCKET_NAME'),
                Key: fileKey,
                Body: dataBuffer,
                ContentType: fileExtension,
                ACL: client_s3_1.ObjectCannedACL.public_read,
            };
            const command = new client_s3_1.PutObjectCommand(params);
            const result = await this.s3.send(command);
            return {
                fileName: fileKey,
                filePath: `${this.configService.get('R2_PUBLIC_DOMAIN')}/${fileKey}`,
                type: type,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status || 500);
        }
    }
    async uploadMultipleFiles(files) {
        try {
            const uploadPromises = files.map((file) => this.uploadFile(file.dataBuffer, file.filename, file.folder, file.type));
            return await Promise.all(uploadPromises);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async uploadAttachments(files, folder) {
        const attachments = await this.uploadMultipleFiles(files.map((file) => ({
            dataBuffer: file.buffer,
            filename: file.originalname,
            folder,
            type: file.mimetype,
        })));
        return attachments.map((attachment) => ({
            fileName: attachment.fileName,
            filePath: attachment.filePath,
            type: attachment.type,
        }));
    }
    async deleteMultipleFiles(fileNames) {
        try {
            const deletePromises = fileNames.map((fileName) => this.s3.send(new client_s3_1.DeleteObjectCommand({
                Bucket: this.configService.get('R2_BUCKET_NAME'),
                Key: fileName,
            })));
            await Promise.all(deletePromises);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status || 500);
        }
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FilesService);
//# sourceMappingURL=file.service.js.map