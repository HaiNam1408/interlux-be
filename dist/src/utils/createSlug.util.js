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
exports.SlugUtil = void 0;
const common_1 = require("@nestjs/common");
const slugify_1 = require("slugify");
let SlugUtil = class SlugUtil {
    constructor() { }
    static createSlug(title) {
        const withoutAccents = title
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D");
        return (0, slugify_1.default)(withoutAccents, {
            lower: true,
            strict: true,
            trim: true,
        });
    }
};
exports.SlugUtil = SlugUtil;
exports.SlugUtil = SlugUtil = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SlugUtil);
//# sourceMappingURL=createSlug.util.js.map