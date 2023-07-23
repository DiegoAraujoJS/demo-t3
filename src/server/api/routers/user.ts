import { clerkClient } from "@clerk/nextjs";
import type {User} from '@clerk/nextjs/api'
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter,  publicProcedure } from "~/server/api/trpc";

const filterUserForClient = (user: User) => {
    return {
        id: user.id,
        username: user.emailAddresses.pop()!.emailAddress,
        profileImageUrl: user.profileImageUrl
    }
}

export const userRouter = createTRPCRouter({
    getUser: publicProcedure
    .input(z.object({
        email: z.string()
    }))
    .query(async ({input}): Promise<ReturnType<typeof filterUserForClient>> => {
        const [user] = await clerkClient.users.getUserList({
            emailAddress: [input.email]
        });

        if (!user) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "User not found"
            })
        }

        return filterUserForClient(user)
    })
})
