'use client';
import React, { useState, useEffect, useRef } from 'react';
import styles from './circularLoading.module.css';

const CircularLoading = ({ loading, startTime, endTime }: { loading: boolean; startTime: number; endTime: number }) => {
  const elementRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<number | null>(null);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (loading) {
      const totalDuration = endTime ? endTime - startTime : 0;
      const speed = totalDuration / 100;
      let loadingCount = 0;

      intervalRef.current = window.setInterval(() => {
        loadingCount++;
        setCount(loadingCount);
        if (elementRef.current) {
          elementRef.current.textContent = `${loadingCount}%`;
        }
        if (loadingCount >= 100 || !loading) {
          clearInterval(intervalRef.current!);
        }
      }, speed);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } else if (!loading) {
      setCount(100);
      if (elementRef.current) {
        elementRef.current.textContent = '100%';
      }
    }
  }, [loading, startTime, endTime]);

  return (
    <div className={styles.container}>
      <div
        style={{
          background: `conic-gradient(var(--bg-light) ${count * 3.6}deg, #ddd 0deg)`,
        }}
        className={styles.circularProgress}
      >
        <span ref={elementRef} className={styles.progressValue}>0%</span>
      </div>
    </div>
  );
};

export default CircularLoading;

