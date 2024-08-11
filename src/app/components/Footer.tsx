import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndustry, faX,} from "@fortawesome/free-solid-svg-icons";

// const Footer = () => {
//   return <div className='flex items-center shadow-lg justify-center p-4 rounded-lg'>&copy; Naija Memes 2024.</div>;
// };

// export default Footer;

export default function Footer() {
  return (
    <footer className=" bg-primary text-secondary-foreground py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-xl text-secondary font-bold mb-4">
               Memes 9Ja
            </h3>
            <p className="text-gray-400">
              Your daily dose of Nigerian humor and laughter.
            </p>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/naija_memes/home"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/naija_memes/about"
                  className="hover:text-yellow-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/memes"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Meme Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/naija_memes/contact"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-2xl hover:text-blue-400 transition-colors"
              >
                <i className="fab fa-facebook"></i>
                {/* <FontAwesomeIcon icon={faFacebook}/> */}
              </Link>
              <Link
                href="#"
                className="text-2xl hover:text-pink-400 transition-colors"
              >
                 <i className="fab fa-instagram"></i>
                <FontAwesomeIcon icon={faIndustry} />
              </Link>
              <Link
                href="#"
                className="text-2xl hover:text-blue-300 transition-colors"
              >
               <FontAwesomeIcon icon={faX}/>
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p className='text-md'>
            &copy; {new Date().getFullYear()} Naija Memes. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}