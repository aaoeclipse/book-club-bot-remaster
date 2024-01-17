import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


export const getCurrReadingActiveBookDb = async () => {
    const currReadingBook = await prisma.activeBook.findFirst({
        where: { active: true },
        include: { book: true }
    })
    return currReadingBook;
}
