import { useState } from "react";
import { buttonCva } from "./Common/Button";
import { ShowWhen } from "./Utils";
import { SignInModal, SignOutModal } from "./Modals";
import { useUser } from "@/state";
import { shortenEthAddress } from "@/utils/web3";
import { IoMdExit } from "react-icons/io";
import { classNames } from "@/utils";

export function Header() {
  const [showSigninModal, setShowSigninModal] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const { user } = useUser();

  const signInButton = (
    <div className="flex gap-4">
      <button
        onClick={() => setShowSigninModal(true)}
        className={buttonCva({ type: "light" })}
      >
        Sign In
      </button>
    </div>
  );

  const signOutButton = (
    <div className="flex gap-4">
      <button
        onClick={() => setShowSignOutModal(true)}
        className={classNames(
          buttonCva({ type: "dark" }),
          "flex gap-2 items-center"
        )}
      >
        {shortenEthAddress(user || "", 5)} <IoMdExit className="text-red-500" />
      </button>
    </div>
  );

  return (
    <>
      <header className="flex justify-between items-center">
        <h1></h1>

        <ShowWhen
          component={signInButton}
          otherwise={signOutButton}
          when={!user}
        />
      </header>

      <ShowWhen
        component={<SignInModal setShowModal={setShowSigninModal} />}
        when={showSigninModal}
      />

      <ShowWhen
        component={<SignOutModal setShowModal={setShowSignOutModal} />}
        when={showSignOutModal}
      />
    </>
  );
}
