import React from "react";
import Link from "next/link";
import Nav from "../ui/Nav";
import ShowBar from "../ui/ShowBar";
import Image from "next/image";
import { SessionProvider } from "next-auth/react";

const Header = async () => {
  return (
    <SessionProvider>
      <div className="p1 bg-primary text-secondary-foreground flex justify-between items-center p-4">
        <div className="c1 ">
          <Link
            className="flex items-center gap-2 justify-center"
            href={`/naija_memes/home`}
          >
            <Image
              alt="memesLogo"
              className="rounded-full"
              width={50}
              height={50}
              src="/images/memesLogo.jpeg"
            />
            <h1 className="text-xl font-bold text-secondary">Memes 9ja</h1>
          </Link>
        </div>
        <div className=" bg red-800 c2">
          <ShowBar />
          <Nav />
        </div>
      </div>
    </SessionProvider>
  );
};

export default Header;
