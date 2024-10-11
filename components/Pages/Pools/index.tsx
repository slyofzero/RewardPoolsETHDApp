import { useApi } from "@/hooks";
import { PoolsData } from "@/pages/api/pools";
import { ChangeEvent, useState } from "react";
import { Pool } from "../Dashboard/UserPools";
import { isValidEthAddress } from "@/utils/web3";
import { FaPlus } from "react-icons/fa";
import { ShowWhen, Spinner } from "@/components/Utils";
import { Image, Link, PopOver } from "@/components/Common";

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
    <div className="flex flex-col gap-8 w-full flex-grow pb-16 lg:pb-0">
      <div className="flex flex-col md:flex-row md:justify-center items-center w-full relative gap-4">
        <div className="flex flex-col gap-4 justify-center w-full">
          <div className="flex gap-2 justify-center font-extrabold">
            <button className="flex items-center gap-2 border-solid border-white border-[1px] rounded-md px-4 py-1 bg-white text-black">
              <Image className="w-8 aspect-square" src={"/ETH.png"} alt="ETH" />
              ETH
            </button>

            <PopOver text="Coming Soon...">
              <button className="flex items-center gap-2 border-solid border-white border-[1px] rounded-md px-4 py-1">
                <Image
                  className="w-8 aspect-square"
                  src={"/BASE.png"}
                  alt="BASE"
                />
                Base
              </button>
            </PopOver>
          </div>

          <div className="flex justify-center items-center gap-1 w-full">
            <input
              onChange={onChange}
              type="text"
              className="bg-black rounded-md border-[1.5px] outline-none p-2 placeholder:text-white/75 w-full md:w-[21rem] flex-grow md:flex-grow-0"
              placeholder="Search pool name or token"
            />
            <Link
              href={"/pools/create"}
              className="flex md:hidden items-center gap-1 md:absolute right-0 text-black rounded-md font-semibold px-4 text-sm p-2 capitalize bg-white whitespace-nowrap"
            >
              <FaPlus /> Create
            </Link>
          </div>
        </div>

        <Link
          href={"/pools/create"}
          className="hidden md:flex items-center gap-1 md:absolute right-0 text-black rounded-md font-semibold px-4 text-sm p-2 capitalize bg-white whitespace-nowrap mr-4"
        >
          <FaPlus /> Create
        </Link>
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
          disabled={page >= Number(totalPages)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
