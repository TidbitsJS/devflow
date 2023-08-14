"use client";

import Image from "next/image";

import { useState, useEffect } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { themes } from "@/constants";

const Theme = () => {
  const [mode, setMode] = useState(localStorage.getItem("theme") ?? "light");

  const handleTheme = (selectedMode: string) => {
    if (
      (window.matchMedia("(prefers-color-scheme: dark)").matches &&
        selectedMode === "system") ||
      selectedMode === "dark"
    ) {
      document.documentElement.setAttribute("data-mode", "dark");
      localStorage.setItem("theme", "dark");
      setMode(selectedMode);
    } else {
      document.documentElement.removeAttribute("data-mode");
      localStorage.setItem("theme", "light");
      setMode(selectedMode);
    }
  };

  const setInitialTheme = () => {
    const userPreference = localStorage.getItem("theme");

    if (userPreference === "light" || userPreference === "dark") {
      handleTheme(userPreference);
    } else {
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      handleTheme(systemPreference);
    }
  };

  useEffect(() => {
    setInitialTheme();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='cursor-pointer'>
        {localStorage.getItem("theme") === "light" ? (
          <Image
            src='/assets/icons/sun.svg'
            alt='sun'
            width={20}
            height={20}
            className='active-theme'
          />
        ) : (
          <Image
            src='/assets/icons/moon.svg'
            alt='moon'
            width={20}
            height={20}
            className='active-theme'
          />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='border-none bg-dark-300 py-2'>
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            className='flex items-center gap-4 focus:bg-dark-400'
            onClick={() => {
              if (mode !== theme.value) handleTheme(theme.value);
            }}
          >
            <Image
              src={theme.icon}
              alt={theme.value}
              width={16}
              height={16}
              className={`${mode === theme.value && "active-theme"}`}
            />

            <p
              className={`paragraph-medium ${
                mode === theme.value ? "text-primary-500" : "text-white"
              }`}
            >
              {theme.label}
            </p>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Theme;
