"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { type Post } from "@/types";
import { set } from "date-fns";

import { features, testimonials } from "@/config/landing";
import { Button } from "@/components/ui/button";
import { HeaderSection } from "@/components/shared/header-section";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function Posts() {
  const [allMessages, setAllMessages] = useState<Post[]>(features);
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<number>(1);

  const alterPosts = (direction: string) => {
    try {
      switch (direction) {
        case "next":
          setPagination(pagination + 1);
          setPosts(allMessages.slice(pagination * 10, pagination * 10 + 10));
          console.log(allMessages.slice(pagination * 10, pagination * 10 + 10));
          break;
        case "previous":
          setPagination(pagination - 1);
          setPosts(
            allMessages.slice((pagination - 2) * 10, (pagination - 1) * 10),
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
    setAllMessages(features);
    const sliced = features.slice(0, 10);
    setPosts(sliced);
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
            {posts.map((post, index) => (
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
                          <Link href="#">
                            <p className="relative text-sm font-semibold text-foreground hover:text-destructive">
                              {testimonials[index].name}
                            </p>
                          </Link>
                        </>
                      )}
                    </div>
                    <div className="relative grow">
                      <p className="mt-6 pb-6 text-2xl font-bold">
                        {post.title}
                      </p>
                      {post.image && (
                        <div className="relative mb-6">
                          <Image
                            className="relative"
                            src={post.image}
                            width={600}
                            height={400}
                            alt={post.title}
                            priority
                          />
                        </div>
                      )}
                      <p className="relative mt-6 pb-6 text-muted-foreground">
                        {post.description}
                      </p>
                    </div>
                    <div className="relative -mb-5 flex gap-3 border-t border-muted py-4 md:-mb-7">
                      <Button
                        variant="secondary"
                        size="sm"
                        rounded="xl"
                        className="px-4"
                      >
                        <Link href="/" className="flex items-center gap-2">
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
