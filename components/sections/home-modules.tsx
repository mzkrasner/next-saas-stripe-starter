"use client";

import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Profile, UserSubscriptionPlan } from "@/types";
import { MediaRenderer, useStorageUpload } from "@thirdweb-dev/react";
import { SubscriptionPlan } from "@/types/index";
import { pricingData } from "@/config/subscriptions";
import { cn } from "@/lib/utils";
import { useAccount } from "wagmi";
import { Button, buttonVariants } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BillingFormButton } from "@/components/forms/billing-form-button";
import { ModalContext } from "@/components/modals/providers";
import { HeaderSection } from "@/components/shared/header-section";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { useODB } from "@/app/context/OrbisContext";
import { env } from "@/env.mjs";


const PROFILE_ID = env.NEXT_PUBLIC_PROFILE_ID ?? "";
const CONTEXT_ID = env.NEXT_PUBLIC_CONTEXT_ID ?? "";

interface PricingCardsProps {
  userId?: string;
  subscriptionPlan?: UserSubscriptionPlan;
}

export function HomeModules({ userId, subscriptionPlan }: PricingCardsProps) {
  const { setShowSignInModal } = useContext(ModalContext);
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const { orbis } = useODB();
  const { address } = useAccount();

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
    <section className="flex flex-col items-center pt-12 text-center md:col-span-1 lg:col-span-1">
      <MaxWidthWrapper>
        <div className="mt-6 grid justify-items-center gap-5 bg-inherit lg:grid-cols-1">
          <div
            className="relative flex w-2/3 flex-col overflow-hidden rounded-3xl border-2 shadow-sm"
            key={"Home"}
          >
            <div className="items-start space-y-4 bg-muted/50 p-6">
              <p className="flex font-urban text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Home
              </p>
              <div className="flex flex-col">
                <div className="flex flex-row">
                  <div className="flex items-end">
                    <div className="flex text-left text-3xl font-semibold leading-6">
                      {/* <Image
                        width={60}
                        height={60}
                        src={"https://randomuser.me/api/portraits/men/3.jpg"}
                        alt={"https://randomuser.me/api/portraits/men/3.jpg"}
                        className="rounded-full"
                      /> */}
                      <MediaRenderer src={profile?.imageId} 
                        width="4rem"
                        height="4rem"
                        className="rounded-full"
                      />
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-left text-2xl font-semibold leading-6">
                  Welcome back, <span className="text-pink-500">{profile?.username}</span>
                </p>
                <div className="mt-4 text-left text-sm text-muted-foreground">
                  Create a new post or edit your profile
                </div>
              </div>
            </div>

            <div className="flex h-full flex-col justify-between gap-4 p-6">
              <Button
                variant={"default"}
                rounded="full"
                onClick={() => (window.location.href = "/post")}
              >
                Create a Post
              </Button>
              <Button
                variant={"outline"}
                rounded="full"
                onClick={() => (window.location.href = "/profile")}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
