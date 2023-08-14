"use client";

import React from "react";
import Image from "next/image";

import { Input } from "@/components/ui/input";

interface CustomInputProps {
  iconPosition: string;
  imgSrc: string;
  placeholder: string;
  value?: string;
  name?: string;
  onChange?: (name: string, value: string) => void;
  classname?: string;
}

const Searchbar = ({
  iconPosition,
  imgSrc,
  placeholder,
  value,
  name,
  onChange,
  classname,
}: CustomInputProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (onChange) {
      onChange(name, value);
    }
  };

  return (
    <form
      className={`dark-gradient flex min-h-[56px] max-w-[600px] grow items-center gap-4 rounded-[10px] px-4 ${classname}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          alt='search'
          width={24}
          height={24}
          className='cursor-pointer'
        />
      )}

      <Input
        type='text'
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={handleChange}
        className='paragraph-regular no-focus border-none text-light-700 outline-none placeholder:text-light-500'
      />

      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          alt='search'
          width={15}
          height={15}
          className='cursor-pointer'
        />
      )}
    </form>
  );
};

export default Searchbar;
