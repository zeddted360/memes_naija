import { auth } from "../../../auth";
import Footer from "../components/Footer";
import Header from "../components/Header";

import { IMetaTemplate } from "../types/types";
import LayoutChild from "./LayoutChild";

export const metadata: IMetaTemplate = {
  title: {
    default: "Naija Memes | Home",
    template: "Naija memes | %s",
  },
  description:
    "Naija Memes is the best solution for funny  Nigerian Memes, Humor and laughter. Discover funny content,jokes, and viral memes from Nigeria and beyond.Laugh out loudwith Naija Memes :)",
  keywords:
    "Naija Memes, 9ja Memes, Nigerian Memes Funny Memes, Humor, Laughter, Jokes, Viral Memes",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <>
      <LayoutChild session={session}>
        <div className="relative">
          <div className="fixed w-full top-0 left-0 z-50">
            <Header />
          </div>
          <div className="pt-[16%] md:pt-[10%] lg:pt-[8%] mx-auto">
            {children}
          </div>
          <Footer />
        </div>
      </LayoutChild>
    </>
  );
}
