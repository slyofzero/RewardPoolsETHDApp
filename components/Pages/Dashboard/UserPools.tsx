import { Image, Link } from "@/components/Common";
import { StakingModal } from "@/components/Modals";
import { CreatePoolModal } from "@/components/Modals/CreatePoolModal";
import { ShowWhen } from "@/components/Utils";
import { StoredPool } from "@/types";
import { classNames } from "@/utils";
import { shortenEthAddress } from "@/utils/web3";
import moment from "moment";
import { useState } from "react";
import { FaXTwitter, FaTelegram, FaGlobe } from "react-icons/fa6";

interface PoolProps {
  pool: StoredPool;
  dashboard?: boolean;
  showPoolData?: boolean;
}

export function Pool({ pool, dashboard, showPoolData }: PoolProps) {
  const [showModal, setShowModal] = useState(false);
  const [showStakingModal, setShowStakingModal] = useState(false);

  const closesAtMilli =
    // @ts-ignore
    pool.closesAt._seconds * 1000 + pool.closesAt._nanoseconds / 1000000;
  const closesAt = moment(closesAtMilli).format("Do MMMM, YYYY");

  const createdAtMilli =
    // @ts-ignore
    pool.createdOn._seconds * 1000 + pool.createdOn._nanoseconds / 1000000;
  const createdAt = moment(createdAtMilli).format("Do MMMM, YYYY");

  const depositToPoolButton = (
    <button
      onClick={() => setShowModal(true)}
      className="text-black bg-white rounded-md font-bold px-4 text-sm p-2 capitalize"
    >
      Deposit Rewards or Gas
    </button>
  );

  const stakeButton = (
    <button
      onClick={() => setShowStakingModal(true)}
      className="text-black bg-white rounded-md font-bold px-4 text-sm p-2 capitalize"
    >
      Stake
    </button>
  );

  const Parent = ({ children }: { children: React.ReactNode }) => {
    const className =
      "flex flex-col gap-4 p-4 rounded-md border-white border-[1px] border-solid md:min-w-[25rem] md:max-w-[30rem]";

    if (showPoolData) {
      return <div className={className}>{children}</div>;
    } else {
      return (
        <Link href={`/pools/${pool.id}`} className={className}>
          {children}
        </Link>
      );
    }
  };

  return (
    <>
      <Parent>
        <div className="flex justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-4">
              <Image
                className="aspect-square rounded-full w-16"
                src={pool.logo}
                alt="logo"
              />
              <h6 className="text-xl font-bold">{pool.name}</h6>
            </div>

            <ShowWhen
              component={
                <p>
                  {showPoolData
                    ? pool.description
                    : `${pool.description?.slice(0, 35)}...`}
                </p>
              }
              when={pool.description}
            />
            <ShowWhen
              component={
                <span>
                  Creator -{" "}
                  <Link
                    className="underline underline-offset-4"
                    href={`https://etherscan.io/address/${pool.creator}`}
                    target="_blank"
                  >
                    {shortenEthAddress(pool.creator, 5)}
                  </Link>
                </span>
              }
              when={!dashboard}
            />
          </div>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex justify-center items-center gap-4">
              <ShowWhen
                component={
                  <Link href={pool.twitter} target="_blank">
                    <FaXTwitter />
                  </Link>
                }
                when={pool.twitter}
              />

              <ShowWhen
                component={
                  <Link href={pool.telegram} target="_blank">
                    <FaTelegram />
                  </Link>
                }
                when={pool.telegram}
              />

              <ShowWhen
                component={
                  <Link href={pool.website} target="_blank">
                    <FaGlobe />
                  </Link>
                }
                when={pool.website}
              />
            </div>

            <span
              className={classNames(
                "p-1 px-4 rounded-md text-black font-extrabold text-sm",
                pool.status === "PENDING"
                  ? "bg-orange-500"
                  : pool.status === "ACTIVE"
                    ? "bg-green-500"
                    : "bg-gray-500"
              )}
            >
              {pool.status}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p>
            <strong>Staked</strong> - {pool.staked} / {pool.size}
          </p>
          <h6>
            <strong>APY</strong> - {pool.reward}%
          </h6>
        </div>

        <span>
          Started on - <strong>{createdAt}</strong>
        </span>
        <span>
          Closes at - <strong>{closesAt}</strong>
        </span>

        <ShowWhen
          component={depositToPoolButton}
          when={pool.status === "PENDING" && dashboard}
        />

        <ShowWhen
          component={stakeButton}
          when={pool.status === "ACTIVE" && !dashboard}
        />
      </Parent>

      <ShowWhen
        component={
          <CreatePoolModal poolData={pool} setShowModal={setShowModal} />
        }
        when={showModal}
      />

      <ShowWhen
        component={
          <StakingModal poolData={pool} setShowModal={setShowStakingModal} />
        }
        when={showStakingModal}
      />
    </>
  );
}

interface Props {
  pools: StoredPool[] | undefined;
}

export function UserPools({ pools }: Props) {
  const userPools = (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
      {pools?.map((pool, key) => (
        <Pool key={key} dashboard={true} pool={pool} />
      ))}
    </div>
  );

  const noUserPools = (
    <div className="text-center text-lg font-bold">
      You have&apos;t created any staking pools yet.{" "}
      <Link className="underline underline-offset-4" href={"/pools/create"}>
        Click here
      </Link>{" "}
      to create one.
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-3xl font-extrabold text-center md:text-left">
        Your Staking Pools
      </h2>

      <ShowWhen component={userPools} when={pools} otherwise={noUserPools} />
    </div>
  );
}
