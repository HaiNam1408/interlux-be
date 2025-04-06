import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class ImageFileValidationPipe implements PipeTransform {
    private readonly allowedExtensions: string[] = [
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
        '.webp',
        '.svg',
    ];

    transform(files: {
        post_image?: Express.Multer.File[];
        avatar?: Express.Multer.File[];
        background_image?: Express.Multer.File[];
    }): any {
        Object.keys(files).forEach((field) => {
            const fileArray = files[field];
            if (fileArray && fileArray.length > 0) {
                const file = fileArray[0];
                const fileExtension = extname(file.originalname).toLowerCase();
                if (!this.isValidExtension(fileExtension)) {
                    throw new BadRequestException(
                        `Invalid file extension for ${field}. Allowed extensions are: ${this.allowedExtensions.join(', ')}`,
                    );
                }
            }
        });
        return files;
    }

    private isValidExtension(extension: string): boolean {
        return this.allowedExtensions.includes(extension);
    }
}
