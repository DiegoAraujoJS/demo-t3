import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import {createServerSideHelpers} from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson"

const ProfileView: NextPage<{username: string}> = ({username}) => {
    const {data, isLoading} = api.users.getUser.useQuery({email: username})

    return (
        <>
            <Head>
                <title>Profile</title>
            </Head>
            <header className="bg-slate-500 p-2 flex justify-between">
                <h2>Demo T3</h2>
            </header>
            <main>
                <div>
                    {username}
                </div>
            </main>
        </>

    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    const {params} = context

    const slug = params?.slug

    if (typeof slug !== 'string') throw new Error('Invalid slug')

    const ssg = createServerSideHelpers({
        router: appRouter,
        ctx: {prisma: prisma, userId: null},
        transformer: superjson
    })

    await ssg.users.getUser.prefetch({email: slug.slice(1)})

    return {
        props: {
            trpcState: ssg.dehydrate(),
            username: slug.slice(1)
        }
    }
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export default ProfileView
