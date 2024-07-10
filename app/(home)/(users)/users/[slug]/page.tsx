"use client";

import { type Profile } from "@/types";
import { MediaRenderer } from "@thirdweb-dev/react";

import "@/styles/mdx.css";

import { useEffect, useState } from "react";
import Link from "next/link";

import { env } from "@/env.mjs";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { useODB } from "@/app/context/OrbisContext";

const GRAPHQL_ENDPOINT = env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? "";

export default function PostPage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const { orbis } = useODB();

  const getProfile = async (stream_id: string): Promise<void> => {
    try {
      const user = await orbis.getConnectedUser();
      if (user) {
        console.log(stream_id);
        const profQuery = await fetch(GRAPHQL_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query {
                forum_profile (filter: {
                  stream_id_eq: "${stream_id}"
                }) {
                  name
                  username
                  description
                  imageid
                  posts {
                    body
                    title
                    stream_id
                  }
                }
              }
            `,
          }),
        });
        const profResult = (await profQuery.json()) as {
          data: { forum_profile: Profile[] };
        };
        console.log(profResult);
        if (profResult.data.forum_profile) {
          setProfile(profResult.data.forum_profile[0]);
        }
      }
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  useEffect(() => {
    void getProfile(params.slug);
  }, [params.slug]);

  return (
    <>
      {profile && (
        <MaxWidthWrapper className="pt-6 md:pt-10">
          <div className="flex flex-col space-y-4">
            <h1 className="font-heading text-3xl text-foreground sm:text-4xl">
              {profile.name}
            </h1>
            {profile.imageid && (
              <div className="relative mb-6">
                <MediaRenderer
                  src={profile.imageid}
                  width="50%"
                  height="50%"
                  className="rounded-full"
                />
              </div>
            )}
            <h2 className="text-xl text-muted-foreground">
              @{profile.username}
            </h2>
            <p className="text-base text-muted-foreground md:text-lg">
              {profile.description}
            </p>
            {profile.posts && profile.posts.length > 0 && (
              <div className="mt-4 border-t border-muted-foreground">
                <h2 className="mt-4 text-xl text-muted-foreground">{`Posts by ${profile.username}`}</h2>
              </div>
            )}
            {profile.posts?.map((post) => (
              <Link
                href={`/post/${post.stream_id}`}
                key={post.stream_id}
                className="hover:cursor-pointer"
              >
                <div key={post.stream_id} className="relative grow">
                  <div className="group relative grow overflow-hidden rounded-2xl border bg-background p-5 md:p-8">
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-purple-500/80 to-white opacity-25 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10"
                    />
                    <div className="relative">
                      <div className="relative flex items-center gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {new Date().toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <h3 className="mt-6 pb-6 text-2xl font-bold">
                        {post.title}
                      </h3>
                      <p className="mt-4 text-base text-muted-foreground">
                        {post.body}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </MaxWidthWrapper>
      )}

      <div className="relative">
        <div className="absolute top-52 w-full border-t" />
      </div>
      {!profile && (
        <div className="flex flex-col space-y-4 pb-16">
          <p>Loading...</p>
        </div>
      )}
    </>
  );
}
