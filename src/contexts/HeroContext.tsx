"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useHeroSlides } from "@/hooks/use-cms";

interface HeroContextType {
  rawSlides: any[] | undefined;
  isLoading: boolean;
}

const HeroContext = createContext<HeroContextType>({
  rawSlides: undefined,
  isLoading: true,
});

export const HeroProvider = ({ children }: { children: ReactNode }) => {
  const { data: rawSlides, isLoading } = useHeroSlides();

  return (
    <HeroContext.Provider value={{ rawSlides, isLoading }}>
      {children}
    </HeroContext.Provider>
  );
};

export const useHeroContext = () => useContext(HeroContext);
