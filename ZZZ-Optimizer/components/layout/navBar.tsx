"use client";

import { useAtom } from "jotai";
import { Icon } from "@iconify/react";
import { useRef, useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

import { DiscordIcon } from "../icons/DiscordIcon";
import { GithubIcon } from "../icons/GithubIcon";
import { RedditIcon } from "../icons/RedditIcon";
import { GoogleIcon } from "../icons/GoogleIcon";
import { PixelatedRefreshIcon } from "../icons/PixelatedRefreshIcon";

import { siteConfig } from "@/config/site";
import { OSWindow } from "@/components/OSWindow";
import { DuotoneIcon } from "@/components/DuotoneIcon";
import { useScanStore } from "@/atomsAndStores/useScanStore";
import { initialSync, pageTitle } from "@/atomsAndStores/atoms";

export const NavBar = () => {
  const { data: session } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const hasLocalData = useScanStore((state) => state.hasLocalData());
  const loginButtonRef = useRef<HTMLDivElement>(null);
  const [hasInitialSync, setHasInitialSync] = useAtom(initialSync);
  const [currentPageTitle] = useAtom(pageTitle);
  const [mounted, setMounted] = useState(false);

  // Don't render until mounted to avoid hydration errors due to the jotai atom determining the page title (and thereby home button icon)
  useEffect(() => {
    setMounted(true);
  }, []);

  //NOTE: Does double calls in dev mode
  useEffect(() => {
    if (session?.user && !hasInitialSync) {
      //we only want to sync once unless manually triggered
      handleLogin();
      setHasInitialSync(true);
    }
  }, [session, hasInitialSync]);

  //try to fetch serverside scan data and sync with local data
  //We'll overwrite local data with server data if the server data is newer
  //NOTE: There really should never be a case where the server data is older than the local data
  //Unless a user managed to get onto the website and upload data while the server was down somehow
  //Or they had no internet connection (and how'd they get here then?)
  async function fetchAndSyncScanData() {
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
    await fetchAndSyncScanData();
  }

  function handleLogout() {
    signOut();
    setHasInitialSync(false);
    console.log("User signed out");
  }

  // Don't render anything until mounted
  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="absolute left-[4vw] top-[7.5vh]">
        {currentPageTitle === "Character Optimizer" ? (
          <a
            className="localEffectCRT relative z-10 flex h-[56px] w-[56px] cursor-pointer items-center justify-center transition-opacity hover:opacity-75"
            href="/"
          >
            <Icon height={56} icon="game-icons:tv" width={56} />
          </a>
        ) : (
          <a
            className="localEffectCRT relative z-10 flex h-[48px] w-[48px] cursor-pointer items-center justify-center transition-opacity hover:opacity-75"
            href={siteConfig.links.github}
          >
            <GithubIcon size={48} />
          </a>
        )}
      </div>
      {currentPageTitle && (
        <div className="absolute left-1/2 top-[8.5vh] -translate-x-1/2 transform">
          <h1 className="font-DOS text-4xl">{currentPageTitle}</h1>
        </div>
      )}
      {session?.user && hasLocalData && (
        <button
          aria-label="Sync data"
          className="localEffectCRT absolute left-[86vw] top-[7vh] z-10 transition-opacity hover:opacity-75"
          style={{ width: 56, height: 56 }}
          onClick={() => {
            fetchAndSyncScanData().catch((error) => {
              console.error("Failed to sync scan data:", error);
            });
          }}
        >
          <PixelatedRefreshIcon size={56} />
        </button>
      )}
      <div
        ref={loginButtonRef}
        className="absolute right-[4vw] top-[7.5vh]"
        title={session?.user ? "Logout" : "Login"}
      >
        <div className="localEffectCRT z-10">
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
      </div>
      {isLoginModalOpen && (
        <OSWindow
          id="loginModal"
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
