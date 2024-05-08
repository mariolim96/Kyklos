"use client";

import { useRouter } from "next/navigation";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const router = useRouter();
  router.push("/homepage");

  return <></>;
};

export default Home;
