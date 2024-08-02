import Header from "../components/Header";
import Footer from "../components/Footer";
import { IMetaTemplate } from "../types/types";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-red 100">
      <div >
        <Header />
      </div>
      <div className=''>{children}</div>
      <Footer />
    </div>
  );
}
