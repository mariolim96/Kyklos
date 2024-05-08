"use client";

import React from "react";
import { Header } from "../organism/header";
import Sidebar from "../organism/sidebar";

interface Props {
  children: React.ReactNode;
}
export const Layout = ({ children }: Props) => (
  <div className="flex h-screen overflow-hidden">
    <Sidebar />
    <div className="w-full min-h-screen pt-8 pb-8">
      <Header />
      <div> content {children} </div>
    </div>
  </div>
);
