'use client'
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";

export const useTheme = () => {
    const theme = useContext(ThemeContext)
    if (!theme) throw new Error('Context cannot be outside the root app component');
    return theme;
}