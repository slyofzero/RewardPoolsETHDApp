import { Input } from "@/components/Common";
import { CreatePoolModal } from "@/components/Modals/CreatePoolModal";
import { SignInRequired } from "@/components/SignInRequired";
import { ShowWhen, Spinner } from "@/components/Utils";
import { CreatePoolResponse } from "@/pages/api/createPool";
import { useUser } from "@/state";
import { StoredPool } from "@/types";
import { clientPoster } from "@/utils/api";
import {
  isValidERC20Token,
  isValidNumber,
  isValidPercentage,
} from "@/utils/form-validation";
import { FormEvent, useState } from "react";

export interface CreatePoolData {
  name: string;
  token: string;
  size: number;
  pool: string;
  duration: number;
  maxClaim: number;
  minHolding: number;
  tokenSymbol: string;
  description: string;
  twitter: string;
  telegram: string;
  website: string;
  logo: string;
}

export function CreatePool() {
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [createPoolData, setCreatePoolData] = useState<StoredPool>();
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
    <div className="flex flex-col gap-16 items-center justify-center mt-8 md:mt-0 pb-16">
      <div className="flex flex-col items-center gap-8">
        <h3 className="text-2xl font-extrabold">Create Token Rewarding Pool</h3>
        <h3 className="md:w-1/2 text-center">
          To create a token rewarding pool, please fill the below form.
          You&apos;d need to deposit the rewarding rewards, as well as the ETH
          that would be used in gas while handing out rewards to the rewarding
          participants. Any excess rewards and ETH that are left after the
          rewards are handed out would be returned back to you.
        </h3>
      </div>

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-8 items-center justify-center [&>div>span]:font-bold"
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
          <span>Minimum Holding Percentage - </span>
          <Input
            name="minHolding"
            className="w-[12rem] md:w-[22rem]"
            required
            match={[isValidNumber, isValidPercentage]}
          />
        </div>

        <div className="flex gap-8 justify-between items-center w-full">
          <span>Max Claim Accountable Percentage - </span>
          <Input
            name="maxClaim"
            className="w-[12rem] md:w-[22rem]"
            required
            match={[isValidNumber, isValidPercentage]}
          />
        </div>

        <div className="flex gap-8 justify-between items-center w-full">
          <span>Claim Period (in days) - </span>
          <Input
            name="duration"
            className="w-[12rem] md:w-[22rem]"
            required
            match={[isValidNumber]}
          />
        </div>

        <div className="flex gap-8 justify-between items-center w-full">
          <span>Logo - </span>
          <Input name="logo" className="w-[12rem] md:w-[22rem]" required />
        </div>

        <div className="flex gap-8 justify-between items-center w-full">
          <span>Twitter - </span>
          <Input name="twitter" className="w-[12rem] md:w-[22rem]" />
        </div>

        <div className="flex gap-8 justify-between items-center w-full">
          <span>Telegram - </span>
          <Input name="telegram" className="w-[12rem] md:w-[22rem]" />
        </div>

        <div className="flex gap-8 justify-between items-center w-full">
          <span>Website - </span>
          <Input name="website" className="w-[12rem] md:w-[22rem]" />
        </div>

        <div className="flex gap-8 justify-between items-center w-full">
          <span>Description - </span>
          <textarea
            name="description"
            id="description"
            className="h-36 border-[1.5px] border-white bg-black rounded-md placeholder:text-white/75 flex p-2 outline-none w-[12rem] md:w-[22rem] resize-none"
          />
        </div>

        <button
          className="text-black bg-white rounded-md font-extrabold px-4 text-sm p-2 w-36"
          type="submit"
        >
          <ShowWhen
            component={<Spinner />}
            when={showSpinner}
            otherwise={<span>Create Pool</span>}
          />
        </button>
      </form>

      <ShowWhen
        component={
          <CreatePoolModal
            setShowModal={setShowModal}
            poolData={createPoolData as StoredPool}
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
