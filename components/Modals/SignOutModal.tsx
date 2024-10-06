import { Modal } from ".";
import { Dispatch, SetStateAction } from "react";
import { JWTKeyName } from "@/utils/constants";
import { useUser } from "@/state";

interface Props {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export function SignOutModal({ setShowModal }: Props) {
  const { setUser } = useUser();

  const signOut = () => {
    localStorage.removeItem(JWTKeyName);
    setUser("");
  };

  return (
    <Modal setShowModal={setShowModal}>
      <div className="flex-grow flex flex-col gap-2 items-center justify-center text-lg">
        <h6>Are you sure you want to sign out?</h6>

        <button
          onClick={signOut}
          className="text-black bg-red-500 rounded-md font-semibold px-4 text-sm p-2"
        >
          Sign Out
        </button>
      </div>
    </Modal>
  );
}
