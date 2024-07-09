"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { type Post } from "@/types";
import { set } from "date-fns";
import { MediaRenderer, useStorageUpload } from "@thirdweb-dev/react";
import { useODB } from "@/app/context/OrbisContext";
import { useAccount } from "wagmi";
import { env } from "@/env.mjs";
import { features, testimonials } from "@/config/landing";
import { Button } from "@/components/ui/button";
import { HeaderSection } from "@/components/shared/header-section";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

const CONTEXT_ID = env.NEXT_PUBLIC_CONTEXT_ID ?? "";
const POST_ID = env.NEXT_PUBLIC_POST_ID ?? "";
const GRAPHQL_ENDPOINT = env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? "";

export default function Posts() {
  const [allMessages, setAllMessages] = useState<Post[] | undefined>(undefined);
  const [posts, setPosts] = useState<Post[] | undefined>();
  const { orbis } = useODB();
  const { address } = useAccount();
  const [pagination, setPagination] = useState<number>(1);
  const { mutateAsync: upload } = useStorageUpload();

  const getPosts = async (): Promise<void> => {
    try {
      const user = await orbis.getConnectedUser();
      if (user) {
        const postQuery = await fetch(GRAPHQL_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query {
                forum_post {
                  body
                  title
                  imageid
                  stream_id
                  profile {
                    name
                    username
                    description
                    imageid
                  }
                }
              }
            `,
          }),
        });
        const postResult = await postQuery.json() as { data: { forum_post: Post[] } };
        console.log(postResult);
        if (postResult.data.forum_post) {
          setAllMessages(postResult.data.forum_post);
          setPosts(postResult.data.forum_post.slice(0, 10));
        }
      }
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  const alterPosts = (direction: string) => {
    try {
      switch (direction) {
        case "next":
          setPagination(pagination + 1);
          setPosts(allMessages?.slice(pagination * 10, pagination * 10 + 10));
          console.log(allMessages?.slice(pagination * 10, pagination * 10 + 10));
          break;
        case "previous":
          setPagination(pagination - 1);
          setPosts(
            allMessages?.slice((pagination - 2) * 10, (pagination - 1) * 10),
          );
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    void getPosts();
    return () => {
      setAllMessages([]);
      setPosts([]);
    };
  }, []);

  return (
    <section className="col-span-2">
      <div className="pb-6 pt-12">
        <MaxWidthWrapper>
          <div className="mt-12 grid gap-3 sm:grid-cols-1 lg:grid-cols-1">
            {posts?.length && posts.map((post, index) => (
              <div key={post.title} className="relative grow">
                <div className="group relative grow overflow-hidden rounded-2xl border bg-background p-5 md:p-8">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-purple-500/80 to-white opacity-25 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10"
                  />
                  <div className="relative">
                    <div className="relative flex items-center gap-3">
                      {post.profile?.imageid && (
                        <>
                          <MediaRenderer src={post.profile?.imageid} 
                            width="2rem"
                            height="2rem"
                            className="rounded-full"
                          />
                          <Link href="#">
                            <p className="relative text-sm font-semibold text-foreground hover:text-destructive">
                              {post.profile.username}
                            </p>
                          </Link>
                        </>
                      )}
                    </div>
                    <div className="relative grow">
                      <p className="mt-6 pb-6 text-2xl font-bold">
                        {post.title}
                      </p>
                      {post.imageid && (
                        <div className="relative mb-6">
                          <MediaRenderer src={post.imageid} 
                            width="50%"
                            height="50%"
                            className="rounded-xl"
                          />
                        </div>
                      )}
                      <p className="relative mt-6 pb-6 text-muted-foreground">
                        {post.body}
                      </p>
                    </div>
                    <div className="relative -mb-5 flex gap-3 border-t border-muted py-4 md:-mb-7">
                      <Button
                        variant="secondary"
                        size="sm"
                        rounded="xl"
                        className="px-4"
                      >
                        <Link
                          href={`/post/${post.stream_id}`}
                          className="flex items-center gap-2"
                        >
                          <span>Thread</span>
                          <Icons.arrowUpRight className="size-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <p className="mt-6 text-center text-muted-foreground">
              Showing Posts {pagination * 10 - 9} - {pagination * 10}
            </p>
            <div className="mb-6 flex justify-center gap-3">
              {pagination * 10 < features.length && (
                <Button
                  onClick={() => alterPosts("next")}
                  variant="default"
                  size="sm"
                  rounded="xl"
                  className="min-w-[150px] px-4"
                >
                  Next 10 Posts
                </Button>
              )}
              {pagination > 1 && (
                <Button
                  onClick={() => alterPosts("previous")}
                  variant="default"
                  size="sm"
                  rounded="xl"
                  className="min-w-[150px] px-4"
                >
                  Previous 10 Posts
                </Button>
              )}
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </section>
  );
}
