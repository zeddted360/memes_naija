
import styles from './landing.module.css';
import Link from 'next/link';

export default function Landing() {
  return (
    <main className={styles.main}>
      <div className={styles.landingHead}>Naija_Memes</div>
      <div className={styles.landingBody}>
        <div className={styles.welcomeMessage}>
          <h1>
            <b>Welcome</b> to Naija_memes just laugh and forget your sorrows
          </h1>
        </div>
        <div className={styles.linksContainer}>
          <Link href={`/naija_memes/signup`}>Join</Link>
          <Link href='/naija_memes/login'>login</Link>
          <Link href='/naija_memes/home'>home</Link>
        </div>
      </div>
      <div className={styles.landingFooter}>&copy; Naija_Memes 2024</div>
    </main>
  );
}
