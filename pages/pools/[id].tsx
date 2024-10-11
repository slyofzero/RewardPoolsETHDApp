import { Pool } from "@/components/Pages/Dashboard/UserPools";
import { useApi } from "@/hooks";
import { useRouter } from "next/router";
import type { PoolData } from "../api/pool/[id]";
import { MainLayout } from "@/components";

function PoolData() {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useApi<PoolData>(`/api/pool/${id}`);

  if (!data?.pool) {
    return <div></div>;
  }

  return (
    <div className="flex flex-grow items-center justify-center">
      <Pool pool={data?.pool} />
    </div>
  );
}

export default function PoolPage() {
  return (
    <MainLayout>
      <PoolData />
    </MainLayout>
  );
}
