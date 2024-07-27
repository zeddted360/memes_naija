'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './nav.module.css';
import { LinkType } from '../types/types';

const Nav = () => {
  const pathname = usePathname();
  const links: LinkType[] = [
    {
      path: '/naija_memes/home',
      title: 'Home',
    },
    {
      path: '/naija_memes/news',
      title: 'news',
    },
    {
      path: '/naija_memes/about',
      title: 'about',
    },
    {
      path: '/naija_memes/contact',
      title: 'contact',
    },
  ];
  return (
    <div className={styles.navLinks}>
      <nav>
        {links.map((link: LinkType) => (
          <Link
            className={
              pathname === link.path ? `${styles.active}` : `${styles.nonActive}`
            }
            href={`${link.path}`}
            key={`${link.path}`}
          >
            {link.title}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Nav;
