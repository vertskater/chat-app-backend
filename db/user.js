import prisma from '../utils/prismaClient.js';

const getUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: {
      email: email
    }
  })
}

const saveUser = async (user) => {
  return prisma.user.create({
    data: user,
  })
}

export {getUserByEmail, saveUser}