"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";

const Home: NextPage = () => {
  const { address } = useAccount();

  return <>{address?.toString()}</>;
};

export default Home;
