import { PrismaClient } from "@prisma/client";

export async function seedShipping(prisma: PrismaClient) {
    // Delete existing data to avoid duplicates
    await prisma.shipping.deleteMany({});

    const shippingMethods: any[] = [
        {
            name: 'Standard Shipping',
            description: 'Delivery within 3-5 business days',
            price: 30000,
            estimatedDays: 4,
            provider: 'VNPost',
        },
        {
            name: 'Express Shipping',
            description: 'Delivery within 1-2 business days',
            price: 60000,
            estimatedDays: 2,
            provider: 'Giao Hang Nhanh',
        },
        {
            name: 'Same Day Delivery',
            description: 'Delivery within 24 hours (urban areas only)',
            price: 100000,
            estimatedDays: 1,
            provider: 'Giao Hang Tiet Kiem',
        },
        {
            name: 'Free Shipping',
            description: 'Free shipping for orders above 2,000,000 VND',
            price: 0,
            estimatedDays: 5,
            provider: 'VNPost',
        },
        {
            name: 'Economy Shipping',
            description: 'Budget-friendly option with 5-7 business days delivery',
            price: 20000,
            estimatedDays: 6,
            provider: 'VNPost',
        },
        {
            name: 'Premium Delivery',
            description: 'White glove service with installation and packaging removal',
            price: 250000,
            estimatedDays: 3,
            provider: 'Premium Logistics',
        },
        {
            name: 'International Shipping',
            description: 'Delivery to selected countries within 10-15 business days',
            price: 500000,
            estimatedDays: 12,
            provider: 'DHL',
        },
        {
            name: 'Store Pickup',
            description: 'Collect your order from our nearest store',
            price: 0,
            estimatedDays: 1,
            provider: 'Self',
        }
    ];

    for (const method of shippingMethods) {
        await prisma.shipping.create({
            data: method
        });
    }

    console.log(`Created ${shippingMethods.length} shipping methods`);
}