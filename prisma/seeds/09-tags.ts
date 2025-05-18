import { PrismaClient } from '@prisma/client';
import { SlugUtil } from '../../src/utils/createSlug.util';

export async function seedTags(prisma: PrismaClient) {
    await prisma.tag.deleteMany({});

    const tags = [
        { name: 'Furniture' },
        { name: 'Design' },
        { name: 'Modern Style' },
        { name: 'Classic Style' },
        { name: 'Living Room' },
        { name: 'Bedroom' },
        { name: 'Dining Room' },
        { name: 'Home Office' },
        { name: 'Decoration Tips' },
        { name: 'Trends' },
        { name: 'Natural Wood' },
        { name: 'Sustainable Materials' },
        { name: 'Colors' },
        { name: 'Lighting' },
        { name: 'Small Spaces' },
        { name: 'Feng Shui' },
        { name: 'DIY' },
        { name: 'Furniture Care' },
        { name: 'New Products' },
        { name: 'Promotions' }
    ];

    const createdTags = [];

    for (const tag of tags) {
        const slug = SlugUtil.createSlug(tag.name);

        const createdTag = await prisma.tag.create({
            data: {
                name: tag.name,
                slug: slug
            }
        });

        createdTags.push(createdTag);
    }

    console.log(`Created ${createdTags.length} tags`);

    return createdTags;
}
