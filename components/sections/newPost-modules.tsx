"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserSubscriptionPlan } from "@/types";
import { useStorageUpload } from "@thirdweb-dev/react";
import { useDropzone } from "react-dropzone";
import TextareaAutosize from "react-textarea-autosize";
import { useAccount } from "wagmi";

import { env } from "@/env.mjs";
import { SubscriptionPlan } from "@/types/index";
import { pricingData } from "@/config/subscriptions";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BillingFormButton } from "@/components/forms/billing-form-button";
import { ModalContext } from "@/components/modals/providers";
import { HeaderSection } from "@/components/shared/header-section";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { useODB } from "@/app/context/OrbisContext";

const CONTEXT_ID = env.NEXT_PUBLIC_CONTEXT_ID ?? "";
const POST_ID = env.NEXT_PUBLIC_POST_ID ?? "";

export function PostModules() {
  const [file, setFile] = useState<File | undefined>(undefined);
  const { mutateAsync: upload } = useStorageUpload();
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [body, setBody] = useState<string | undefined>(undefined);
  const [postCreated, setPostCreated] = useState<boolean>(false);
  const { orbis } = useODB();
  const { address } = useAccount();

  const uploadToIpfs = async () => {
    const uploadUrl = await upload({
      data: [file],
      options: { uploadWithGatewayUrl: true, uploadWithoutDirectory: true },
    });
    return uploadUrl[0];
  };

  const createPost = async (): Promise<void> => {
    try {
      const user = await orbis.getConnectedUser();
      if (user) {
        let imageUrl;
        if (file) {
          imageUrl = await uploadToIpfs();
        }

        const createQuery = await orbis
          .insert(POST_ID)
          .value({
            title,
            body,
            imageId: imageUrl ? imageUrl : "",
          })
          .context(CONTEXT_ID)
          .run();

        console.log(createQuery);

        if (createQuery.content) {
          console.log("Post created successfully");
          setPostCreated(true);
        }
      }
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  useEffect(() => {
    if (address) {
      console.log("Address:", address);
    }
  }, [address]);

  return (
    <section className="flex flex-col items-center pb-6 text-center">
      <MaxWidthWrapper>
        <div className="mt-12 grid gap-5 bg-inherit lg:grid-cols-1">
          <div className="relative flex w-full items-center justify-center">
            <form className="mt-12 flex w-full flex-col items-center justify-center">
              <div className="mb-4 w-full rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
                <div className="mb-12 rounded-t-lg bg-white px-4 py-2 dark:bg-gray-800">
                  <label htmlFor="comment" className="sr-only">
                    Your post title
                  </label>
                  <TextareaAutosize
                    id="post-title"
                    rows={2}
                    className="mb-2 w-full border-0 bg-white px-0 text-sm font-semibold text-gray-900 focus:ring-0 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
                    placeholder="Write your post title..."
                    required
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                {file && (
                  <div className="rounded-t-lg bg-white px-4 py-2 dark:bg-gray-800">
                    <label htmlFor="comment" className="sr-only">
                      Image
                    </label>
                    <Image
                      src={URL.createObjectURL(file)}
                      width={200}
                      height={200}
                      alt={""}
                    />
                  </div>
                )}
                <div className="rounded-t-lg bg-white px-4 py-2 dark:bg-gray-800">
                  <label htmlFor="comment" className="sr-only">
                    Your post body
                  </label>
                  <TextareaAutosize
                    id="post-body"
                    rows={8}
                    className="min-h-[100px] w-full border-0 bg-white px-0 text-sm text-gray-900 focus:ring-0 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
                    placeholder="Write your post body..."
                    required
                    onChange={(e) => setBody(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between border-t px-3 py-2 dark:border-gray-600">
                  {/* <button
                    type="submit"
                    className="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2.5 text-center text-xs font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900"
                    onClick={createPost}
                  >
                    Publish Post
                  </button> */}
                  <Button
                    variant={"default"}
                    className="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2.5 text-center text-xs font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900"
                    rounded="full"
                    onClick={async (e) => {
                      e.preventDefault();
                      void (await createPost());
                    }}
                  >
                    Publish Post
                  </Button>
                  <div className="flex space-x-1 ps-0 sm:ps-2 rtl:space-x-reverse">
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-2">
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-gray-700">
                          Upload a file
                        </h4>
                      </div>
                      <input
                        type="file"
                        id="doc"
                        name="doc"
                        accept="png, jpg"
                        hidden
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          if (e.target.files) {
                            setFile(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
