import { Injectable } from "@nestjs/common";
import slugify from "slugify";

@Injectable()
export class SlugUtil {
    constructor() { }

    static createSlug(title: string): string {
        const withoutAccents = title
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D");

        return slugify(withoutAccents, {
            lower: true,
            strict: true,
            trim: true,
        });
    }
}
