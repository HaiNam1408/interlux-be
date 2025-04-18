import { PrismaClient } from '@prisma/client';

export async function seedProductVariations(prisma: PrismaClient) {
    // Let's get all products
    const products = await prisma.product.findMany();

    // Get all variation options
    const colorOptions = await prisma.variationOption.findMany({
        where: {
            variation: {
                slug: 'color'
            }
        }
    });

    const materialOptions = await prisma.variationOption.findMany({
        where: {
            variation: {
                slug: 'material'
            }
        }
    });

    const sizeOptions = await prisma.variationOption.findMany({
        where: {
            variation: {
                slug: 'size'
            }
        }
    });

    // Create product variations for each product
    for (const product of products) {
        // Skip if product already has variations
        const existingVariations = await prisma.productVariation.count({
            where: { productId: product.id }
        });

        if (existingVariations > 0) continue;

        // We'll create multiple variations for each product
        const variations = [];

        // Default variation
        variations.push({
            productId: product.id,
            sku: `${product.slug}-default`,
            price: product.price,
            percentOff: product.percentOff,
            inventory: 50,
            images: product.images,
            isDefault: true,
            status: 'ACTIVE',
            options: []
        });

        // Add color variations
        for (let i = 0; i < Math.min(3, colorOptions.length); i++) {
            const colorOption = colorOptions[i];
            variations.push({
                productId: product.id,
                sku: `${product.slug}-${colorOption.slug}`,
                price: product.price + (i * 50), // Increase price slightly for different colors
                percentOff: product.percentOff,
                inventory: 30,
                images: product.images,
                isDefault: false,
                status: 'ACTIVE',
                options: [{ variationOptionId: colorOption.id }]
            });
        }

        // Add material + color combinations for premium products
        if (product.price > 2000) {
            for (let i = 0; i < Math.min(2, materialOptions.length); i++) {
                const materialOption = materialOptions[i];
                const colorOption = colorOptions[(i + 3) % colorOptions.length]; // Use different colors than above
                variations.push({
                    productId: product.id,
                    sku: `${product.slug}-${materialOption.slug}-${colorOption.slug}`,
                    price: product.price + 200 + (i * 100), // Premium for special materials
                    percentOff: Math.max(0, (product.percentOff || 0) - 5), // Less discount for premium variants
                    inventory: 15,
                    images: product.images,
                    isDefault: false,
                    status: 'ACTIVE',
                    options: [
                        { variationOptionId: materialOption.id },
                        { variationOptionId: colorOption.id }
                    ]
                });
            }
        }

        // Add size variations for furniture that comes in different sizes
        if (['beds', 'sofas', 'dining-tables'].includes(product.slug.split('-')[0])) {
            for (let i = 0; i < Math.min(3, sizeOptions.length); i++) {
                const sizeOption = sizeOptions[i];
                // Skip default size "Medium" as it's covered by default variation
                if (sizeOption.slug === 'medium') continue;

                // Small sizes are cheaper, large sizes are more expensive
                const priceAdjustment = sizeOption.slug.includes('small') ? -200 : 300;

                variations.push({
                    productId: product.id,
                    sku: `${product.slug}-${sizeOption.slug}`,
                    price: product.price + priceAdjustment,
                    percentOff: product.percentOff,
                    inventory: sizeOption.slug.includes('small') ? 40 : 20,
                    images: product.images,
                    isDefault: false,
                    status: 'ACTIVE',
                    options: [{ variationOptionId: sizeOption.id }]
                });
            }
        }

        // Create all variations for this product
        for (const variation of variations) {
            const { options, ...variationData } = variation;

            const createdVariation = await prisma.productVariation.create({
                data: variationData
            });

            // Create options for this variation
            if (options && options.length > 0) {
                for (const option of options) {
                    await prisma.productVariationOption.create({
                        data: {
                            productVariationId: createdVariation.id,
                            variationOptionId: option.variationOptionId
                        }
                    });
                }
            }
        }
    }

    console.log('Product variations created successfully');
}