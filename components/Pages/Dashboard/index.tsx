import { UserData } from "@/pages/api/user";
import { clientFetcher } from "@/utils/api";
import useSWR from "swr";
import { UserPools } from "./UserPools";

export function Dashboard() {
  const { data } = useSWR("/api/user", (url) => clientFetcher<UserData>(url));
  const userData = data?.data.data;

  return (
    <div className="flex flex-col gap-16 md:mx-12">
      <UserPools pools={userData?.pools} />
    </div>
  );
}
