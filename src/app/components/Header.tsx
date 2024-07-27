import React from "react";
import styles from "./header.module.css";
import Link from "next/link";
import Nav from "../ui/Nav";
import ShowBar from "../ui/ShowBar";
import Image from "next/image";
import { auth ,signOut,signIn} from '../../../auth';
import { SessionProvider } from "next-auth/react";

const Header = async() => {
  const session = await auth();
  return (
    <SessionProvider>
      <div className={styles.header}>
        <div className={styles.headerLogo}>
          <Link className={styles.siteName} href={`/naija_memes/home`}>
            <Image
              alt="memesLogo"
              className="rounded-full"
              width={50}
              height={50}
              src="/images/memesLogo.jpeg"
            />
            <h1 className="`text-3xl font-bold">Naija Memes</h1>
          </Link>
          <br />
          <hr />
          <ShowBar />
          <Nav />
          <div className=" p-2 hidden md:flex flex-col gap-2 ">
            {session ? (
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/api/auth/signin" });
                }}
              >
                <button>sign out</button>
              </form>
            ) : (
              <form
                action={async () => {
                  "use server";
                  await signIn("", { redirectTo: "/naija_memes/home" });
                }}
              >
                <button>sign in</button> 
              </form>
            )}
            {!session && <Link href="/naija_memes/signup">sign up</Link>}
          </div>
        </div>
      </div>
    </SessionProvider>
  );
};

export default Header;
