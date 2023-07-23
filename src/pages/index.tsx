import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { PageLayout } from "~/components/layout";
import { LoadingSpinner, MainPageLoadingSpinner } from "~/components/spinner";
import { RouterOutputs, api } from "~/utils/api";

export default function Home() {
    const posts = api.posts.getAll.useQuery()

    const user = useUser()

    const buttonsClass = `border border-gray-300 rounded px-1 py-0.5 text-white hover:bg-gray-300 hover:text-black`

    const CreatePostWizard = () => {
        const {user} = useUser()

        const [content, setContent] = useState("")

        const ctx = api.useContext()

        const {mutate, isLoading} = api.posts.create.useMutation({
            onSuccess: () => {
                setContent("")
                void ctx.posts.getAll.invalidate()
            },
            onError: (e) => {
                console.log(e)
                toast("Error creating post: " + e.message)
                setContent("")
            }
        })

        return (
            <div className="flex gap-3 p-2 w-full">
                <img src={user?.profileImageUrl} alt="Profile image" className="rounded-full h-16 w-16"/>
                <div className="max-h-16 border border-gray-500 rounded mt-1 grow p-2">
                    {!isLoading ? <input
                        type="text"
                        className="w-full bg-transparent outline-none"
                        placeholder="Place your thoughts here!"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        disabled={isLoading}
                        onKeyDown={e => {
                            if (e.key === "Enter") {
                                mutate({content})
                            }

                        }}
                    /> : <LoadingSpinner/>}

                </div>
            </div>
        )
    }

    type PostWithUser = RouterOutputs["posts"]["getAll"][number]
    console.log("client", user)

    const PostView = (props: PostWithUser) => {
        const {author, post} = props

        return (
            <div className="flex items-center">
                <Image src={author.profileImageUrl} alt="Profile picture" className="h-10 w-10 rounded-full m-2" width={56} height={56}/>
                <div>
                    <div className="text-gray-300 text-sm flex gap-3">
                        <Link href={`/@${author.username}`}>
                            <div>{author.username}</div>
                        </Link>
                        <Link href={`/post/${post.id}`}>
                            <div>18 hours ago</div>
                        </Link>
                    </div>
                    <div key={post.id} className="border border-gray-300 rounded p-2 mb-2">{post.content}</div>
                </div>
            </div>
        )
    }

    // If either user or posts are loading, show the spinner. Only continue when both are loaded.
    if (!user.isLoaded || posts.isLoading) return <MainPageLoadingSpinner/>

    return (
        <>
            <header className="bg-slate-500 p-2 flex justify-between">
                <h2>Demo T3</h2>
                <div>
                    {user.isSignedIn ? <SignOutButton>
                        <button className={buttonsClass}>
                            Sign out
                        </button>
                    </SignOutButton> : <SignInButton>
                            <button className={buttonsClass}>
                                Sign in
                            </button>
                        </SignInButton>}
                </div>
            </header>
            <CreatePostWizard/>
            <PageLayout>
                <main>
                    {posts.data?.map(post => <PostView {...post} key={post.post.id}/>)}
                </main>
            </PageLayout>
        </>
    )
}
