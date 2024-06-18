"use client";

import React from "react";
import DynamicBreadcrumb from "../molecules/dynamicBreadcrumb";
import { Header } from "../organism/header";
import Sidebar from "../organism/sidebar";

interface Props {
    children: React.ReactNode;
}

export const Layout = ({ children }: Props) => (
    <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-col w-full">
            <div className="">
                <Header />
            </div>
            <DynamicBreadcrumb />
            <div className=" flex-1 overflow-y-auto">{children}</div>
        </div>
    </div>
);
