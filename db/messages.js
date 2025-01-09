import prisma from '../utils/prismaClient.js';

export const fetchMessages = async (room) => {
    return prisma.message.findMany({
      where: { room },
      include: { user: { select: { username: true } } },
      orderBy: { timestamp: 'asc' },
    });
};

export const saveMessage = async (msg) => {
    return prisma.message.create({
      data: { content: msg.content, room: msg.room, userId: msg.userId },
    });
};

