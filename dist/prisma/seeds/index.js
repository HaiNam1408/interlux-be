"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const _01_users_1 = require("./01-users");
const _02_categories_1 = require("./02-categories");
const _04_products_1 = require("./04-products");
const _03_product_attributes_1 = require("./03-product-attributes");
const _05_product_variations_1 = require("./05-product-variations");
const _06_coupons_1 = require("./06-coupons");
const _07_shipping_1 = require("./07-shipping");
const _08_order_1 = require("./08-order");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seeding...');
    console.log('Seeding users...');
    await (0, _01_users_1.seedUsers)(prisma);
    console.log('Seeding categories...');
    await (0, _02_categories_1.seedCategories)(prisma);
    console.log('Seeding products...');
    await (0, _04_products_1.seedProducts)(prisma);
    console.log('Seeding product attributes...');
    await (0, _03_product_attributes_1.seedProductAttributes)(prisma);
    console.log('Seeding product variations...');
    await (0, _05_product_variations_1.seedProductVariations)(prisma);
    console.log('Seeding coupons...');
    await (0, _06_coupons_1.seedCoupons)(prisma);
    console.log('Seeding shipping methods...');
    await (0, _07_shipping_1.seedShipping)(prisma);
    console.log('Seeding orders...');
    await (0, _08_order_1.seedOrders)(prisma);
    console.log('✅ Seeding completed!');
}
main()
    .catch((e) => {
    console.error('❌ Error while seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=index.js.map