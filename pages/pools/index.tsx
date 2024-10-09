import { MainLayout, Pools } from "@/components";
import Head from "next/head";

export default function PoolsPage() {
  return (
    <>
      <Head>
        <title>Staking Pools</title>
      </Head>

      <MainLayout>
        <Pools />
      </MainLayout>
    </>
  );
}
