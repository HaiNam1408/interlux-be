"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedOrders = seedOrders;
const uuid_1 = require("uuid");
async function seedOrders(prisma) {
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.payment.deleteMany({});
    const users = await prisma.user.findMany({ where: { role: 'USER' } });
    const products = await prisma.product.findMany({
        include: { variations: true }
    });
    const shippingMethods = await prisma.shipping.findMany();
    const coupons = await prisma.coupon.findMany({ where: { status: 'ACTIVE' } });
    const orderStatuses = ['PENDING', 'PROCESSING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'REFUNDED'];
    const orderStatusWeights = [5, 10, 15, 20, 25, 20, 3, 2];
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
    const streets = [
        'Nguyen Hue', 'Le Loi', 'Pasteur', 'Dong Khoi', 'Hai Ba Trung', 'Ly Tu Trong',
        'Nam Ky Khoi Nghia', 'Nguyen Thai Hoc', 'Tran Hung Dao', 'Le Duan', 'Mac Dinh Chi',
        'Pham Ngoc Thach', 'Vo Van Tan', 'Dinh Tien Hoang', 'Nguyen Dinh Chieu', 'Le Thanh Ton',
        'Phan Xich Long', 'Hoang Van Thu', 'Bach Dang', 'Nguyen Cong Tru', 'Phan Chu Trinh',
        'Ton That Thiep', 'Thai Van Lung', 'Truong Dinh', 'Mac Thi Buoi', 'Ho Tung Mau'
    ];
    const orderNotes = [
        'Please call before delivery',
        'Leave the package at the door',
        'Please deliver on weekend',
        'Fragile items, handle with care',
        'Please deliver after 6pm',
        'Contact me before delivery',
        null, null, null, null, null, null
    ];
    for (const user of users) {
        const orderCount = Math.floor(Math.random() * 13) + 3;
        for (let i = 0; i < orderCount; i++) {
            const orderItems = [];
            const itemCount = Math.floor(Math.random() * 6) + 1;
            let subtotal = 0;
            const selectedProductIndexes = [];
            while (selectedProductIndexes.length < itemCount) {
                const randomIndex = Math.floor(Math.random() * products.length);
                if (!selectedProductIndexes.includes(randomIndex)) {
                    selectedProductIndexes.push(randomIndex);
                }
            }
            for (const index of selectedProductIndexes) {
                const product = products[index];
                const quantity = Math.floor(Math.random() * 3) + 1;
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
            const randomShippingIndex = Math.floor(Math.random() * shippingMethods.length);
            const shipping = shippingMethods[randomShippingIndex];
            let coupon = null;
            let discount = 0;
            if (Math.random() > 0.7) {
                const randomCouponIndex = Math.floor(Math.random() * coupons.length);
                coupon = coupons[randomCouponIndex];
                if (subtotal >= (coupon.minPurchase || 0)) {
                    if (coupon.type === 'PERCENTAGE') {
                        discount = subtotal * coupon.value / 100;
                    }
                    else {
                        discount = coupon.value;
                    }
                }
            }
            const shippingFee = shipping.price;
            const tax = subtotal * 0.08;
            const total = subtotal + shippingFee + tax - discount;
            const orderStatus = weightedRandomChoice(orderStatuses, orderStatusWeights);
            const randomPaymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
            const possiblePaymentStatuses = paymentStatusMap[orderStatus];
            const randomPaymentStatus = possiblePaymentStatuses[Math.floor(Math.random() * possiblePaymentStatuses.length)];
            const payment = await prisma.payment.create({
                data: {
                    transactionId: `TXN-${(0, uuid_1.v4)().substring(0, 8).toUpperCase()}`,
                    amount: total,
                    currency: 'VND',
                    method: randomPaymentMethod,
                    status: randomPaymentStatus,
                    metadata: {
                        paymentProvider: randomPaymentMethod === 'COD' ? 'Cash on Delivery' : randomPaymentMethod,
                        transactionTime: new Date(),
                        paymentDetails: randomPaymentMethod === 'CREDIT_CARD' ?
                            { last4: `${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}` } : null
                    }
                }
            });
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
            const createdDate = new Date();
            createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 90));
            let deliveryDate = null;
            if (['SHIPPED', 'DELIVERED', 'COMPLETED'].includes(orderStatus)) {
                deliveryDate = new Date(createdDate);
                deliveryDate.setDate(deliveryDate.getDate() + (shipping.estimatedDays || 3));
            }
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
                    status: orderStatus,
                    note: orderNotes[Math.floor(Math.random() * orderNotes.length)],
                    shippingAddress: shippingAddress,
                    billingAddress: Math.random() > 0.9 ? {
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
            for (const item of orderItems) {
                await prisma.orderItem.create({
                    data: {
                        orderId: order.id,
                        ...item
                    }
                });
            }
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
async function getVariantDetails(prisma, variantId) {
    const attributeValues = await prisma.productVariationValue.findMany({
        where: { productVariationId: variantId },
        include: {
            attributeValue: {
                include: {
                    attribute: true
                }
            }
        }
    });
    return attributeValues.map(attr => ({
        variation: attr.attributeValue?.attribute?.name || 'Unknown',
        option: attr.attributeValue?.name || 'Unknown',
        value: attr.attributeValue?.value || ''
    }));
}
function getFullName(username) {
    if (username.includes(' '))
        return capitalizeWords(username);
    const lastNames = [
        'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis',
        'Garcia', 'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor',
        'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White'
    ];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return capitalizeWords(`${username} ${randomLastName}`);
}
function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}
function weightedRandomChoice(items, weights) {
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    for (let i = 0; i < items.length; i++) {
        random -= weights[i];
        if (random < 0) {
            return items[i];
        }
    }
    return items[items.length - 1];
}
function getUpdatedDate(createdDate, status) {
    const updatedDate = new Date(createdDate);
    switch (status) {
        case 'PENDING':
            break;
        case 'PROCESSING':
            updatedDate.setHours(updatedDate.getHours() + Math.floor(Math.random() * 24));
            break;
        case 'CONFIRMED':
            updatedDate.setDate(updatedDate.getDate() + 1 + Math.floor(Math.random() * 2));
            break;
        case 'SHIPPED':
            updatedDate.setDate(updatedDate.getDate() + 2 + Math.floor(Math.random() * 3));
            break;
        case 'DELIVERED':
            updatedDate.setDate(updatedDate.getDate() + 3 + Math.floor(Math.random() * 5));
            break;
        case 'COMPLETED':
            updatedDate.setDate(updatedDate.getDate() + 5 + Math.floor(Math.random() * 10));
            break;
        case 'CANCELLED':
            updatedDate.setDate(updatedDate.getDate() + Math.floor(Math.random() * 4));
            break;
        case 'REFUNDED':
            updatedDate.setDate(updatedDate.getDate() + 5 + Math.floor(Math.random() * 17));
            break;
        default:
            updatedDate.setDate(updatedDate.getDate() + Math.floor(Math.random() * 8));
    }
    return updatedDate;
}
//# sourceMappingURL=08-order.js.map