import { UserData } from "@/pages/api/user";
import { UserPools } from "./UserPools";
import { useApi } from "@/hooks";
import { UserStakes } from "./UserStakes";

export function Dashboard() {
  const { data } = useApi<UserData>("/api/user");
  const userData = data?.data;

  return (
    <div className="flex flex-col gap-16 md:mx-12 pb-16">
      <UserPools pools={userData?.pools} />
      <UserStakes stakes={userData?.stakings} />
    </div>
  );
}
