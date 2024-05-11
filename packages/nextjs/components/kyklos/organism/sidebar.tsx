"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SidebarTab from "../molecules/sidebarTab";
import { AiOutlineProject } from "react-icons/ai";
import { BsBoxArrowInDown } from "react-icons/bs";
import { HiArrowSmRight } from "react-icons/hi";
import { MdOutlineInsights } from "react-icons/md";
import { TbHexagons } from "react-icons/tb";
import logo from "~~/public/icons/logo.png";
import { SITE_NAME } from "~~/utils/constants";
import { cn } from "~~/utils/utils";

type Props = {
  menu?: Array<{
    title: string;
    src: JSX.Element;
    href: string;
  }>;
};

const Sidebar = (props: Props) => {
  const {
    menu = [
      { title: "OverView", src: <MdOutlineInsights className={"w-6 h-6"} />, href: "/homepage/overview" },
      { title: "Projects", src: <AiOutlineProject className={"w-6 h-6"} />, href: "/homepage/projects" },
      { title: "Retirements", src: <BsBoxArrowInDown className={"w-6 h-6"} />, href: "/homepage/retirements" },
      { title: "Pools", src: <TbHexagons className={"w-6 h-6"} />, href: "/homepage/pools" },
      //   { title: "Exchange ", src: <CgArrowsExchangeAlt className={"w-6 h-6"} />, href: "/homepage/exchange" },
      // { title: 'Setting', src: 'Setting' },
    ],
  } = props;

  const [open, setOpen] = React.useState(true);
  const [selected, setSelected] = React.useState(0);
  const navigate = useRouter();
  const onButtonClick = (index: number, href: string) => {
    setSelected(index);
    navigate.push(href);
  };

  return (
    <div
      className={cn(
        " relative h-screen  p-5 pt-8 border-r-2 border-base shadow-lg shadow-base-2 duration-300 bg-base",
        {
          "w-72": open,
          "w-20": !open,
        },
      )}
    >
      <HiArrowSmRight
        className={cn(
          "absolute -right-2.5 top-10 h-5 w-5 bg-secondary border-1 border-primary  rounded  cursor-pointer",
          {
            "rotate-180": !open,
          },
        )}
        onClick={() => setOpen(!open)}
      />
      <div
        className="flex items-center gap-x-4 "
        onClick={() => navigate.push("/")}
        role="button"
        tabIndex={0}
        onKeyUp={e => {
          if (e.key === "Enter") {
            navigate.push("/");
          }
        }}
      >
        <Image
          alt="logo"
          src={logo}
          className={cn("h-10 w-10 cursor-pointer duration-500", {
            "rotate-[360deg]": open,
          })}
        />
        <h1
          className={cn("origin-right text-2xl text-primary duration-200 ease-in-out font-semibold", {
            "scale-0": !open,
          })}
        >
          {SITE_NAME}
        </h1>
      </div>
      <ul className="pt-6">
        {menu.map((item, index) => (
          <li key={index}>
            <SidebarTab
              index={index}
              item={item}
              selected={selected}
              open={open}
              onButtonClick={onButtonClick}
            ></SidebarTab>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
