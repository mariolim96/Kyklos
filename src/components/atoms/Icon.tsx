/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import logo from "style/images/logo.png";
import eth from "style/images/eth.svg";
import Image, { type StaticImageData } from "next/image";

export type logos = "logo" | "eth";
type iconMapper = {
  [key in logos]: StaticImageData;
};
const Icons: iconMapper = {
  logo,
  eth,
};

interface Props {
  name: logos;
}

function Icon({ name }: Props) {
  return <Image src={Icons[name]} alt="logo" className="logo" />;
}

export default Icon;
