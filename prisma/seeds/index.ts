import { PrismaClient } from '@prisma/client';
import { seedUsers } from './01-users';
import { seedCategories } from './02-categories';
import { seedProducts } from './04-products';
import { seedProductAttributes } from './03-product-attributes';
import { seedProductVariations } from './05-product-variations';
import { seedCoupons } from './06-coupons';
import { seedShipping } from './07-shipping';
import { seedOrders } from './08-order';
import { seedTags } from './09-tags';
import { seedBlogPosts } from './10-blog-posts';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    console.log('Seeding users...');
    await seedUsers(prisma);

    console.log('Seeding categories...');
    await seedCategories(prisma);

    console.log('Seeding products...');
    await seedProducts(prisma);

    console.log('Seeding product attributes...');
    await seedProductAttributes(prisma);

    console.log('Seeding product variations...');
    await seedProductVariations(prisma);

    console.log('Seeding coupons...');
    await seedCoupons(prisma);

    console.log('Seeding shipping methods...');
    await seedShipping(prisma);

    console.log('Seeding orders...');
    await seedOrders(prisma);

    console.log('Seeding blog tags...');
    await seedTags(prisma);

    console.log('Seeding blog posts...');
    await seedBlogPosts(prisma);

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