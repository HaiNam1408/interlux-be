import { PrismaClient } from '@prisma/client';

// Helper function to ensure images are in the correct format
function ensureImageFormat(images: any) {
    // If images is already an array of objects with the correct structure, return as is
    if (Array.isArray(images) &&
        images.length > 0 &&
        typeof images[0] === 'object' &&
        'fileName' in images[0] &&
        'filePath' in images[0] &&
        'type' in images[0]) {
        return images;
    }

    // If images is a string (JSON), parse it
    if (typeof images === 'string') {
        try {
            const parsed = JSON.parse(images);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (e) {
            // If parsing fails, continue with other conversions
        }
    }

    // If images is an array of strings (URLs), convert to objects
    if (Array.isArray(images) && typeof images[0] === 'string') {
        return images.map(url => {
            const fileName = `product/${Date.now()}-${Math.random().toString(36).substring(2, 10)}.jpg`;
            return {
                fileName: fileName,
                filePath: url,
                type: 'image'
            };
        });
    }

    // Default: return empty array if images is invalid
    return [];
}

export async function seedProductVariations(prisma: PrismaClient) {
    console.log('Creating product variations...');

    // Clean up existing data
    await prisma.productVariationValue.deleteMany({});
    await prisma.productVariation.deleteMany({});

    // Get all products
    const products = await prisma.product.findMany();

    for (const product of products) {
        // Get product attributes
        const attributes = await prisma.productAttribute.findMany({
            where: { productId: product.id },
            include: { values: true },
        });

        // Find specific attributes
        const colorAttribute = attributes.find(attr => attr.name === 'Color');
        const materialAttribute = attributes.find(attr => attr.name === 'Material');
        const sizeAttribute = attributes.find(attr => attr.name === 'Size');

        if (!colorAttribute || !materialAttribute || !sizeAttribute) {
            console.log(`Skipping product ${product.id} - missing attributes`);
            continue;
        }

        // Create default variation
        const defaultVariation = await prisma.productVariation.create({
            data: {
                productId: product.id,
                sku: `${product.slug}-default`,
                price: product.price,
                percentOff: product.percentOff || 0,
                inventory: 50,
                images: ensureImageFormat(product.images),
                isDefault: true,
                status: 'ACTIVE',
            },
        });

        // Add default attribute values
        const defaultColor = colorAttribute.values[0];
        const defaultMaterial = materialAttribute.values[0];
        const defaultSize = sizeAttribute.values.find(v => v.name === 'Medium') || sizeAttribute.values[0];

        await prisma.productVariationValue.create({
            data: {
                productVariationId: defaultVariation.id,
                attributeValueId: defaultColor.id,
            },
        });

        await prisma.productVariationValue.create({
            data: {
                productVariationId: defaultVariation.id,
                attributeValueId: defaultMaterial.id,
            },
        });

        await prisma.productVariationValue.create({
            data: {
                productVariationId: defaultVariation.id,
                attributeValueId: defaultSize.id,
            },
        });

        // Add color variations
        for (let i = 1; i < Math.min(colorAttribute.values.length, 4); i++) {
            const colorValue = colorAttribute.values[i];

            const colorVariation = await prisma.productVariation.create({
                data: {
                    productId: product.id,
                    sku: `${product.slug}-${colorValue.slug}`,
                    price: product.price + (i * 50), // Increase price slightly for different colors
                    percentOff: product.percentOff || 0,
                    inventory: 30,
                    images: ensureImageFormat(product.images),
                    isDefault: false,
                    status: 'ACTIVE',
                },
            });

            // Add attribute values
            await prisma.productVariationValue.create({
                data: {
                    productVariationId: colorVariation.id,
                    attributeValueId: colorValue.id,
                },
            });

            await prisma.productVariationValue.create({
                data: {
                    productVariationId: colorVariation.id,
                    attributeValueId: defaultMaterial.id,
                },
            });

            await prisma.productVariationValue.create({
                data: {
                    productVariationId: colorVariation.id,
                    attributeValueId: defaultSize.id,
                },
            });
        }

        // Add material variations for premium products
        if (product.price > 2000) {
            for (let i = 1; i < Math.min(materialAttribute.values.length, 3); i++) {
                const materialValue = materialAttribute.values[i];

                const materialVariation = await prisma.productVariation.create({
                    data: {
                        productId: product.id,
                        sku: `${product.slug}-${materialValue.slug}`,
                        price: product.price + 200 + (i * 100), // Premium for special materials
                        percentOff: Math.max(0, (product.percentOff || 0) - 5), // Less discount for premium variants
                        inventory: 15,
                        images: ensureImageFormat(product.images),
                        isDefault: false,
                        status: 'ACTIVE',
                    },
                });

                // Add attribute values
                await prisma.productVariationValue.create({
                    data: {
                        productVariationId: materialVariation.id,
                        attributeValueId: defaultColor.id,
                    },
                });

                await prisma.productVariationValue.create({
                    data: {
                        productVariationId: materialVariation.id,
                        attributeValueId: materialValue.id,
                    },
                });

                await prisma.productVariationValue.create({
                    data: {
                        productVariationId: materialVariation.id,
                        attributeValueId: defaultSize.id,
                    },
                });
            }
        }

        // Add size variations for furniture that comes in different sizes
        if (['beds', 'sofas', 'dining-tables'].some(term => product.slug.includes(term))) {
            for (let i = 0; i < sizeAttribute.values.length; i++) {
                const sizeValue = sizeAttribute.values[i];

                // Skip default size "Medium" as it's covered by default variation
                if (sizeValue.name === 'Medium') continue;

                // Small sizes are cheaper, large sizes are more expensive
                const priceAdjustment = sizeValue.name.includes('Small') ? -200 : 300;

                const sizeVariation = await prisma.productVariation.create({
                    data: {
                        productId: product.id,
                        sku: `${product.slug}-${sizeValue.slug}`,
                        price: product.price + priceAdjustment,
                        percentOff: product.percentOff || 0,
                        inventory: sizeValue.name.includes('Small') ? 40 : 20,
                        images: ensureImageFormat(product.images),
                        isDefault: false,
                        status: 'ACTIVE',
                    },
                });

                // Add attribute values
                await prisma.productVariationValue.create({
                    data: {
                        productVariationId: sizeVariation.id,
                        attributeValueId: defaultColor.id,
                    },
                });

                await prisma.productVariationValue.create({
                    data: {
                        productVariationId: sizeVariation.id,
                        attributeValueId: defaultMaterial.id,
                    },
                });

                await prisma.productVariationValue.create({
                    data: {
                        productVariationId: sizeVariation.id,
                        attributeValueId: sizeValue.id,
                    },
                });
            }
        }
    }

    console.log('Product variations created successfully');
}
