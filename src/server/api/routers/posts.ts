import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {clerkClient} from '@clerk/nextjs/server'
import type {User} from '@clerk/nextjs/api'


const filterUserForClient = (user: User) => {
    return {
        id: user.id,
        username: user.emailAddresses.pop()!.emailAddress,
        profileImageUrl: user.profileImageUrl
    }
}

export const postRouter = createTRPCRouter({
    // hello: publicProcedure
    //   .input(z.object({ text: z.string() }))
    //   .query(({ input }) => {
    //     return {
    //       greeting: `Hello ${input.text}`,
    //     };
    //   }),
    getAll: publicProcedure.query(async ({ ctx }) => {
        
        const posts = await ctx.prisma.post.findMany({
            take: 100
        });

        const users = (await clerkClient.users.getUserList({
            userId: posts.map(post => post.authorId),
            limit: 100,
        })).map(filterUserForClient)

        return posts.map(post => ({
            post,
            author: users.find(user => user.id === post.authorId)!
        }))
    }),
});
