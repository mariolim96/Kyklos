"use client";
import React, { useEffect } from "react";
import { themeChange } from "theme-change";
import Select from "./Select";

const Themes = [
  "default",
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
];

const ThemeChanger = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    themeChange(false);
  });
  return (
    <>
      <Select data-choose-theme onChange={() => {return;}} options={Themes} />
    </>
  );
};

export default ThemeChanger;
