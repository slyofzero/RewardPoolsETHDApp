import { useApi } from "@/hooks";
import { PoolsData } from "@/pages/api/pools";
import { ChangeEvent, useState } from "react";
import { Pool } from "../Dashboard/UserPools";
import { isValidEthAddress } from "@/utils/web3";

interface Props {
  fallbackData: {
    response: number;
    data: PoolsData;
  };
}

export function Pools({ fallbackData }: Props) {
  const [page, setPage] = useState(1);
  // const [lastVisibleId, setLastVisibleId] = useState("");

  const [url, setUrl] = useState(`/api/pools?page=${page}`);
  const { data } = useApi<PoolsData>(url, { fallbackData });
  const pools = data?.data?.pools;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const urlParams = new URLSearchParams(url.split("?")[1]);

    if (isValidEthAddress(value)) {
      urlParams.set("token", value);
      urlParams.delete("name");
    } else {
      urlParams.set("name", value);
      urlParams.delete("token");
    }

    setUrl(`/api/pools?${urlParams.toString()}`);
  };

  return (
    <div className="flex flex-col gap-8 w-full flex-grow bg-black">
      <input
        onChange={onChange}
        type="text"
        className="bg-black rounded-md border-[1.5px] outline-none p-2 placeholder:text-white/75 w-[21rem] mx-auto"
        placeholder="Search pool name or token"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-center">
        {pools?.map((pool, key) => <Pool pool={pool} key={key} />)}
      </div>
    </div>
  );
}
