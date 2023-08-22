"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

import { themes } from "@/constants";
import {
  Menubar,
  MenubarItem,
  MenubarMenu,
  MenubarContent,
  MenubarTrigger,
} from "@/components/ui/menubar";

const Theme = () => {
  const [mode, setMode] = useState("");

  const handleThemeChange = () => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setMode("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setMode("light");
    }
  };

  useEffect(() => {
    handleThemeChange();
  }, [mode]);

  return (
    <Menubar className='no-focus relative border-none bg-transparent'>
      <MenubarMenu>
        <MenubarTrigger className='p-0 focus:bg-transparent data-[state=open]:bg-transparent dark:focus:bg-transparent dark:data-[state=open]:bg-transparent'>
          {mode === "light" ? (
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
        </MenubarTrigger>

        <MenubarContent className='absolute -right-5 mt-3 min-w-[120px] rounded border border-dark-400 bg-dark-300 py-2'>
          {themes.map((item) => (
            <MenubarItem
              key={item.value}
              className='flex items-center gap-4 px-2.5 py-2 focus:bg-dark-400'
              onClick={() => {
                setMode(item.value);
                if (item.value !== "system") {
                  localStorage.theme = item.value;
                } else {
                  localStorage.removeItem("theme");
                }
              }}
            >
              <Image
                src={item.icon}
                alt={item.value}
                width={16}
                height={16}
                className={`${mode === item.value && "active-theme"}`}
              />

              <p
                className={`body-semibold text-light-500 ${
                  mode === item.value ? "text-primary-500" : "text-white"
                }`}
              >
                {item.label}
              </p>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default Theme;
