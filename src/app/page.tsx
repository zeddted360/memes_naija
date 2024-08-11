import { Button } from '@/components/ui/button';
import { buttonVariants } from "@/components/ui/button";

import Link from 'next/link';
import { auth } from '../../auth';

export default async  function Landing() {
  const session = await auth()
  // if (session) navigate('naija_memes/home');
  return (
    <main className="h-screen flex flex-col justify-between">
      <h1 className="p-2 text-center shadow-lg  font-bold">
        <p>
          Welcome to <b className="text-2xl">Memes 9ja</b>
        </p>
        <i className="text-sm">where sorrow turn laughter</i>
      </h1>
      <div className="laugh_bg  text-primary flex justify-center items-center gap-4 rounded-lg h-[100%]">
        <Link
          href={`/naija_memes/signup`}
          className={buttonVariants({ variant: "outline" })}
        >
          Join
        </Link>
        <Link
          href={`/naija_memes/login`}
          className={buttonVariants({ variant: "outline" })}
        >
          login
        </Link>
        <Link
          href={`/naija_memes/home`}
          className={buttonVariants({ variant: "outline" })}
        >
          home
        </Link>
      </div>
      <div className="self-center p-2 text-center shadow-lg">
        &copy; Naija_Memes 2024
      </div>
    </main>
  );
}
