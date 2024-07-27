"use client";
import React, { useState, useRef } from "react";
import PasswordCheck from "./PasswordCheck";
import { validateSignUp } from "@/utils/validateSignUp";
import { useRouter } from "next/navigation";
export type UserType = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};
type ProfilePicType = {
  profilePic: File;
};
const SignUpUi = ({ styles }: { styles: any }) => {
  const router = useRouter();
  const [user, setUser] = useState<UserType>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState<Boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    const { password } = user;
    validateSignUp(value, name, password, setErrors, setUser);
  };

  const showPassword = () => {
    user.password
      ? setShowPass((prevState: Boolean) => !prevState)
      : setShowPass(false);
  };
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const formData = new FormData(form as HTMLFormElement);
    try {
      setLoading(true);
      const res = await fetch(`/api/user`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        setLoading(false);
        throw new Error("Something went wrong");
      }
      const data = await res.json();
      window.alert(data.message);
      setLoading(false);
      router.push('/naija_memes/home');
    } catch (error: any) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const isFormInvalid: () => boolean = () => {
    const { username, email, password, confirmPassword } = user;
    let errs = Object.values(errors);
    const isThereErr = errs.some((err) => err);
    if (isThereErr) {
      return true;
    } else if (!(username && email && password && confirmPassword)) {
      return true;
    }
    return false;
  };

  return (
    <div className={styles.signUp}>
      <form onSubmit={handleSignUp}>
        <div>
          <input
            required
            type="text"
            onChange={handleChange}
            placeholder="Username"
            name="username"
            id="username"
          />
          {errors.username && (
            <div className={styles.error}>{errors.username}</div>
          )}
        </div>
        <div>
          <input
            required
            type="email"
            onChange={handleChange}
            placeholder="email"
            name="email"
            id="email"
          />
          {errors.email && <div className={styles.error}>{errors.email}</div>}
        </div>
        <div>
          <input
            required
            type={!showPass ? "password" : "text"}
            onChange={handleChange}
            placeholder="*********"
            name="password"
            id="password"
          />
          {errors.password && (
            <div className={styles.errorPassword}>{errors.password}</div>
          )}
          {errors.password && <PasswordCheck styles={styles} user={user} />}
          <br />
          <span className="flex  gap-1 items-center justify-center">
            <input
              type="checkbox"
              onChange={showPassword}
              className="w-4 h-4"
              checked={showPass}
              id="showPass"
            />
            <label htmlFor="showPass">
              {showPass ? "Hide Password" : "Show Password"}
            </label>
          </span>
        </div>
        <div>
          <input
            required
            type="password"
            onChange={handleChange}
            placeholder="Re-enter Password"
            name="confirmPassword"
            id="confirmPassword"
          />
          {errors.confirmPassword && (
            <div className={styles.error}>{errors.confirmPassword}</div>
          )}
        </div>
        <div>
          <input
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0] as File;
              setFile(file);
            }}
            id="profilePic"
            name="profilePic"
          />
        </div>
        <button
          disabled={isFormInvalid()}
          className={isFormInvalid() ? styles.disabled : styles.nonDisabled}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignUpUi;
