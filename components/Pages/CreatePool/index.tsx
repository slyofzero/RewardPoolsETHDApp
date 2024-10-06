import { Input } from "@/components/Common";
import { CreatePoolModal } from "@/components/Modals/CreatePoolModal";
import { SignInRequired } from "@/components/SignInRequired";
import { ShowWhen } from "@/components/Utils";
import { CreatePoolResponse } from "@/pages/api/createPool";
import { useUser } from "@/state";
import { clientPoster } from "@/utils/api";
import { isValidERC20Token, isValidNumber } from "@/utils/form-validation";
import { FormEvent, useState } from "react";
import { FaSpinner } from "react-icons/fa6";

export interface CreatePoolData {
  name: string;
  token: string;
  size: number;
  reward: number;
  duration: number;
  pool: string;
  tokenSymbol: string;
}

export function CreatePool() {
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [createPoolData, setCreatePoolData] = useState<CreatePoolData>();
  const [showSpinner, setShowSpinner] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setShowSpinner(true);
    const form = e.currentTarget;
    const data = Object.fromEntries(
      new FormData(form).entries()
    ) as unknown as CreatePoolData;

    const pool = await clientPoster<CreatePoolResponse>(
      "/api/createPool",
      data
    );

    if (pool.response === 200) {
      setCreatePoolData(pool.data.data);
      setShowModal(true);
    }

    setShowSpinner(false);
  }

  const createPool = (
    <div className="flex flex-col gap-16 items-center justify-center mt-8 md:mt-0">
      <div className="flex flex-col items-center gap-8">
        <h3 className="text-2xl font-bold">Create Token Staking Pool</h3>
        <h3 className="md:w-1/2">
          To create a token staking pool, please fill the below form. You&apos;d
          need to deposit the staking rewards, as well as the ETH that would be
          used in gas while handing out rewards to the staking participants. Any
          excess rewards and ETH that are left after the rewards are handed out
          would be returned back to you.
        </h3>
      </div>

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-8 items-center justify-center"
      >
        <div className="flex gap-8 justify-between items-center w-full">
          <span>Pool Name - </span>
          <Input name="name" className="w-[12rem] md:w-[22rem]" required />
        </div>

        <div className="flex gap-8 justify-between items-center w-full">
          <span>Token Address - </span>
          <Input
            name="token"
            className="w-[12rem] md:w-[22rem]"
            required
            match={[isValidERC20Token]}
            showErrorText
          />
        </div>

        <div className="flex gap-8 justify-between items-center w-full">
          <span>Pool Size - </span>
          <Input
            name="size"
            className="w-[12rem] md:w-[22rem]"
            required
            match={[isValidNumber]}
          />
        </div>

        <div className="flex gap-8 justify-between items-center w-full">
          <span>Staking Reward Percentage - </span>
          <Input
            name="reward"
            className="w-[12rem] md:w-[22rem]"
            required
            match={[isValidNumber]}
          />
        </div>

        <div className="flex gap-8 justify-between items-center w-full">
          <span>Staking Period (in days) - </span>
          <Input
            name="duration"
            className="w-[12rem] md:w-[22rem]"
            required
            match={[isValidNumber]}
          />
        </div>

        <button
          className="text-black bg-white rounded-md font-semibold px-4 text-sm p-2 w-36"
          type="submit"
        >
          <ShowWhen
            component={
              <FaSpinner className="animate-spin duration-500 mx-auto" />
            }
            when={showSpinner}
            otherwise={<span>Create Pool</span>}
          />
        </button>
      </form>

      <ShowWhen
        component={
          <CreatePoolModal
            setShowModal={setShowModal}
            poolData={createPoolData as CreatePoolData}
          />
        }
        when={showModal}
      />
    </div>
  );

  return (
    <ShowWhen
      component={createPool}
      when={user}
      otherwise={<SignInRequired />}
    />
  );
}
