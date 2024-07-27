"use client";
import React, { useState } from "react";
import styles from "./sidebar.module.css";
import Link from "next/link";
import { ActionType, StateType } from "@/context/ThemeContext";
import { signIn, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

const Sidebar = ({
  state,
  dispatch,
  setShowBar,
  session
}: {
  state: StateType;
  dispatch: React.Dispatch<ActionType>;
    setShowBar: React.Dispatch<boolean>;
  session:any
}) => {
  
 
  const router = useRouter();
  const pathname = usePathname();
  const [anime, setAnime] = useState<boolean>(false);
  const inner = state.theme === "#21222a" ? "#f9f9f9" : "#21222a";
  const ball = inner === "#21222a" ? "#f9f9f9" : "#21222a";

  const handleChangeTheme = (e: React.MouseEvent<HTMLDivElement>) => {
    setAnime((prevState: boolean) => !prevState);
    dispatch({ type: "TURN_DARK_LIGHT" });
  };
  return (
    <div className={styles.sideBar}>
      <nav
        onClick={() => {
          setShowBar(false);
        }}
      >
        <Link
          className={
            pathname === "/naija_memes/home"
              ? `${styles.active} flex items-center gap-2`
              : `{styles.nonActive}  flex items-center gap-2`
          }
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

        <Link
          className={
            pathname === "/naija_memes/post"
              ? `${styles.active}`
              : `${styles.nonActive}`
          }
          href="/naija_memes/post"
        >
          Post
        </Link>
        <Link
          className={
            pathname === "/naija_memes/news"
              ? `${styles.active}`
              : `${styles.nonActive}`
          }
          href="/naija_memes/news"
        >
          News
        </Link>
        <Link
          className={
            pathname === "/naija_memes/about"
              ? `${styles.active}`
              : `${styles.nonActive}`
          }
          href="/naija_memes/about"
        >
          About
        </Link>
        <Link
          className={
            pathname === "/naija_memes/contact"
              ? `${styles.active}`
              : `${styles.nonActive}`
          }
          href="contact"
        >
          Contact
        </Link>
      </nav>
      <div className="sign flex flex-col gap-x-28">
        {session.status === "authenticated" ? (
          <button
            className="button"
            onClick={async () => {
              await signOut();
              router.push("/api/auth/signin");
            }}
          >
            Sign out
          </button>
        ) : (
          <div className=" flex gap -2">
            <button
              className="button"
              onClick={async () => {
                await signIn();
                router.push("/naija_memes/home");
              }}
            >
              Sign in
            </button>
            <button
              className="button"
              onClick={async () => {
                router.push("/naija_memes/signup");
              }}
            >
              Sign up
            </button>
          </div>
        )}
      </div>
      <div className={styles.changeTheme}>
        <i>Light</i>
        <div
          onClick={handleChangeTheme}
          style={{
            backgroundColor: inner,
          }}
          className={styles.inner}
        >
          <div
            style={{
              backgroundColor: ball,
            }}
            className={` ${styles.ball} ${anime && styles.animate}`}
          ></div>
        </div>
        <i>Dark</i>
      </div>
    </div>
  );
};

export default Sidebar;
