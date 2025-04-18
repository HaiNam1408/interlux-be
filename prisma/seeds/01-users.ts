import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient) {
    // Xóa dữ liệu cũ để tránh trùng lặp
    await prisma.user.deleteMany({});

    // Tạo admin
    await prisma.user.create({
        data: {
            username: 'admin',
            email: 'admin@gmail.com',
            phone: '0987654321',
            password: await bcrypt.hash('Abc123456', 10),
            role: 'ADMIN',
            address: 'Số 123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
            avatar: 'https://i.pravatar.cc/300?img=1',
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
            avatar: 'https://i.pravatar.cc/300?img=2',
        },
        {
            username: 'tranthib',
            email: 'john_doe@gmail.com',
            phone: '0912345678',
            password: await bcrypt.hash('StrongPass123', 10),
            address: 'Số 78 Đường Lê Duẩn, Quận 3, TP. Hồ Chí Minh',
            avatar: 'https://i.pravatar.cc/300?img=3',
        },
        {
            username: 'lethanhc',
            email: 'lethanhc@gmail.com',
            phone: '0923456789',
            password: await bcrypt.hash('Abc123456', 10),
            address: 'Số 123 Đường Trần Hưng Đạo, Quận 5, TP. Hồ Chí Minh',
            avatar: 'https://i.pravatar.cc/300?img=4',
        },
    ];

    for (const user of users) {
        await prisma.user.create({
            data: user,
        });
    }

    console.log(`Đã tạo ${users.length + 1} người dùng`);
}