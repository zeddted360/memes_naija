import React from "react";
import Link from "next/link";
import { LinkType } from "../types/types";
import { buttonVariants } from "@/components/ui/button";

import { auth, signOut, signIn } from "../../../auth";

const Nav = async () => {
  const session = await auth();
  const links: LinkType[] = [
    {
      path: "/naija_memes/home",
      title: "Home",
    },
    {
      path: "/naija_memes/news",
      title: "News",
    },
    {
      path: "/naija_memes/about",
      title: "About",
    },
    {
      path: "/naija_memes/contact",
      title: "Contact",
    },
  ];
  return (
    <div className="p-2 hidden md:flex">
      <nav className="flex gap-2">
        {links.map((link: LinkType, index: number) => {
          return (
            <Link
              key={index}
              href={`${link.path}`}
              className={buttonVariants({ variant: "outline" })}
            >
              {link.title}
            </Link>
          );
        })}
        <div className="signs flex gap-1 items-end ">
          {!session?.user ? (
            <>
              <Link
                className="bg-secondary rounded-md px-2"
                href={"/api/auth/signin"}
              >
                Sign In
              </Link>
              <Link
                className="bg-secondary rounded-md px-2"
                href={"/naija_memes/signup"}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <Link
              className="bg-secondary rounded-md px-2"
              href={"/api/auth/signout"}
            >
              Sign Out
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Nav;
