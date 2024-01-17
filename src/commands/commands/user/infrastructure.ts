import { PrismaClient } from '@prisma/client'
import { User } from './user.type'

const prisma = new PrismaClient()

export const getUserDb = async (username: string) => {
    const user = await prisma.user.findFirst({
        where: { username: username }
      })
    return user;
}

export const addUserDb = async (user: User) => {

    const newUser = await prisma.user.create({
        data: {
            username: user.username
        },
    })

    return newUser;
}