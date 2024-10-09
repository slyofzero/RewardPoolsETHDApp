import { MainLayout, Pools } from "@/components";
import { apiFetcher } from "@/utils/api";
import { PoolsData } from "../api/pools";
import Head from "next/head";

interface Props {
  fallbackData: {
    response: number;
    data: PoolsData;
  };
}

export default function PoolsPage({ fallbackData }: Props) {
  return (
    <>
      <Head>
        <title>Staking Pools</title>
      </Head>

      <MainLayout>
        <Pools fallbackData={fallbackData} />
      </MainLayout>
    </>
  );
}

export async function getStaticProps() {
  const fallbackData = await apiFetcher<PoolsData>(
    `${process.env.NEXT_SERVER_URL}/api/pools`
  );

  return {
    props: {
      fallbackData,
    },
    revalidate: 10,
  };
}
