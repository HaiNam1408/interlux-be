import { PipeTransform } from '@nestjs/common';
export declare class ImageFileValidationPipe implements PipeTransform {
    private readonly allowedExtensions;
    transform(files: {
        post_image?: Express.Multer.File[];
        avatar?: Express.Multer.File[];
        background_image?: Express.Multer.File[];
    }): any;
    private isValidExtension;
}
