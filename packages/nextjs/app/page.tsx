"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Button } from "~~/components/kyklos/ui/button";

const Home: NextPage = () => {
  const { address } = useAccount();

  return (
    <>
      {address?.toString()}

      <Button>button</Button>
    </>
  );
};

export default Home;
