"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageFileValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
let ImageFileValidationPipe = class ImageFileValidationPipe {
    constructor() {
        this.allowedExtensions = [
            '.jpg',
            '.jpeg',
            '.png',
            '.gif',
            '.webp',
            '.svg',
        ];
    }
    transform(files) {
        Object.keys(files).forEach((field) => {
            const fileArray = files[field];
            if (fileArray && fileArray.length > 0) {
                const file = fileArray[0];
                const fileExtension = (0, path_1.extname)(file.originalname).toLowerCase();
                if (!this.isValidExtension(fileExtension)) {
                    throw new common_1.BadRequestException(`Invalid file extension for ${field}. Allowed extensions are: ${this.allowedExtensions.join(', ')}`);
                }
            }
        });
        return files;
    }
    isValidExtension(extension) {
        return this.allowedExtensions.includes(extension);
    }
};
exports.ImageFileValidationPipe = ImageFileValidationPipe;
exports.ImageFileValidationPipe = ImageFileValidationPipe = __decorate([
    (0, common_1.Injectable)()
], ImageFileValidationPipe);
//# sourceMappingURL=file.validator.js.map