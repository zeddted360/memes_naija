import React from 'react';
import styles from './loading.module.css';

export default function Loading() {
  return (
    <div className={styles.skeleton_container}>
      <div className={styles.skeleton_image}></div>
      <div className={styles.skeleton_content}>
        <div className={styles.skeleton_title}></div>
        <div className={styles.skeleton_body}></div>
      </div>
    </div>
  );
}
