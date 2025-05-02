import { PrismaClient } from '@prisma/client';
import { slugify } from './utils/slugify';

export async function seedProductAttributes(prisma: PrismaClient) {
    console.log('Creating product attributes...');

    // Clean up existing data
    await prisma.productAttributeValue.deleteMany({});
    await prisma.productAttribute.deleteMany({});

    // Get all products
    const products = await prisma.product.findMany();

    for (const product of products) {
        // Create color attribute for each product
        const colorAttribute = await prisma.productAttribute.create({
            data: {
                productId: product.id,
                name: 'Color',
                slug: 'color',
                sort: 1,
                status: 'ACTIVE',
            },
        });

        // Create color values
        const colorValues = [
            { name: 'Black', value: '#000000' },
            { name: 'White', value: '#FFFFFF' },
            { name: 'Brown', value: '#964B00' },
            { name: 'Gray', value: '#808080' },
        ];

        for (const color of colorValues) {
            await prisma.productAttributeValue.create({
                data: {
                    attributeId: colorAttribute.id,
                    name: color.name,
                    slug: slugify(color.name),
                    value: color.value,
                    sort: 1,
                    status: 'ACTIVE',
                },
            });
        }

        // Create material attribute for each product
        const materialAttribute = await prisma.productAttribute.create({
            data: {
                productId: product.id,
                name: 'Material',
                slug: 'material',
                sort: 2,
                status: 'ACTIVE',
            },
        });

        // Create material values
        const materialValues = [
            { name: 'Wood', value: 'wood' },
            { name: 'Leather', value: 'leather' },
            { name: 'Metal', value: 'metal' },
            { name: 'Fabric', value: 'fabric' },
        ];

        for (const material of materialValues) {
            await prisma.productAttributeValue.create({
                data: {
                    attributeId: materialAttribute.id,
                    name: material.name,
                    slug: slugify(material.name),
                    value: material.value,
                    sort: 1,
                    status: 'ACTIVE',
                },
            });
        }

        // Create size attribute for each product
        const sizeAttribute = await prisma.productAttribute.create({
            data: {
                productId: product.id,
                name: 'Size',
                slug: 'size',
                sort: 3,
                status: 'ACTIVE',
            },
        });

        // Create size values
        const sizeValues = [
            { name: 'Small', value: 'S' },
            { name: 'Medium', value: 'M' },
            { name: 'Large', value: 'L' },
            { name: 'Extra Large', value: 'XL' },
        ];

        for (const size of sizeValues) {
            await prisma.productAttributeValue.create({
                data: {
                    attributeId: sizeAttribute.id,
                    name: size.name,
                    slug: slugify(size.name),
                    value: size.value,
                    sort: 1,
                    status: 'ACTIVE',
                },
            });
        }
    }

    console.log('Product attributes created successfully');
}
