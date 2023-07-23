import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
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

    create: privateProcedure
    .input(z.object({
        content: z.string(),
    }))
    .mutation(async ({ctx, input}) => {
        const post = await ctx.prisma.post.create({
            data: {
                content: input.content,
                authorId: ctx.currentUser
            }
        })

        return post
    })
});
