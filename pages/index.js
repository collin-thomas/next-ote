import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";

export default function Home({}) {
  const router = useRouter();

  /* const refreshData = () => {
    const url = new URL(location.href);
    url.searchParams.set("breed", breed);
    url.searchParams.delete("breed");
    router.replace(url);
  }; */

  return <></>;
}
export async function getServerSideProps(context) {
  return { props: {} };
}
