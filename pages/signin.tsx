import { Input, MainLayout, ShowWhen } from "@/components";
import { SignInModal } from "@/components/Modals";
import { isValidEthAddress } from "@/utils/form-validation";
import { FormEvent, useState } from "react";

interface SignInFormData {
  address: string;
}

export default function SignInPage() {
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const { address } = Object.fromEntries(
      new FormData(form).entries()
    ) as unknown as SignInFormData;

    setAddress(address);

    setShowModal(true);
  }

  return (
    <MainLayout>
      <div className="flex-grow flex flex-col gap-2 items-center justify-center text-lg">
        <h6>Please enter your wallet address</h6>

        <form
          onSubmit={onSubmit}
          className="flex flex-col md:flex-row gap-4 items-center mt-2"
        >
          <Input
            name="address"
            className="w-[21rem]"
            required
            match={[isValidEthAddress]}
          />

          <button className="text-black bg-white rounded-md font-semibold px-4 text-sm p-2">
            Sign In
          </button>
        </form>

        <ShowWhen
          component={
            <SignInModal setShowModal={setShowModal} address={address} />
          }
          when={showModal}
        />
      </div>
    </MainLayout>
  );
}
