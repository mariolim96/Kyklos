"use client";

import React from "react";
import { ModeToggle } from "../ui/toggle";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

export const Header = () => {
    return (
        <div className="bg-base pt-8 sticky lg:static top-0 navbar min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-base-2 px-0 sm:px-2">
            <div className="navbar-end flex-grow mr-4">
                <SwitchTheme />
                <ModeToggle></ModeToggle>
                <RainbowKitCustomConnectButton />
                <FaucetButton />
            </div>
        </div>
    );
};
