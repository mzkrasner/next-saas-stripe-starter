"use client";

import { notFound } from "next/navigation";
import { type Post } from "@/types";
import { MediaRenderer, useStorageUpload } from "@thirdweb-dev/react";
import { allPosts } from "contentlayer/generated";

import { Button } from "@/components/ui/button";
import { Mdx } from "@/components/content/mdx-components";
import { Icons } from "@/components/shared/icons";

import "@/styles/mdx.css";

import { useEffect, useState } from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { useAccount } from "wagmi";

import { env } from "@/env.mjs";
import { BLOG_CATEGORIES } from "@/config/blog";
import { features, testimonials } from "@/config/landing";
import { getTableOfContents } from "@/lib/toc";
import { cn, constructMetadata, formatDate } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Author from "@/components/content/author";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { DashboardTableOfContents } from "@/components/shared/toc";
import { useODB } from "@/app/context/OrbisContext";

const GRAPHQL_ENDPOINT = env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? "";

export default function PostPage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const [message, setMessage] = useState<Post | undefined>(undefined);
  const { orbis } = useODB();
  const { address } = useAccount();

  const getPost = async (stream_id: string): Promise<void> => {
    try {
      const user = await orbis.getConnectedUser();
      if (user) {
        console.log(stream_id);
        const postQuery = await fetch(GRAPHQL_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query {
                forum_post (filter: {
                  stream_id_eq: "${stream_id}"
                }) {
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
                  comments {
                    comment
                    profile {
                      name
                      username
                      description
                      imageid
                    }
                  }
                }
              }
            `,
          }),
        });
        const postResult = (await postQuery.json()) as {
          data: { forum_post: Post[] };
        };
        console.log(postResult);
        if (postResult.data.forum_post) {
          setMessage(postResult.data.forum_post[0]);
        }
      }
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  useEffect(() => {
    void getPost(params.slug);
  }, [params.slug]);

  return (
    <>
      {message && (
        <MaxWidthWrapper className="pt-6 md:pt-10">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <time
                dateTime={new Date().toISOString()}
                className="text-sm font-medium text-muted-foreground"
              >
                {formatDate(new Date().toISOString())}
              </time>
            </div>
            <h1 className="font-heading text-3xl text-foreground sm:text-4xl">
              {message.title}
            </h1>
            {message.imageid && (
              <div className="relative mb-6">
                <MediaRenderer
                  src={message.imageid}
                  width="2rem"
                  height="2rem"
                  className="rounded-full"
                />
              </div>
            )}
            <p className="text-base text-muted-foreground md:text-lg">
              {message.body}
            </p>
            <div className="mt-12 grid gap-5 bg-inherit lg:grid-cols-1">
              <div className="relative flex w-full items-center justify-center">
                <form className="mt-12 flex w-full flex-col items-center justify-center">
                  <div className="mb-4 w-full rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
                    <div className="rounded-t-lg bg-white px-4 py-2 dark:bg-gray-800">
                      <label htmlFor="comment" className="sr-only">
                        Reply to this post
                      </label>
                      <textarea
                        id="post-body"
                        rows={3}
                        className="w-full border-0 bg-white px-0 text-sm text-gray-900 focus:ring-0 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
                        placeholder="Reply to this post"
                        required
                      />
                    </div>
                    <div className="flex items-center justify-between border-t px-3 py-2 dark:border-gray-600">
                      <button
                        type="submit"
                        className="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2.5 text-center text-xs font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            {message.comments.map((post, index) => (
              <div key={post.title} className="relative grow">
                <div className="group relative grow overflow-hidden rounded-2xl border bg-background p-5 md:p-8">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-purple-500/80 to-white opacity-25 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10"
                  />
                  <div className="relative">
                    <div className="relative flex items-center gap-3">
                      {testimonials[index] && (
                        <>
                          <Image
                            width={30}
                            height={30}
                            src={testimonials[index].image}
                            alt={testimonials[index].name}
                            className="rounded-full"
                          />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              {testimonials[index].name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date().toLocaleString()}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    <p className="mt-4 text-base text-muted-foreground">
                      {post.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      )}

      <div className="relative">
        <div className="absolute top-52 w-full border-t" />
      </div>
      {!message && (
        <div className="flex flex-col space-y-4 pb-16">
          <p>Loading...</p>
        </div>
      )}
    </>
  );
}
