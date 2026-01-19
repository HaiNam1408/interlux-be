"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedProducts = seedProducts;
const slugify_1 = require("./utils/slugify");
function convertToImageObjects(imageUrls) {
    return imageUrls.map(url => {
        const fileName = `product/${Date.now()}-${Math.random().toString(36).substring(2, 10)}.jpg`;
        return {
            fileName: fileName,
            filePath: url,
            type: 'image'
        };
    });
}
async function seedProducts(prisma) {
    try {
        await prisma.productVariationValue.deleteMany({});
        await prisma.productVariation.deleteMany({});
        await prisma.productAttributeValue.deleteMany({});
        await prisma.productAttribute.deleteMany({});
        await prisma.product.deleteMany({});
    }
    catch (error) {
        console.error('Error cleaning up data:', error);
    }
    const sofaCategory = await prisma.category.findFirst({
        where: { slug: 'sofas' },
    });
    const bedCategory = await prisma.category.findFirst({
        where: { slug: 'beds' },
    });
    const diningTableCategory = await prisma.category.findFirst({
        where: { slug: 'dining-tables' },
    });
    const tvUnitCategory = await prisma.category.findFirst({
        where: { slug: 'tv-units' },
    });
    const deskCategory = await prisma.category.findFirst({
        where: { slug: 'desks' },
    });
    if (sofaCategory) {
        const sofas = [
            {
                title: 'Milano Corner Sofa',
                description: 'Premium corner sofa with modern, minimalist design. Natural oak frame and premium foam cushions for maximum comfort. Upholstered with high-quality fabric that is easy to clean.',
                price: 2500,
                percentOff: 10,
                categoryId: sofaCategory.id,
                attributes: {
                    "Dimensions": "L300 x W180 x H80 cm",
                    "Frame Material": "Natural oak wood",
                    "Cushion Material": "Premium foam",
                    "Warranty": "3 years"
                },
                images: [
                    "https://i0.wp.com/suffadesign.com/wp-content/uploads/2021/10/milano-sofa.jpg?fit=371%2C371&ssl=1",
                    "https://i0.wp.com/suffadesign.com/wp-content/uploads/2021/10/Milano-SalaEstar-Amb_v01.jpg?fit=2154%2C1452&ssl=1",
                    "https://i0.wp.com/suffadesign.com/wp-content/uploads/2021/10/Milano-SalaEstar-Porm_v01.jpg?w=1405&ssl=1"
                ],
                sort: 1,
                status: 'ACTIVE'
            },
            {
                title: 'Minimalist Sofa',
                description: 'Minimalist sofa suitable for small spaces and modern styles. Pine wood frame treated against termites, D40 foam cushions for comfort and durability.',
                price: 1200,
                percentOff: 0,
                categoryId: sofaCategory.id,
                attributes: {
                    "Dimensions": "W180 x D80 x H75 cm",
                    "Frame Material": "Pine wood",
                    "Cushion Material": "D40 foam",
                    "Warranty": "2 years"
                },
                images: [
                    "https://www.amazon.ca/Acanva-Minimalist-Rounded-Wool-Like-Upholstered/dp/B0B31LHLM2",
                    "https://www.amazon.com.au/Acanva-Modern-Minimalist-Rounded-Upholstered/dp/B0B31LHLM2"
                ],
                sort: 2,
                status: 'ACTIVE'
            },
            {
                title: 'Venice Leather Sofa',
                description: 'Premium leather sofa imported from Italy with elegant, luxurious design. 100% genuine cow leather, treated for water resistance and easy cleaning.',
                price: 4500,
                percentOff: 5,
                categoryId: sofaCategory.id,
                attributes: {
                    "Dimensions": "W220 x D90 x H85 cm",
                    "Frame Material": "Walnut wood",
                    "Upholstery Material": "Genuine Italian leather",
                    "Warranty": "5 years"
                },
                images: [
                    "https://cdn.store-assets.com/s/262752/i/32874272.jpg",
                    "https://cdn.store-assets.com/s/262752/i/32874272.jpg",
                ],
                sort: 3,
                status: 'ACTIVE'
            }
        ];
        for (const sofa of sofas) {
            const productImages = convertToImageObjects(sofa.images);
            await prisma.product.create({
                data: {
                    title: sofa.title,
                    slug: (0, slugify_1.slugify)(sofa.title),
                    description: sofa.description,
                    price: sofa.price,
                    percentOff: sofa.percentOff,
                    categoryId: sofa.categoryId,
                    attributes: sofa.attributes,
                    images: productImages,
                    sort: sofa.sort,
                    status: sofa.status,
                },
            });
        }
    }
    if (bedCategory) {
        const beds = [
            {
                title: 'Harmony Bed',
                description: 'Premium bed with luxurious design, combining walnut wood and genuine leather. Soft leather headboard and natural walnut wood legs.',
                price: 3500,
                percentOff: 0,
                categoryId: bedCategory.id,
                attributes: {
                    "Dimensions": "King (180 x 200 cm)",
                    "Frame Material": "Natural walnut wood",
                    "Headboard Material": "Genuine cow leather",
                    "Warranty": "5 years"
                },
                images: [
                    "https://truongthang.vn/wp-content/uploads/2024/03/Harmony-bed-1000-x-1000-3.png",
                    "https://www.lakdi.com/cdn/shop/files/King_Size_Wooden_Bed_in_Light_Grey_Fabric_Single_Double_Head-back_with_Hydraulic_Storage_-_-3759224.jpg?v=1744030872&width=1200"
                ],
                sort: 1,
                status: 'ACTIVE'
            },
            {
                title: 'Sofia Bed',
                description: 'Elegant bed with convenient storage compartments. Minimalist design that still ensures luxury for your bedroom.',
                price: 1800,
                percentOff: 15,
                categoryId: bedCategory.id,
                attributes: {
                    "Dimensions": "Queen (160 x 200 cm)",
                    "Material": "Natural oak wood",
                    "Special Feature": "Under-bed storage",
                    "Warranty": "3 years"
                },
                images: [
                    "https://artisan-production.ams3.cdn.digitaloceanspaces.com/Latus_Table_Inspiration_1_323e92df13.png",
                    "https://cdn.store-assets.com/s/262752/i/32874272.jpg"
                ],
                sort: 2,
                status: 'ACTIVE'
            }
        ];
        for (const bed of beds) {
            const productImages = convertToImageObjects(bed.images);
            await prisma.product.create({
                data: {
                    title: bed.title,
                    slug: (0, slugify_1.slugify)(bed.title),
                    description: bed.description,
                    price: bed.price,
                    percentOff: bed.percentOff,
                    categoryId: bed.categoryId,
                    attributes: bed.attributes,
                    images: productImages,
                    sort: bed.sort,
                    status: bed.status,
                },
            });
        }
    }
    if (diningTableCategory) {
        const diningTables = [
            {
                title: 'Artisan Dining Table',
                description: 'Premium dining table with natural marble top and gold-plated metal legs. Luxurious design suitable for high-end dining spaces.',
                price: 2800,
                percentOff: 0,
                categoryId: diningTableCategory.id,
                attributes: {
                    "Dimensions": "D200 x W100 x H75 cm",
                    "Tabletop Material": "Natural marble",
                    "Leg Material": "PVD gold-plated metal",
                    "Suitable for": "6-8 chairs",
                    "Warranty": "5 years"
                },
                images: [
                    "https://artisan-production.ams3.cdn.digitaloceanspaces.com/Latus_Table_Inspiration_1_323e92df13.png",
                    "https://artisan-production.ams3.cdn.digitaloceanspaces.com/Latus_Table_Inspiration_1_323e92df13.png"
                ],
                sort: 1,
                status: 'ACTIVE'
            },
            {
                title: 'Nordic Dining Table',
                description: 'Scandinavian style dining table with oak wood top and natural wood legs. Simple, elegant design suitable for modern, minimalist spaces.',
                price: 1500,
                percentOff: 10,
                categoryId: diningTableCategory.id,
                attributes: {
                    "Dimensions": "D180 x W90 x H75 cm",
                    "Material": "Natural oak wood",
                    "Suitable for": "6 chairs",
                    "Warranty": "3 years"
                },
                images: [
                    "https://d1u8v8zs97kc2a.cloudfront.net/product/AC011450-1/Nfp6NKdUBvgheEVqB2cvCEO7fWhmOMMxk1M6gwOy.webp",
                    "https://d1u8v8zs97kc2a.cloudfront.net/product/AC011450-1/Nfp6NKdUBvgheEVqB2cvCEO7fWhmOMMxk1M6gwOy.webp"
                ],
                sort: 2,
                status: 'ACTIVE'
            }
        ];
        for (const table of diningTables) {
            const productImages = convertToImageObjects(table.images);
            await prisma.product.create({
                data: {
                    title: table.title,
                    slug: (0, slugify_1.slugify)(table.title),
                    description: table.description,
                    price: table.price,
                    percentOff: table.percentOff,
                    categoryId: table.categoryId,
                    attributes: table.attributes,
                    images: productImages,
                    sort: table.sort,
                    status: table.status,
                },
            });
        }
    }
    if (tvUnitCategory) {
        const tvUnitImages = convertToImageObjects([
            "https://cdn.store-assets.com/s/262752/i/32874272.jpg",
            "https://cdn.store-assets.com/s/262752/i/32874272.jpg"
        ]);
        await prisma.product.create({
            data: {
                title: 'Manhattan TV Unit',
                slug: 'manhattan-tv-unit',
                description: 'Modern TV unit with multiple storage compartments. Combines wood and metal for a luxurious feel in your living room.',
                price: 1850,
                percentOff: 5,
                categoryId: tvUnitCategory.id,
                attributes: {
                    "Dimensions": "W200 x D45 x H50 cm",
                    "Material": "MDF with oak veneer, powder-coated metal frame",
                    "Suitable TV size": "Up to 85 inches",
                    "Warranty": "2 years"
                },
                images: tvUnitImages,
                sort: 1,
                status: 'ACTIVE',
            },
        });
    }
    if (deskCategory) {
        const deskImages = convertToImageObjects([
            "https://cdn.store-assets.com/s/262752/i/32874272.jpg",
            "https://cdn.store-assets.com/s/262752/i/32874272.jpg"
        ]);
        await prisma.product.create({
            data: {
                title: 'Executive Office Desk',
                slug: 'executive-office-desk',
                description: 'Premium office desk with spacious working surface and built-in cable management. The perfect blend of functionality and elegance for your home office.',
                price: 1200,
                percentOff: 0,
                categoryId: deskCategory.id,
                attributes: {
                    "Dimensions": "W160 x D80 x H75 cm",
                    "Material": "Walnut wood with leather inlay",
                    "Features": "Cable management, drawer storage",
                    "Warranty": "3 years"
                },
                images: deskImages,
                sort: 1,
                status: 'ACTIVE',
            },
        });
    }
    console.log('Products created successfully');
}
//# sourceMappingURL=04-products.js.map