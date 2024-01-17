import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const getVoteFromUserToBook = async (userid: number, bookid: number, electionid: number) => {
    console.log("🚀 ~ file: infrastructure.ts:6 ~ getVoteFromUserToBook ~ userid + bookid:", userid, bookid)
    const getVote = await prisma.vote.findFirst({
        where: { userid: userid, bookid: bookid, electionid: electionid }
    })

    return getVote;
}

export const removeVote = async (voteid: number) => {
    console.log("🚀 ~ file: infrastructure.ts:15 ~ removeVote ~ voteid:", voteid)
    const removedVoteResult = await prisma.vote.delete({
        where: { id: voteid }
    })
    return removedVoteResult;
}

export const newUserVote = async (userid: number, bookid: number, electionid: number) => {
    console.log("🚀 ~ file: infrastructure.ts:23 ~ newUserVote ~ userid: number, bookid: number, electionid: number:", userid, bookid, electionid)
    const newVote = await prisma.vote.create({
        data: {
            bookid: bookid,
            electionid: electionid,
            userid: userid,
        }
    })
    return newVote;
}