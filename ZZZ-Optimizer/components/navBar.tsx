"use client";

import { useAtom } from "jotai";
import { Icon } from "@iconify/react";
import { useRef, useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

import { DiscordIcon } from "./icons/DiscordIcon";
import { GithubIcon } from "./icons/GithubIcon";
import { RedditIcon } from "./icons/RedditIcon";
import { GoogleIcon } from "./icons/GoogleIcon";

import { isLoggedIn, loginData } from "@/atoms/atoms";
import { siteConfig } from "@/config/site";
import { OSWindow } from "@/components/OSWindow";
import { DuotoneIcon } from "@/components/DuotoneIcon";

export const NavBar = () => {
  const { data: session } = useSession();
  const [isUserLoggedIn] = useAtom(isLoggedIn);
  const [userLoginData, setUserLoginData] = useAtom(loginData);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const loginButtonRef = useRef<HTMLDivElement>(null);

  //NOTE: Does double calls in dev mode
  useEffect(() => {
    if (session?.user) {
      handleLogin();
    }
  }, [session]);

  async function handleLogin() {
    const response = await fetch("/api/auth/loginAccountHandling", {
      method: "POST",
    });
    const data = await response.json();
    console.log("Data:", data);
    if (data.error) {
      console.error("Failed to login:", data.error);
    } else {
      setUserLoginData({ uuid: data.uuid });
      setIsLoginModalOpen(false);
      console.log("User login data set:", userLoginData);
      console.log("User is logged in:", isUserLoggedIn);
    }
  }

  function handleLogout() {
    setUserLoginData({ uuid: "" });
    signOut();
    console.log("User signed out, login data set to empty");
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
          icon={isUserLoggedIn ? "memory:logout" : "memory:login"}
          width={48}
          onClick={
            isUserLoggedIn ? handleLogout : () => setIsLoginModalOpen(true)
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
