"use client";

import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserSubscriptionPlan } from "@/types";
import { MediaRenderer, useStorageUpload } from "@thirdweb-dev/react";
import { set } from "date-fns";
import TextareaAutosize from "react-textarea-autosize";
import { useAccount } from "wagmi";

import { env } from "@/env.mjs";
import { SubscriptionPlan, type Profile } from "@/types/index";
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

const PROFILE_ID = env.NEXT_PUBLIC_PROFILE_ID ?? "";
const CONTEXT_ID = env.NEXT_PUBLIC_CONTEXT_ID ?? "";

interface PricingCardsProps {
  userId?: string;
  subscriptionPlan?: UserSubscriptionPlan;
}

export function ProfileModules({
  userId,
  subscriptionPlan,
}: PricingCardsProps) {
  const { setShowSignInModal } = useContext(ModalContext);
  const [about, setAbout] = useState<string | undefined>(undefined);
  const [name, setName] = useState<string | undefined>(undefined);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const { orbis } = useODB();
  const { address } = useAccount();
  const { mutateAsync: upload } = useStorageUpload();

  const uploadToIpfs = async () => {
    const uploadUrl = await upload({
      data: [file],
      options: { uploadWithGatewayUrl: true, uploadWithoutDirectory: true },
    });
    return uploadUrl[0];
  };

  const saveProfile = async (): Promise<void> => {
    try {
      const user = await orbis.getConnectedUser();
      if (user) {
        let imageUrl;
        if (file) {
          imageUrl = await uploadToIpfs();
        }
        console.log(JSON.stringify(imageUrl));
        const updatequery = await orbis
          .insert(PROFILE_ID)
          .value({
            name: name ?? profile?.name,
            username: username ?? profile?.username,
            description: about ?? profile?.description,
            imageId: imageUrl
              ? imageUrl
              : profile?.imageId
                ? profile.imageId
                : "",
          })
          .context(CONTEXT_ID)
          .run();

        console.log(updatequery);

        if (updatequery.content) {
          alert("Updated profile.");
          setProfile({
            name: name ?? profile?.name ?? "",
            username: username ?? profile?.username ?? "",
            description: about ?? profile?.description ?? "",
            imageId: imageUrl
              ? imageUrl
              : profile?.imageId
                ? profile.imageId
                : "",
          });
        }
      }
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  const getProfile = async (): Promise<void> => {
    try {
      const user = await orbis.getConnectedUser();
      if (user) {
        const profile = orbis
          .select("name", "username", "imageid", "description")
          .from(PROFILE_ID)
          // .where({ controller: user.user.did })
          .context(CONTEXT_ID);
        const profileResult = await profile.run();
        console.log(profileResult);
        if (profileResult.rows.length) {
          profileResult.rows[0].imageId = profileResult.rows[0].imageid;
          setProfile(profileResult.rows[0] as Profile);
        }
      }
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  useEffect(() => {
    if (address) {
      void getProfile();
    }
  }, [address]);

  return (
    <section className="flex flex-col items-center pb-6 text-center">
      <MaxWidthWrapper>
        <div className="mt-12 grid gap-5 bg-inherit lg:grid-cols-1">
          <div className="relative flex w-full items-center justify-center">
            <div className="relative flex-col items-center justify-center">
              {file && (
                <Image
                  width={400}
                  height={60}
                  src={URL.createObjectURL(file)}
                  alt={"Alt tag goes here"}
                  className="hover:scale-105"
                  onClick={() => alert("Hello")}
                />
              )}

              {!file && (
                <div className="flex-col items-center justify-center">
                  <MediaRenderer src={profile?.imageId} />
                  <div className="flex items-center justify-center">
                    <label className="flex cursor-pointer items-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-2">
                      <div>
                        <h4 className="text-xs font-semibold text-gray-700">
                          Upload a profile image
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
              )}
            </div>
          </div>
          <div
            className="relative flex flex-col overflow-hidden rounded-3xl border-2 shadow-sm"
            key={"Profile Details"}
          >
            <div className="items-start space-y-4 bg-muted/50 p-6">
              <p className="flex font-urban text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Profile Details
              </p>
              <div className="grid grid-cols-1 gap-4">
                <p className="text-left text-sm font-semibold text-muted-foreground">
                  Name:
                  <TextareaAutosize
                    className="mt-2 w-full rounded-md border p-2"
                    placeholder="Enter your name here..."
                    value={name ?? profile?.name}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      setName(e.target.value);
                    }}
                  />
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <p className="text-left text-sm font-semibold text-muted-foreground">
                  Username:
                  <TextareaAutosize
                    className="mt-2 w-full rounded-md border p-2"
                    placeholder="Enter your username here..."
                    value={username ?? profile?.username}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      setUsername(e.target.value);
                    }}
                  />
                </p>
              </div>
            </div>

            <div className="flex h-full flex-col justify-between gap-16 p-6"></div>
          </div>
          <div
            className="relative flex flex-col overflow-hidden rounded-3xl border-2 shadow-sm"
            key={"About Me"}
          >
            <div className="min-h-[150px] items-start space-y-4 bg-muted/50 p-6">
              <p className="flex font-urban text-sm font-bold uppercase tracking-wider text-muted-foreground">
                About Me
              </p>
              <TextareaAutosize
                className="mt-2 min-h-[100px] w-full rounded-md border p-2 text-left text-sm font-semibold text-muted-foreground"
                placeholder="Enter your message here..."
                value={about ?? profile?.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setAbout(e.target.value);
                }}
              />
            </div>

            <div className="flex h-full flex-col justify-between gap-16 p-6"></div>
          </div>
          <div className="align-center relative flex justify-center">
            <Button
              variant={"default"}
              className="mt-4 w-1/3"
              rounded="full"
              onClick={saveProfile}
            >
              Save Profile
            </Button>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
