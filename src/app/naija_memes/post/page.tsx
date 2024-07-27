import React from 'react';
import styles from '@/app/ui/create.module.css';
import CreatePost from '@/app/ui/CreatePost';
import { auth } from '@/../../auth';
import { redirect } from 'next/navigation';


export const metadata = {
  title: 'Add Post',
  description: 'Naija_memes Create Post',
};


export default async function Create() {
  const session = await auth();
  if (!session) redirect('/api/auth/signin');
    
  return (
    <div className={styles.create_container}>
      <CreatePost session={session} styles={styles} />
    </div>
  );
}
