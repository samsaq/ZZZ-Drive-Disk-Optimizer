"use client";

import { useAtom } from "jotai";
import { Icon } from "@iconify/react";
import { useRef, useState } from "react";

import { GithubIcon } from "./icons";

import { isLoggedIn } from "@/atoms/atoms";
import { siteConfig } from "@/config/site";
import { OSWindow } from "@/components/OSWindow";

export const NavBar = () => {
  const [isUserLoggedIn] = useAtom(isLoggedIn);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const center = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };
  const loginButtonRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="top-16 left-16 absolute">
        <a
          className="cursor-pointer hover:opacity-75 transition-opacity"
          href={siteConfig.links.github}
        >
          <GithubIcon size={48} />
        </a>
      </div>
      {!isUserLoggedIn && (
        <div ref={loginButtonRef} className="top-16 right-16 absolute">
          <Icon
            className="cursor-pointer hover:opacity-75 transition-opacity"
            height={48}
            icon="memory:login"
            width={48}
            onClick={() => setIsLoginModalOpen(true)}
          />
        </div>
      )}
      {isLoginModalOpen && (
        <OSWindow
          isOpen={isLoginModalOpen}
          position={{
            targetRef: loginButtonRef,
            direction: "bottom",
            anchor: "end",
            offset: 10,
          }}
          title="Login"
          onClose={() => setIsLoginModalOpen(false)}
        >
          <div className="flex flex-col gap-4">
            <h2>Window Content</h2>
            <p>This is a draggable window!</p>
          </div>
        </OSWindow>
      )}
    </>
  );
};
