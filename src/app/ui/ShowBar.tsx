"use client";
import { signIn, signOut } from "next-auth/react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
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
import { useRouter, } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen,faBookOpen,faUser,faPhone } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const ShowBar = () => {
  const session = useSession();
  const router = useRouter();
  const [showBar, setShowBar] = useState(false);
  
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                  <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                </svg>
                <span> Home</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FontAwesomeIcon
                className="mr-1"
                style={{ width: 20, height: 20 }}
                icon={faPen}
              />
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
                <FontAwesomeIcon icon={faBookOpen} />
                <span> News</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                className="flex items-center w-full gap-2"
                href="/naija_memes/about"
              >
                <FontAwesomeIcon icon={faUser} />
                <span>About</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link className="flex items-center w-full gap-2" href="contact">
                <FontAwesomeIcon icon={faPhone} />
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
