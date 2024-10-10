import { useApi } from "@/hooks";
import { PoolsData } from "@/pages/api/pools";
import { ChangeEvent, useState } from "react";
import { Pool } from "../Dashboard/UserPools";
import { isValidEthAddress } from "@/utils/web3";
import { FaPlus } from "react-icons/fa";
import { ShowWhen, Spinner } from "@/components/Utils";
import { Link } from "@/components/Common";

export function Pools() {
  const [page, setPage] = useState(1);
  const [url, setUrl] = useState(`/api/pools?page=${page}`);
  const { data, isLoading } = useApi<PoolsData>(url);
  const pools = data?.data?.pools;
  const lastVisibleId = data?.data?.lastVisible;
  const totalPages = data?.data?.pages;

  // History of lastVisibleId for pagination
  const [history, setHistory] = useState<string[]>([""]);

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

  const onPrev = () => {
    if (history.length > 1) {
      const prevLastVisibleId = history.at(-2) || "";
      const newHistory = history.slice(0, -1);

      const urlParams = new URLSearchParams(url.split("?")[1]);
      urlParams.set("lastVisibleId", prevLastVisibleId);

      setUrl(`/api/pools?${urlParams.toString()}`);
      setHistory(newHistory);
      setPage((prev) => prev - 1);
    }
  };

  const onNext = () => {
    if (lastVisibleId) {
      const urlParams = new URLSearchParams(url.split("?")[1]);

      setHistory([...history, lastVisibleId]);

      urlParams.set("lastVisibleId", lastVisibleId);
      setUrl(`/api/pools?${urlParams.toString()}`);
      setPage((prev) => prev + 1);
    }
  };

  const poolsComponent = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-center flex-grow">
      {pools?.map((pool, key) => <Pool pool={pool} key={key} />)}
    </div>
  );

  const noPoolsComponent = (
    <div className="flex items-center justify-center flex-grow">
      <h6 className="text-2xl font-extrabold text-center">
        No pools have been created yet.{" "}
        <Link className="underline underline-offset-4" href={"/pools/create"}>
          Click here
        </Link>{" "}
        to create one.
      </h6>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 w-full flex-grow bg-black pb-16 lg:pb-0">
      <div className="flex md:justify-center items-center w-full relative">
        <input
          onChange={onChange}
          type="text"
          className="bg-black rounded-md border-[1.5px] outline-none p-2 placeholder:text-white/75 w-[14rem] md:w-[21rem]"
          placeholder="Search pool name or token"
        />
        <button className="flex items-center gap-1 absolute right-0 text-black rounded-md font-semibold px-4 text-sm p-2 capitalize bg-white whitespace-nowrap mr-4">
          <FaPlus /> Create
        </button>
      </div>

      <ShowWhen
        component={
          <ShowWhen
            component={poolsComponent}
            when={pools?.length}
            otherwise={noPoolsComponent}
          />
        }
        when={!isLoading}
        otherwise={
          <div className="flex items-center justify-center flex-grow">
            <Spinner />
          </div>
        }
      />

      <div className="flex items-center justify-center gap-4 font-bold">
        <button
          onClick={onPrev}
          className="text-black bg-white rounded-md px-4 text-sm p-2 capitalize disabled:bg-white/50"
          disabled={page === 1}
        >
          Previous
        </button>

        <button
          onClick={onNext}
          className="text-black bg-white rounded-md px-4 text-sm p-2 capitalize disabled:bg-white/50"
          disabled={totalPages ? page >= totalPages : false}
        >
          Next
        </button>
      </div>
    </div>
  );
}
