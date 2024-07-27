import React, { useRef } from 'react';
import { UserType } from './SignUp';
import { SearchParamsContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime';

export default function PasswordCheck({
  styles,
  user,
}: {
  styles: any;
  user: UserType;
}) {
  const checkRef = {
    upperRef: useRef<HTMLInputElement>(null),
    lowerRef: useRef<HTMLInputElement>(null),
    numberRef: useRef<HTMLInputElement>(null),
    specialRef: useRef<HTMLInputElement>(null),
  };
  const { upperRef, lowerRef, numberRef, specialRef } = checkRef;
  let uppRegEx = new RegExp('.*[A-Z].*');
  let lowRegEx = new RegExp('.*[a-z].*');
  let numRegEx = new RegExp('.*[0-9].*');
  let specialRegEx = new RegExp('.*[^A-Za-z0-9s]');

  return (
    <div className={styles.checkboxesContainer}>
      <div className={styles.uppercase}>
        <span>
          <input
            ref={checkRef.upperRef}
            type='checkbox'
            readOnly
            id='uppercase'
            checked={user.password ? uppRegEx.test(user.password) : false}
          />{' '}
          Uppercase
        </span>
      </div>
      <div className={styles.lowercase}>
        <span>
          <input
            ref={checkRef.lowerRef}
            type='checkbox'
            readOnly
            id='lowercase'
            checked={user.password ? lowRegEx.test(user.password) : false}
          />{' '}
          Lowercase
        </span>
      </div>
      <div className={styles.number}>
        <span>
          <input
            ref={checkRef.numberRef}
            type='checkbox'
            id='number'
            readOnly
            checked={user.password ? numRegEx.test(user.password) : false}
          />{' '}
          Number
        </span>
      </div>
      <div className={styles.specialChar}>
        <span>
          <input
            ref={checkRef.specialRef}
            type='checkbox'
            readOnly
            id='special'
            checked={user.password ? specialRegEx.test(user.password) : false}
          />{' '}
          Special Char
        </span>
      </div>
    </div>
  );
}
