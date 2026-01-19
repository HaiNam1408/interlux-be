"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedProductVariations = seedProductVariations;
function ensureImageFormat(images) {
    if (Array.isArray(images) &&
        images.length > 0 &&
        typeof images[0] === 'object' &&
        'fileName' in images[0] &&
        'filePath' in images[0] &&
        'type' in images[0]) {
        return images;
    }
    if (typeof images === 'string') {
        try {
            const parsed = JSON.parse(images);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
        catch (e) {
        }
    }
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
    return [];
}
async function seedProductVariations(prisma) {
    console.log('Creating product variations...');
    await prisma.productVariationValue.deleteMany({});
    await prisma.productVariation.deleteMany({});
    const products = await prisma.product.findMany();
    for (const product of products) {
        const attributes = await prisma.productAttribute.findMany({
            where: { productId: product.id },
            include: { values: true },
        });
        const colorAttribute = attributes.find(attr => attr.name === 'Color');
        const materialAttribute = attributes.find(attr => attr.name === 'Material');
        const sizeAttribute = attributes.find(attr => attr.name === 'Size');
        if (!colorAttribute || !materialAttribute || !sizeAttribute) {
            console.log(`Skipping product ${product.id} - missing attributes`);
            continue;
        }
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
        for (let i = 1; i < Math.min(colorAttribute.values.length, 4); i++) {
            const colorValue = colorAttribute.values[i];
            const colorVariation = await prisma.productVariation.create({
                data: {
                    productId: product.id,
                    sku: `${product.slug}-${colorValue.slug}`,
                    price: product.price + (i * 50),
                    percentOff: product.percentOff || 0,
                    inventory: 30,
                    images: ensureImageFormat(product.images),
                    isDefault: false,
                    status: 'ACTIVE',
                },
            });
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
        if (product.price > 2000) {
            for (let i = 1; i < Math.min(materialAttribute.values.length, 3); i++) {
                const materialValue = materialAttribute.values[i];
                const materialVariation = await prisma.productVariation.create({
                    data: {
                        productId: product.id,
                        sku: `${product.slug}-${materialValue.slug}`,
                        price: product.price + 200 + (i * 100),
                        percentOff: Math.max(0, (product.percentOff || 0) - 5),
                        inventory: 15,
                        images: ensureImageFormat(product.images),
                        isDefault: false,
                        status: 'ACTIVE',
                    },
                });
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
        if (['beds', 'sofas', 'dining-tables'].some(term => product.slug.includes(term))) {
            for (let i = 0; i < sizeAttribute.values.length; i++) {
                const sizeValue = sizeAttribute.values[i];
                if (sizeValue.name === 'Medium')
                    continue;
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
//# sourceMappingURL=05-product-variations.js.map