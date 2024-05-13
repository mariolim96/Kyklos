"use client";

import GetProjects from "./_components/getProjexts";
import type { NextPage } from "next";
import { Label } from "~~/components/kyklos/ui/label";

const HomePage: NextPage = () => {
  return (
    <div className="p-4">
      <Label className="m-4 font-bold text-lg">Explorer</Label>

      <GetProjects />
    </div>
  );
};

export default HomePage;
