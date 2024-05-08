"use client";

import React from "react";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

export const Header = () => {
  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2">
      <div className="navbar-end flex-grow mr-4">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
  );
};
