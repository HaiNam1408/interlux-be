import { SlugUtil } from './../../src/utils/createSlug.util';
import { PrismaClient } from '@prisma/client';

export async function seedCategories(prisma: PrismaClient) {
    // Delete existing data to avoid duplicates
    await prisma.category.deleteMany({});

    // Create parent categories
    const mainCategories = [
        { name: 'Living Room', sort: 1 },
        { name: 'Bedroom', sort: 2 },
        { name: 'Dining Room', sort: 3 },
        { name: 'Home Office', sort: 4 },
        { name: 'Bathroom', sort: 5 },
        { name: 'Outdoor Space', sort: 6 },
    ];

    for (const category of mainCategories) {
        await prisma.category.create({
            data: {
                name: category.name,
                slug: SlugUtil.createSlug(category.name),
                sort: category.sort,
                status: 'ACTIVE',
            },
        });
    }

    // Create subcategories for Living Room
    const livingRoomCategory = await prisma.category.findFirst({
        where: { slug: 'living-room' },
    });

    if (livingRoomCategory) {
        const livingRoomSubCategories = [
            { name: 'Sofas', sort: 1 },
            { name: 'Coffee Tables', sort: 2 },
            { name: 'TV Units', sort: 3 },
            { name: 'Armchairs', sort: 4 },
            { name: 'Console Tables', sort: 5 },
        ];

        for (const subCategory of livingRoomSubCategories) {
            await prisma.category.create({
                data: {
                    name: subCategory.name,
                    slug: SlugUtil.createSlug(subCategory.name),
                    sort: subCategory.sort,
                    parentId: livingRoomCategory.id,
                    status: 'ACTIVE',
                },
            });
        }
    }

    // Create subcategories for Bedroom
    const bedroomCategory = await prisma.category.findFirst({
        where: { slug: 'bedroom' },
    });

    if (bedroomCategory) {
        const bedroomSubCategories = [
            { name: 'Beds', sort: 1 },
            { name: 'Wardrobes', sort: 2 },
            { name: 'Dressing Tables', sort: 3 },
            { name: 'Bedside Tables', sort: 4 },
            { name: 'Mattresses', sort: 5 },
        ];

        for (const subCategory of bedroomSubCategories) {
            await prisma.category.create({
                data: {
                    name: subCategory.name,
                    slug: SlugUtil.createSlug(subCategory.name),
                    sort: subCategory.sort,
                    parentId: bedroomCategory.id,
                    status: 'ACTIVE',
                },
            });
        }
    }

    // Create subcategories for Dining Room
    const diningRoomCategory = await prisma.category.findFirst({
        where: { slug: 'dining-room' },
    });

    if (diningRoomCategory) {
        const diningRoomSubCategories = [
            { name: 'Dining Tables', sort: 1 },
            { name: 'Dining Chairs', sort: 2 },
            { name: 'Cabinets', sort: 3 },
            { name: 'Wine Racks', sort: 4 },
            { name: 'Kitchen Islands', sort: 5 },
        ];

        for (const subCategory of diningRoomSubCategories) {
            await prisma.category.create({
                data: {
                    name: subCategory.name,
                    slug: SlugUtil.createSlug(subCategory.name),
                    sort: subCategory.sort,
                    parentId: diningRoomCategory.id,
                    status: 'ACTIVE',
                },
            });
        }
    }

    // Create subcategories for Home Office
    const officeCategory = await prisma.category.findFirst({
        where: { slug: 'home-office' },
    });

    if (officeCategory) {
        const officeSubCategories = [
            { name: 'Desks', sort: 1 },
            { name: 'Office Chairs', sort: 2 },
            { name: 'Bookshelves', sort: 3 },
            { name: 'Filing Cabinets', sort: 4 },
        ];

        for (const subCategory of officeSubCategories) {
            await prisma.category.create({
                data: {
                    name: subCategory.name,
                    slug: SlugUtil.createSlug(subCategory.name),
                    sort: subCategory.sort,
                    parentId: officeCategory.id,
                    status: 'ACTIVE',
                },
            });
        }
    }

    console.log('Product categories created successfully');
}