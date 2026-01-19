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
exports.UpdateProductDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
class UpdateProductDto {
}
exports.UpdateProductDto = UpdateProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'The title of the product',
        example: 'Premium Coffee Maker',
        type: String
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Detailed description of the product',
        example: 'High-quality coffee maker with temperature control and timer.',
        type: String
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'The price of the product in your currency',
        example: 199,
        minimum: 0
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseInt(value) : undefined),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Discount percentage off the regular price',
        example: 15,
        minimum: 0,
        maximum: 100
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseInt(value) : undefined),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "percentOff", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Additional product attributes as a JSON object',
        example: {
            color: 'Black',
            dimensions: '10x8x14 inches',
            weight: '5 lbs',
            material: 'Stainless Steel'
        },
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateProductDto.prototype, "attributes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'ID of the category this product belongs to',
        example: 5,
        type: Number
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseInt(value) : undefined),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Sort order for display (lower numbers appear first)',
        example: 10,
        type: Number
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseInt(value) : undefined),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "sort", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Current status of the product',
        enum: client_1.ProductStatus,
        enumName: 'ProductStatus',
        example: client_1.ProductStatus.DRAFT
    }),
    (0, class_validator_1.IsEnum)(client_1.ProductStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Array of image objects to delete',
        example: [
            {
                "fileName": "image1.jpg",
                "url": "https://example.com/image1.jpg"
            },
            {
                "fileName": "image2.jpg",
                "url": "https://example.com/image2.jpg"
            }
        ],
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateProductDto.prototype, "imagesToDelete", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: "New product images to upload (supports multiple files)",
        type: 'array',
        items: {
            type: 'string',
            format: 'binary'
        },
        maxItems: 6
    }),
    __metadata("design:type", Array)
], UpdateProductDto.prototype, "images", void 0);
//# sourceMappingURL=update-product.dto.js.map