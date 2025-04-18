import { PrismaClient } from '@prisma/client';
import { slugify } from './utils/slugify';

export async function seedVariations(prisma: PrismaClient) {
    // Delete existing data to avoid duplicates
    await prisma.variationOption.deleteMany({});
    await prisma.variation.deleteMany({});

    // Create color variation
    const colorVariation = await prisma.variation.create({
        data: {
            name: 'Color',
            slug: 'color',
            sort: 1,
            status: 'ACTIVE',
        },
    });

    const colors = [
        { name: 'White', value: '#FFFFFF' },
        { name: 'Black', value: '#000000' },
        { name: 'Wooden Brown', value: '#795548' },
        { name: 'Gray', value: '#9E9E9E' },
        { name: 'Beige', value: '#F5F5DC' },
        { name: 'Navy Blue', value: '#2196F3' },
        { name: 'Green', value: '#4CAF50' },
        { name: 'Gold', value: '#D4AF37' },
    ];

    for (let i = 0; i < colors.length; i++) {
        await prisma.variationOption.create({
            data: {
                name: colors[i].name,
                slug: slugify(colors[i].name),
                value: colors[i].value,
                variationId: colorVariation.id,
                sort: i + 1,
                status: 'ACTIVE',
            },
        });
    }

    // Create material variation
    const materialVariation = await prisma.variation.create({
        data: {
            name: 'Material',
            slug: 'material',
            sort: 2,
            status: 'ACTIVE',
        },
    });

    const materials = [
        'Oak Wood',
        'Walnut Wood',
        'Genuine Leather',
        'Synthetic Leather',
        'Velvet',
        'Cotton',
        'Glass',
        'Metal',
        'Marble',
        'Granite',
        'MDF',
        'Premium Plastic',
    ];

    for (let i = 0; i < materials.length; i++) {
        await prisma.variationOption.create({
            data: {
                name: materials[i],
                slug: slugify(materials[i]),
                variationId: materialVariation.id,
                sort: i + 1,
                status: 'ACTIVE',
            },
        });
    }

    // Create size variation
    const sizeVariation = await prisma.variation.create({
        data: {
            name: 'Size',
            slug: 'size',
            sort: 3,
            status: 'ACTIVE',
        },
    });

    const sizes = [
        { name: 'Small', value: 'S' },
        { name: 'Medium', value: 'M' },
        { name: 'Large', value: 'L' },
        { name: 'Extra Large', value: 'XL' },
        { name: 'Custom', value: 'Custom' },
    ];

    for (let i = 0; i < sizes.length; i++) {
        await prisma.variationOption.create({
            data: {
                name: sizes[i].name,
                slug: slugify(sizes[i].name),
                value: sizes[i].value,
                variationId: sizeVariation.id,
                sort: i + 1,
                status: 'ACTIVE',
            },
        });
    }

    // Create style variation
    const styleVariation = await prisma.variation.create({
        data: {
            name: 'Style',
            slug: 'style',
            sort: 4,
            status: 'ACTIVE',
        },
    });

    const styles = [
        'Modern',
        'Classic',
        'Minimalist',
        'Scandinavian',
        'Industrial',
        'Mid-century',
        'Art Deco',
        'Bohemian',
    ];

    for (let i = 0; i < styles.length; i++) {
        await prisma.variationOption.create({
            data: {
                name: styles[i],
                slug: slugify(styles[i]),
                variationId: styleVariation.id,
                sort: i + 1,
                status: 'ACTIVE',
            },
        });
    }

    console.log('Variations and variation options created successfully');
}