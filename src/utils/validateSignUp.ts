import React from 'react';
import { UserType } from '@/app/ui/SignUp';

export const validateSignUp = (
  value: string,
  name: string,
  password: string,
  setErrors: React.Dispatch<React.SetStateAction<UserType>>,
  setUser: React.Dispatch<React.SetStateAction<UserType>>
) => {
  if (name === 'username') {
    if (value.trim().length < 4) {
      setErrors((prevState) => ({
        ...prevState,
        username: 'Username too short',
      }));
      setUser((prevState: UserType) => ({
        ...prevState,
        username: '',
      }));
    } else {
      setErrors((prevState) => ({
        ...prevState,
        username: '',
      }));
      setUser((prevState: UserType) => ({
        ...prevState,
        username: value,
      }));
    }
  }

  if (name === 'email') {
    if (!(value.trim().includes('@') && value.trim().includes('.'))) {
      setErrors((prevState) => ({
        ...prevState,
        email: 'Email must include an "@" and a "."',
      }));
      setUser((prevState: UserType) => ({
        ...prevState,
        email: '',
      }));
    } else {
      setErrors((prevState) => ({
        ...prevState,
        email: '',
      }));
      setUser((prevState: UserType) => ({
        ...prevState,
        email: value,
      }));
    }
  }

  if (name === 'password') {
    let uppRegEx = new RegExp('.*[A-Z].*');
    let lowRegEx = new RegExp('.*[a-z].*');
    let numRegEx = new RegExp('.*[0-9].*');
    let specialRegEx = new RegExp('.*[^A-Za-z0-9s]');
    if (
      !uppRegEx.test(value) ||
      !lowRegEx.test(value) ||
      !numRegEx.test(value) ||
      !specialRegEx.test(value) ||
      value.trim().length < 6
    ) {
      setUser((prevState: UserType) => ({
        ...prevState,
        password: value,
      }));
      setErrors((prevState) => ({
        ...prevState,
        password: `Password must at least six (6) chars, include  an uppercase, \n a lowercase letter and any digit \n and any special chars`,
      }));
    } else {
      setUser((prevState: UserType) => ({
        ...prevState,
        password: value,
      }));
      setErrors((prevState) => ({
        ...prevState,
        password: ``,
      }));
    }
  }

  if (name === 'confirmPassword') {
    if (value.trim() !== password) {
      setErrors((prevState) => ({
        ...prevState,
        confirmPassword: 'Password do not match',
      }));
      setUser((prevState: UserType) => ({
        ...prevState,
        confirmPassword: '',
      }));
    } else {
      setErrors((prevState) => ({
        ...prevState,
        confirmPassword: '',
      }));
      setUser((prevState: UserType) => ({
        ...prevState,
        confirmPassword: value,
      }));
    }
  }
};
