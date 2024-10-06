import { clientFetcher } from "@/utils/api";
import useSWR from "swr";

export function Dashboard() {
  const { data } = useSWR("/api/user", clientFetcher);

  return <div></div>;
}
