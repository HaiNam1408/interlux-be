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
exports.CreateProductAttributeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const create_product_attribute_value_dto_1 = require("./create-product-attribute-value.dto");
class CreateProductAttributeDto {
}
exports.CreateProductAttributeDto = CreateProductAttributeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Attribute name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductAttributeDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sort order' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseInt(value) : undefined),
    __metadata("design:type", Number)
], CreateProductAttributeDto.prototype, "sort", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Attribute status',
        enum: client_1.CommonStatus,
        default: client_1.CommonStatus.ACTIVE,
    }),
    (0, class_validator_1.IsEnum)(client_1.CommonStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProductAttributeDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Attribute values', type: [create_product_attribute_value_dto_1.CreateProductAttributeValueDto] }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? JSON.parse(value) : value),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => create_product_attribute_value_dto_1.CreateProductAttributeValueDto),
    __metadata("design:type", Array)
], CreateProductAttributeDto.prototype, "values", void 0);
//# sourceMappingURL=create-product-attribute.dto.js.map