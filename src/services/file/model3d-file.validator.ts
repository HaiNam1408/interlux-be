import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class Model3DFileValidationPipe implements PipeTransform {
    private readonly allowedExtensions: string[] = [
        '.glb',
        '.gltf',
    ];
    
    private readonly maxFileSize: number = 50 * 1024 * 1024; // 50MB

    transform(files: {
        model?: Express.Multer.File[];
        model3d?: Express.Multer.File[];
    }): any {
        Object.keys(files).forEach((field) => {
            const fileArray = files[field];
            if (fileArray && fileArray.length > 0) {
                for (const file of fileArray) {
                    const fileExtension = extname(file.originalname).toLowerCase();
                    if (!this.isValidExtension(fileExtension)) {
                        throw new BadRequestException(
                            `Invalid file extension for ${field}. Allowed extensions are: ${this.allowedExtensions.join(', ')}`,
                        );
                    }
                    
                    if (file.size > this.maxFileSize) {
                        throw new BadRequestException(
                            `File size exceeds the 50MB limit for 3D files.`,
                        );
                    }
                }
            }
        });
        return files;
    }

    private isValidExtension(extension: string): boolean {
        return this.allowedExtensions.includes(extension);
    }
}
