"use client";
import { signIn, signOut } from "next-auth/react";
import { faBars, faHome } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faBookOpen,
  faUser,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { ModeToggle } from "./theme";

const ShowBar = () => {
  const session = useSession();
  const router = useRouter();

  return (
    <div className="md:hidden text-secondary">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <FontAwesomeIcon style={{ width: 30, height: 30 }} icon={faBars} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Navigation</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link
              className="flex items-center gap-2 w-full"
              href="/naija_memes/home"
            >
              <FontAwesomeIcon className="mr-1" icon={faHome} />
              <span> Home</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FontAwesomeIcon className="mr-2" icon={faPen} />
            <Link
              className="flex items-center gap-2 w-full"
              href="/naija_memes/post"
            >
              <span> Post</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              className="flex items-center w-full gap-2"
              href="/naija_memes/news"
            >
              <FontAwesomeIcon className="mr-1" icon={faBookOpen} />
              <span> News</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              className="flex items-center w-full gap-2"
              href="/naija_memes/about"
            >
              <FontAwesomeIcon className="mr-1" icon={faUser} />
              <span>About</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link className="flex items-center w-full gap-2" href="contact">
              <FontAwesomeIcon className="mr-1" icon={faPhone} />
              <span>Contact</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            {" "}
            <div className="sign ">
              {session.status === "authenticated" ? (
                <Button
                  onClick={async () => {
                    await signOut();
                    router.push("/api/auth/signin");
                  }}
                >
                  Sign out
                </Button>
              ) : (
                <div className=" flex gap-4">
                  <Button
                    onClick={async () => {
                      await signIn();
                      router.push("/naija_memes/home");
                    }}
                  >
                    Sign in
                  </Button>
                  <Button
                    className="button"
                    onClick={async () => {
                      router.push("/naija_memes/signup");
                    }}
                  >
                    Sign up
                  </Button>
                </div>
              )}
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ShowBar;
