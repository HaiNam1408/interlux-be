import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient) {
    await prisma.user.deleteMany({});

    // Create admin
    await prisma.user.create({
        data: {
            username: 'admin',
            email: 'admin@gmail.com',
            phone: '0987654321',
            password: await bcrypt.hash('Abc123456', 10),
            role: 'ADMIN',
            address: 'Số 123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
            avatar: {
                fileName: 'admin-avatar.jpg',
                filePath: 'https://avatar.windsor.io/admin-avatar',
                type: 'image/jpeg',
            },
        },
    });

    // Tạo một số người dùng mẫu
    const users = [
        {
            username: 'nguyenvana',
            email: 'nguyenvana@gmail.com',
            phone: '0901234567',
            password: await bcrypt.hash('Abc123456', 10),
            address: 'Số 45 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh',
            avatar: {
                fileName: 'nguyenvana-avatar.jpg',
                filePath: 'https://avatar.windsor.io/nguyenvana-avatar',
                type: 'image/jpeg',
            },
        },
        {
            username: 'tranthib',
            email: 'john_doe@gmail.com',
            phone: '0912345678',
            password: await bcrypt.hash('StrongPass123', 10),
            address: 'Số 78 Đường Lê Duẩn, Quận 3, TP. Hồ Chí Minh',
            avatar: {
                fileName: 'tranthib-avatar.jpg',
                filePath: 'https://avatar.windsor.io/tranthib-avatar',
                type: 'image/jpeg',
            },
        },
        {
            username: 'lethanhc',
            email: 'lethanhc@gmail.com',
            phone: '0923456789',
            password: await bcrypt.hash('Abc123456', 10),
            address: 'Số 123 Đường Trần Hưng Đạo, Quận 5, TP. Hồ Chí Minh',
            avatar: {
                fileName: 'lethanhc-avatar.jpg',
                filePath: 'https://avatar.windsor.io/lethanhc-avatar',
                type: 'image/jpeg',
            },
        },
    ];

    for (const user of users) {
        await prisma.user.create({
            data: user,
        });
    }

    console.log(`Đã tạo ${users.length + 1} người dùng`);
}