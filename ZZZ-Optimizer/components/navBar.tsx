"use client";

import { useAtom } from "jotai";
import { Icon } from "@iconify/react";
import { useRef, useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

import { DiscordIcon } from "./icons/DiscordIcon";
import { GithubIcon } from "./icons/GithubIcon";
import { RedditIcon } from "./icons/RedditIcon";
import { GoogleIcon } from "./icons/GoogleIcon";

import { siteConfig } from "@/config/site";
import { OSWindow } from "@/components/OSWindow";
import { DuotoneIcon } from "@/components/DuotoneIcon";
import { useScanStore } from "@/atomsAndStores/useScanStore";

export const NavBar = () => {
  const { data: session } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const loginButtonRef = useRef<HTMLDivElement>(null);

  //NOTE: Does double calls in dev mode
  useEffect(() => {
    if (session?.user) {
      handleLogin();
    }
  }, [session]);

  async function handleLogin() {
    const loginResponse = await fetch("/api/auth/loginAccountHandling", {
      method: "POST",
    });
    const loginData = await loginResponse.json();
    if (loginData.error) {
      console.error("Failed to login:", loginData.error);
    } else {
      setIsLoginModalOpen(false);
      console.log("User logged in");
    }

    //try to fetch serverside scan data and sync with local data
    //We'll overwrite local data with server data if the server data is newer
    //NOTE: There really should never be a case where the server data is older than the local data
    //Unless a user managed to get onto the website and upload data while the server was down somehow
    //Or they had no internet connection (and how'd they get here then?)
    try {
      const scanResponse = await fetch("/api/scans/fetch");
      const scanData = await scanResponse.json();

      if (!scanData.error) {
        useScanStore.getState().syncWithServer(scanData);
      }
    } catch (error) {
      console.error("Failed to fetch scan data:", error);
    }
  }

  function handleLogout() {
    signOut();
    console.log("User signed out");
  }

  return (
    <>
      <div className="absolute left-16 top-16">
        <a
          className="cursor-pointer transition-opacity hover:opacity-75"
          href={siteConfig.links.github}
        >
          <GithubIcon size={48} />
        </a>
      </div>
      <div ref={loginButtonRef} className="absolute right-16 top-16">
        <Icon
          className="cursor-pointer transition-opacity hover:opacity-75"
          height={48}
          icon={session?.user ? "memory:logout" : "memory:login"}
          width={48}
          onClick={
            session?.user ? handleLogout : () => setIsLoginModalOpen(true)
          }
        />
      </div>
      {isLoginModalOpen && (
        <OSWindow
          isOpen={isLoginModalOpen}
          overrideMinWidth={200}
          position={{
            targetRef: loginButtonRef,
            direction: "bottom",
            anchor: "end",
            offset: 10,
          }}
          title="Login"
          onClose={() => setIsLoginModalOpen(false)}
        >
          <div className="grid grid-cols-2 gap-4">
            <DuotoneIcon
              buttonClasses="aspect-square border-3 border-gray-300"
              icon={GoogleIcon}
              iconTitle="Google"
              primaryColor="#d1d5db"
              secondaryColor="black"
              size={32}
              onClick={() => signIn("google")}
            />

            <DuotoneIcon
              buttonClasses="aspect-square border-3 border-gray-300"
              icon={RedditIcon}
              iconTitle="Reddit"
              primaryColor="#d1d5db"
              secondaryColor="black"
              size={32}
              onClick={() => signIn("reddit")}
            />

            <DuotoneIcon
              buttonClasses="aspect-square border-3 border-gray-300"
              icon={GithubIcon}
              iconTitle="GitHub"
              primaryColor="#d1d5db"
              secondaryColor="black"
              size={32}
              onClick={() => signIn("github")}
            />

            <DuotoneIcon
              buttonClasses="aspect-square border-3 border-gray-300"
              icon={DiscordIcon}
              iconTitle="Discord"
              primaryColor="#d1d5db"
              secondaryColor="black"
              size={32}
              onClick={() => signIn("discord")}
            />
          </div>
        </OSWindow>
      )}
    </>
  );
};
