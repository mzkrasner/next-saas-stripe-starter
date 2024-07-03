"use client";

import { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserSubscriptionPlan } from "@/types";
import TextareaAutosize from "react-textarea-autosize";

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

interface PricingCardsProps {
  userId?: string;
  subscriptionPlan?: UserSubscriptionPlan;
}

export function ProfileModules({
  userId,
  subscriptionPlan,
}: PricingCardsProps) {
  const { setShowSignInModal } = useContext(ModalContext);

  return (
    <section className="flex flex-col items-center pb-6 text-center">
      <MaxWidthWrapper>
        <div className="mt-12 grid gap-5 bg-inherit lg:grid-cols-1">
          <div className="relative flex w-full items-center justify-center">
            <a className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 text-center opacity-0 duration-300 hover:opacity-100">
              <h1 className="text-md hover:cursor-pointer">Replace Image</h1>
            </a>
            <Image
              width={400}
              height={60}
              src={"https://randomuser.me/api/portraits/men/3.jpg"}
              alt={"https://randomuser.me/api/portraits/men/3.jpg"}
              className="hover:scale-105"
              onClick={() => alert("Hello")}
            />
          </div>
          <div
            className="relative flex flex-col overflow-hidden rounded-3xl border-2 shadow-sm"
            key={"Profile Details"}
          >
            <div className="min-h-[150px] items-start space-y-4 bg-muted/50 p-6">
              <p className="flex font-urban text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Profile Details
              </p>
              <div className="grid grid-cols-1 gap-4">
                <p className="text-left text-sm font-semibold text-muted-foreground">
                  Name:
                  <TextareaAutosize
                    className="mt-2 w-full rounded-md border p-2"
                    placeholder="Enter your message here..."
                    value={"name"}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      // setMessage(e.target.value);
                    }}
                  />
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <p className="text-left text-sm font-semibold text-muted-foreground">
                  Username:
                  <TextareaAutosize
                    className="mt-2 w-full rounded-md border p-2"
                    placeholder="Enter your message here..."
                    value={"username"}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      // setMessage(e.target.value);
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
                value={
                  " I am a software engineer with a passion for building web applications."
                }
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  // setMessage(e.target.value);
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
              onClick={() => setShowSignInModal(true)}
            >
              Save Profile
            </Button>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
