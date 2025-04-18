import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export async function seedOrders(prisma: PrismaClient) {
    // Delete existing data to avoid duplicates
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.payment.deleteMany({});

    // Get data for creating orders
    const users = await prisma.user.findMany({ where: { role: 'USER' } });
    const products = await prisma.product.findMany({
        include: { variations: true }
    });
    const shippingMethods = await prisma.shipping.findMany();
    const coupons = await prisma.coupon.findMany({ where: { status: 'ACTIVE' } });

    // Define order statuses and payment methods
    const orderStatuses = ['PENDING', 'PROCESSING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'REFUNDED'];
    const orderStatusWeights = [5, 10, 15, 20, 25, 20, 3, 2]; // Weighted distribution for more realistic data
    const paymentMethods = ['BANK_TRANSFER', 'CREDIT_CARD', 'MOMO', 'VNPAY', 'PAYPAL', 'COD'];
    const paymentStatusMap = {
        'PENDING': ['PENDING'],
        'PROCESSING': ['PENDING', 'PROCESSING'],
        'CONFIRMED': ['PROCESSING', 'COMPLETED'],
        'SHIPPED': ['COMPLETED'],
        'DELIVERED': ['COMPLETED'],
        'COMPLETED': ['COMPLETED'],
        'CANCELLED': ['CANCELLED', 'REFUNDED'],
        'REFUNDED': ['REFUNDED']
    };

    // Cities and districts for address generation
    const cities = [
        'Ho Chi Minh City',
        'Hanoi',
        'Da Nang',
        'Nha Trang',
        'Can Tho',
        'Hue',
        'Hai Phong'
    ];

    const districts = {
        'Ho Chi Minh City': ['District 1', 'District 2', 'District 3', 'District 4', 'District 5', 'Binh Thanh', 'Phu Nhuan', 'Go Vap', 'Thu Duc'],
        'Hanoi': ['Hoan Kiem', 'Ba Dinh', 'Dong Da', 'Hai Ba Trung', 'Cau Giay', 'Tay Ho', 'Long Bien'],
        'Da Nang': ['Hai Chau', 'Thanh Khe', 'Lien Chieu', 'Ngu Hanh Son', 'Son Tra'],
        'Nha Trang': ['City Center', 'Vinh Nguyen', 'Vinh Hai', 'Phuoc Hai'],
        'Can Tho': ['Ninh Kieu', 'Binh Thuy', 'Cai Rang', 'O Mon'],
        'Hue': ['Hue City', 'An Cuu', 'Vy Da', 'Phu Hoi'],
        'Hai Phong': ['Hong Bang', 'Le Chan', 'Ngo Quyen', 'Kien An']
    };

    // Street names for address generation
    const streets = [
        'Nguyen Hue', 'Le Loi', 'Pasteur', 'Dong Khoi', 'Hai Ba Trung', 'Ly Tu Trong',
        'Nam Ky Khoi Nghia', 'Nguyen Thai Hoc', 'Tran Hung Dao', 'Le Duan', 'Mac Dinh Chi',
        'Pham Ngoc Thach', 'Vo Van Tan', 'Dinh Tien Hoang', 'Nguyen Dinh Chieu', 'Le Thanh Ton',
        'Phan Xich Long', 'Hoang Van Thu', 'Bach Dang', 'Nguyen Cong Tru', 'Phan Chu Trinh',
        'Ton That Thiep', 'Thai Van Lung', 'Truong Dinh', 'Mac Thi Buoi', 'Ho Tung Mau'
    ];

    // Generate order notes
    const orderNotes = [
        'Please call before delivery',
        'Leave the package at the door',
        'Please deliver on weekend',
        'Fragile items, handle with care',
        'Please deliver after 6pm',
        'Contact me before delivery',
        null, null, null, null, null, null  // More nulls to make notes less frequent
    ];

    // Create random number of orders for each user (3-15 orders per user)
    for (const user of users) {
        // Each user has 3-15 orders
        const orderCount = Math.floor(Math.random() * 13) + 3;

        for (let i = 0; i < orderCount; i++) {
            // Choose random products for order (1-6 products)
            const orderItems = [];
            const itemCount = Math.floor(Math.random() * 6) + 1;
            let subtotal = 0;

            // Choose random product indexes
            const selectedProductIndexes = [];
            while (selectedProductIndexes.length < itemCount) {
                const randomIndex = Math.floor(Math.random() * products.length);
                if (!selectedProductIndexes.includes(randomIndex)) {
                    selectedProductIndexes.push(randomIndex);
                }
            }

            // Create order items
            for (const index of selectedProductIndexes) {
                const product = products[index];
                const quantity = Math.floor(Math.random() * 3) + 1;

                // Choose random variant if available
                let variant = null;
                if (product.variations && product.variations.length > 0) {
                    const randomVariantIndex = Math.floor(Math.random() * product.variations.length);
                    variant = product.variations[randomVariantIndex];
                }

                const price = variant ? (variant.price || product.price) : product.price;
                const discount = variant ?
                    (variant.percentOff ? price * variant.percentOff / 100 : 0) :
                    (product.percentOff ? price * product.percentOff / 100 : 0);

                const totalItemPrice = (price - discount) * quantity;
                subtotal += totalItemPrice;

                // Create product metadata for order history
                const productImage = product.images ?
                    (Array.isArray(product.images) ? product.images[0] :
                        (typeof product.images === 'object' && product.images !== null ? Object.values(product.images)[0] : null)) :
                    "https://via.placeholder.com/300";

                orderItems.push({
                    productId: product.id,
                    productVariationId: variant ? variant.id : null,
                    quantity: quantity,
                    price: price,
                    discount: discount,
                    total: totalItemPrice,
                    metadata: {
                        productName: product.title,
                        productSlug: product.slug,
                        productImage: productImage,
                        variantSku: variant ? variant.sku : null,
                        variantDetails: variant ? await getVariantDetails(prisma, variant.id) : null
                    }
                });
            }

            // Choose random shipping method
            const randomShippingIndex = Math.floor(Math.random() * shippingMethods.length);
            const shipping = shippingMethods[randomShippingIndex];

            // Apply coupon sometimes (30% chance)
            let coupon = null;
            let discount = 0;
            if (Math.random() > 0.7) {
                const randomCouponIndex = Math.floor(Math.random() * coupons.length);
                coupon = coupons[randomCouponIndex];

                if (subtotal >= (coupon.minPurchase || 0)) {
                    if (coupon.type === 'PERCENTAGE') {
                        discount = subtotal * coupon.value / 100;
                    } else {
                        discount = coupon.value;
                    }
                }
            }

            // Calculate order values
            const shippingFee = shipping.price;
            const tax = subtotal * 0.08;  // 8% tax
            const total = subtotal + shippingFee + tax - discount;

            // Choose order status (weighted choice)
            const orderStatus = weightedRandomChoice(orderStatuses, orderStatusWeights);

            // Choose payment method
            const randomPaymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

            // Payment status depends on order status
            const possiblePaymentStatuses = paymentStatusMap[orderStatus];
            const randomPaymentStatus = possiblePaymentStatuses[Math.floor(Math.random() * possiblePaymentStatuses.length)];

            // Create payment record
            const payment = await prisma.payment.create({
                data: {
                    transactionId: `TXN-${uuidv4().substring(0, 8).toUpperCase()}`,
                    amount: total,
                    currency: 'VND',
                    method: randomPaymentMethod as any,
                    status: randomPaymentStatus as any,
                    metadata: {
                        paymentProvider: randomPaymentMethod === 'COD' ? 'Cash on Delivery' : randomPaymentMethod,
                        transactionTime: new Date(),
                        paymentDetails: randomPaymentMethod === 'CREDIT_CARD' ?
                            { last4: `${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}` } : null
                    }
                }
            });

            // Generate realistic address
            const city = cities[Math.floor(Math.random() * cities.length)];
            const district = districts[city][Math.floor(Math.random() * districts[city].length)];
            const street = streets[Math.floor(Math.random() * streets.length)];
            const houseNumber = Math.floor(Math.random() * 200) + 1;

            const shippingAddress = {
                fullName: getFullName(user.username),
                phone: user.phone,
                address: `${houseNumber} ${street} Street`,
                city: city,
                district: district,
                ward: `Ward ${Math.floor(Math.random() * 20) + 1}`,
                zipCode: `${Math.floor(Math.random() * 90000) + 10000}`
            };

            // Calculate realistic dates
            const createdDate = new Date();
            // Orders can be created from 90 days ago until today
            createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 90));

            let deliveryDate = null;
            if (['SHIPPED', 'DELIVERED', 'COMPLETED'].includes(orderStatus)) {
                deliveryDate = new Date(createdDate);
                deliveryDate.setDate(deliveryDate.getDate() + (shipping.estimatedDays || 3));
            }

            // Create the order
            const order = await prisma.order.create({
                data: {
                    orderNumber: `OD${Date.now().toString().substring(6)}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
                    userId: user.id,
                    subtotal: subtotal,
                    shippingFee: shippingFee,
                    tax: tax,
                    discount: discount,
                    total: total,
                    paymentId: payment.id,
                    shippingId: shipping.id,
                    couponId: coupon ? coupon.id : null,
                    status: orderStatus as any,
                    note: orderNotes[Math.floor(Math.random() * orderNotes.length)],
                    shippingAddress: shippingAddress,
                    billingAddress: Math.random() > 0.9 ? { // 10% chance of different billing address
                        fullName: getFullName(user.username),
                        phone: user.phone,
                        address: `${Math.floor(Math.random() * 200) + 1} ${streets[Math.floor(Math.random() * streets.length)]} Street`,
                        city: cities[Math.floor(Math.random() * cities.length)],
                        district: `District ${Math.floor(Math.random() * 10) + 1}`,
                        ward: `Ward ${Math.floor(Math.random() * 20) + 1}`,
                        zipCode: `${Math.floor(Math.random() * 90000) + 10000}`
                    } : shippingAddress,
                    deliveryDate: deliveryDate,
                    createdAt: createdDate,
                    updatedAt: getUpdatedDate(createdDate, orderStatus)
                }
            });

            // Create order items
            for (const item of orderItems) {
                await prisma.orderItem.create({
                    data: {
                        orderId: order.id,
                        ...item
                    }
                });
            }

            // Update coupon usage if used
            if (coupon) {
                await prisma.coupon.update({
                    where: { id: coupon.id },
                    data: { usageCount: { increment: 1 } }
                });
            }
        }
    }

    const totalOrders = await prisma.order.count();
    console.log(`Created ${totalOrders} orders`);
}

// Helper function to get variation option details
async function getVariantDetails(prisma: PrismaClient, variantId: number) {
    const options = await prisma.productVariationOption.findMany({
        where: { productVariationId: variantId },
        include: {
            variationOption: {
                include: {
                    variation: true
                }
            }
        }
    });

    return options.map(opt => ({
        variation: opt.variationOption.variation.name,
        option: opt.variationOption.name,
        value: opt.variationOption.value
    }));
}

// Helper function to create full names from usernames
function getFullName(username: string) {
    // If username already looks like a full name, return it
    if (username.includes(' ')) return capitalizeWords(username);

    // Otherwise generate a random last name
    const lastNames = [
        'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis',
        'Garcia', 'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor',
        'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White'
    ];

    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return capitalizeWords(`${username} ${randomLastName}`);
}

// Helper function to capitalize words
function capitalizeWords(str: string) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

// Helper function for weighted random selection
function weightedRandomChoice(items: any[], weights: number[]) {
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < items.length; i++) {
        random -= weights[i];
        if (random < 0) {
            return items[i];
        }
    }

    return items[items.length - 1]; // Fallback
}

// Helper function to get realistic updated dates based on order status
function getUpdatedDate(createdDate: Date, status: string) {
    const updatedDate = new Date(createdDate);

    switch (status) {
        case 'PENDING':
            // Recently created, same day
            break;
        case 'PROCESSING':
            // 0-1 days after creation
            updatedDate.setHours(updatedDate.getHours() + Math.floor(Math.random() * 24));
            break;
        case 'CONFIRMED':
            // 1-2 days after creation
            updatedDate.setDate(updatedDate.getDate() + 1 + Math.floor(Math.random() * 2));
            break;
        case 'SHIPPED':
            // 2-4 days after creation
            updatedDate.setDate(updatedDate.getDate() + 2 + Math.floor(Math.random() * 3));
            break;
        case 'DELIVERED':
            // 3-7 days after creation
            updatedDate.setDate(updatedDate.getDate() + 3 + Math.floor(Math.random() * 5));
            break;
        case 'COMPLETED':
            // 5-14 days after creation
            updatedDate.setDate(updatedDate.getDate() + 5 + Math.floor(Math.random() * 10));
            break;
        case 'CANCELLED':
            // 0-3 days after creation (usually cancelled early)
            updatedDate.setDate(updatedDate.getDate() + Math.floor(Math.random() * 4));
            break;
        case 'REFUNDED':
            // 5-21 days after creation (refunds take time)
            updatedDate.setDate(updatedDate.getDate() + 5 + Math.floor(Math.random() * 17));
            break;
        default:
            // Default case, just add a random number of days (0-7)
            updatedDate.setDate(updatedDate.getDate() + Math.floor(Math.random() * 8));
    }

    return updatedDate;
}