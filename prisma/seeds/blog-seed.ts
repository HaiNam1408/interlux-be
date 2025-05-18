import { PrismaClient } from '@prisma/client';
import { seedTags } from './09-tags';
import { seedBlogPosts } from './10-blog-posts';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting blog data seeding...');

    console.log('Seeding blog tags...');
    await seedTags(prisma);

    console.log('Seeding blog posts...');
    await seedBlogPosts(prisma);

    console.log('✅ Blog seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Error while seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
