"use client";

import { useAtom } from "jotai";
import { Icon } from "@iconify/react";

import { GithubIcon } from "./icons";

import { isLoggedIn } from "@/atoms/atoms";
import { siteConfig } from "@/config/site";

export const NavBar = () => {
  const [isUserLoggedIn] = useAtom(isLoggedIn);

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
        <div className="top-16 right-16 absolute">
          <Icon
            height={48}
            icon="memory:login"
            width={48}
            className="cursor-pointer hover:opacity-75 transition-opacity"
          />
        </div>
      )}
    </>
  );
};
