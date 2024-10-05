import { Copy, Link, MainLayout } from "@/components";
import { clientPoster } from "@/utils/api";
import { useEffect, useState } from "react";
import { RegisterApiResponse } from "./api/register";

export default function RegisterPage() {
  const [registeredWallet, setRegisteredWallet] =
    useState<RegisterApiResponse | null>();

  useEffect(() => {
    const registerWallet = async () => {
      const response = await clientPoster<RegisterApiResponse>("/api/register");

      if (response.response === 200) {
        const walletData = response.data;
        setRegisteredWallet(walletData);
      }
    };

    registerWallet();
  }, []);

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center flex-grow gap-8">
        <div className="flex flex-col text-lg gap-8 w-fit">
          <h6 className="text-center text-2xl font-bold">
            Wallet registered successfully
          </h6>

          <div className="whitespace-nowrap mt-4 flex items-center gap-1">
            <Copy value={registeredWallet?.address || ""} />
            <span className="font-bold">Address -</span>{" "}
            <span>{registeredWallet?.address}</span>{" "}
          </div>

          <div className="flex flex-col gap-4 whitespace-nowrap">
            <span className="font-bold flex items-center gap-1">
              <Copy value={registeredWallet?.phrase || ""} /> Seed Phrase -
            </span>
            <div className="grid grid-cols-3 items-center text-center gap-y-4">
              {registeredWallet?.phrase
                ?.split(" ")
                .map((word, key) => <span key={key}>{word}</span>)}
            </div>
          </div>
        </div>

        <div className="w-96 font-semibold">
          The above seed phrase would be shown just this once. Note the seed and
          the address down as it would be needed in sign in. To sign in,{" "}
          <Link className="underline underline-offset-4" href={"/signin"}>
            click here
          </Link>
          .
        </div>
      </div>
    </MainLayout>
  );
}
