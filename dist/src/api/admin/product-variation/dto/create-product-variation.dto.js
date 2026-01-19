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
exports.CreateProductVariationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const create_product_variation_value_dto_1 = require("./create-product-variation-value.dto");
class CreateProductVariationDto {
    constructor() {
        this.inventory = 0;
        this.isDefault = false;
    }
}
exports.CreateProductVariationDto = CreateProductVariationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'SKU product variation' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductVariationDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Price product variation' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseFloat(value) : undefined),
    __metadata("design:type", Number)
], CreateProductVariationDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Percent off product variation' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseInt(value) : undefined),
    __metadata("design:type", Number)
], CreateProductVariationDto.prototype, "percentOff", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Inventory product variation' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseInt(value) : undefined),
    __metadata("design:type", Number)
], CreateProductVariationDto.prototype, "inventory", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Default product variation', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], CreateProductVariationDto.prototype, "isDefault", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Status product variation',
        enum: client_1.CommonStatus,
        default: client_1.CommonStatus.ACTIVE,
    }),
    (0, class_validator_1.IsEnum)(client_1.CommonStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProductVariationDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Attribute values for this variation', type: [create_product_variation_value_dto_1.CreateProductVariationValueDto] }),
    (0, class_transformer_1.Transform)(({ value }) => value.map((id) => (Number(id)))),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_transformer_1.Type)(() => create_product_variation_value_dto_1.CreateProductVariationValueDto),
    __metadata("design:type", Array)
], CreateProductVariationDto.prototype, "attributeValues", void 0);
//# sourceMappingURL=create-product-variation.dto.js.map