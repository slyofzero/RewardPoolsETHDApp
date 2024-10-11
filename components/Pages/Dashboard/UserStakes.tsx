import { ShowWhen } from "@/components/Utils";
import { useApi } from "@/hooks";
import { PoolData } from "@/pages/api/pool/[id]";
import { StoredStakes } from "@/types";
import { classNames } from "@/utils";
import moment from "moment";

interface PoolProps {
  stake: StoredStakes;
}

export function Stake({ stake }: PoolProps) {
  const { data } = useApi<PoolData>(`/api/pool/${stake.pool}`);
  const pool = data?.pool;
  if (!pool) return <></>;

  const reward = parseFloat((stake.amount * (pool.reward / 100)).toFixed(6));
  const closesAtMilliSeconds =
    // @ts-ignore
    pool.closesAt._seconds * 1000 + pool.closesAt._nanoseconds / 1000000;
  const closesAt = moment(closesAtMilliSeconds).format("Do MMMM, YYYY");

  const stakedOnMilliseconds =
    // @ts-ignore
    stake.stakedOn._seconds * 1000 + stake.stakedOn._nanoseconds / 1000000;
  const stakedOn = moment(stakedOnMilliseconds).format("Do MMMM, YYYY");

  return (
    <>
      <div className="flex flex-col gap-4 p-4 rounded-md border-white border-[1px] border-solid">
        <div className="flex justify-between items-center">
          <h6 className="text-xl font-bold">{pool.name}</h6>

          <span
            className={classNames(
              "p-1 px-4 rounded-md text-black font-extrabold text-sm",
              stake.status === "PENDING" ? "bg-orange-500" : "bg-green-500"
            )}
          >
            {stake.status}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>
            <strong>Staked</strong> - {stake.amount}
          </span>
          <span>
            <strong>Reward</strong> - {reward}
          </span>
          <span>
            <strong>Total</strong> - {stake.amount + reward}
          </span>
        </div>

        <span>
          Closes at - <strong>{closesAt}</strong>
        </span>

        <span>
          Staked on - <strong>{stakedOn}</strong>
        </span>
      </div>
    </>
  );
}

interface Props {
  stakes: StoredStakes[] | undefined;
}

export function UserStakes({ stakes }: Props) {
  const userStakes = (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
      {stakes?.map((stake, key) => <Stake key={key} stake={stake} />)}
    </div>
  );

  const noUserStakes = (
    <div className="text-center text-lg font-bold">
      You have&apos;t created any staking yet.
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-3xl font-extrabold text-center md:text-left capitalize">
        Your Stakes in pools
      </h2>

      <ShowWhen
        component={userStakes}
        when={stakes && stakes.length > 0}
        otherwise={noUserStakes}
      />
    </div>
  );
}
