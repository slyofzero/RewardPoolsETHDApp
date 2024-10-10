import { Link } from "@/components/Common";
import { StakingModal } from "@/components/Modals";
import { CreatePoolModal } from "@/components/Modals/CreatePoolModal";
import { ShowWhen } from "@/components/Utils";
import { StoredPool } from "@/types";
import { classNames } from "@/utils";
import { shortenEthAddress } from "@/utils/web3";
import moment from "moment";
import { useState } from "react";

interface PoolProps {
  pool: StoredPool;
  dashboard?: boolean;
}

export function Pool({ pool, dashboard }: PoolProps) {
  const [showModal, setShowModal] = useState(false);
  const [showStakingModal, setShowStakingModal] = useState(false);

  const milliseconds =
    // @ts-ignore
    pool.closesAt._seconds * 1000 + pool.closesAt._nanoseconds / 1000000;
  const closesAt = moment(milliseconds).format("Do MMMM, YYYY");

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

  return (
    <>
      <div className="flex flex-col gap-4 p-4 rounded-md border-white border-[1px] border-solid">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <h6 className="text-xl font-bold">{pool.name}</h6>
            <ShowWhen
              component={
                <span>Creator - {shortenEthAddress(pool.creator, 5)}</span>
              }
              when={!dashboard}
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

        <div className="flex items-center justify-between">
          <p>
            <strong>Staked</strong> - {pool.staked} / {pool.size}
          </p>
          <h6>
            <strong>Reward</strong> - {pool.reward}%
          </h6>
        </div>

        <span>
          Closes at - <strong>{closesAt}</strong>
        </span>

        <ShowWhen
          component={depositToPoolButton}
          when={pool.status === "PENDING"}
        />

        <ShowWhen
          component={stakeButton}
          when={pool.status === "ACTIVE" && !dashboard}
        />
      </div>

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
