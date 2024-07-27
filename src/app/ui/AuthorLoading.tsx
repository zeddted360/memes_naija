import React from 'react'
import styles from './authorloading.module.css'

const AuthorLoading = () => {
  return (
    <div className={styles.loadingContainer}>
        <div className={styles.loading}></div>
    </div>
  )
}

export default AuthorLoading