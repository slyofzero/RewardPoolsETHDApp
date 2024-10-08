import "@/styles/globals.css";
import { clientFetcher } from "@/utils/api";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useUser } from "@/state";
import { SignedInUserData } from "./api/signedInUser";

export default function App({ Component, pageProps }: AppProps) {
  const { setUser } = useUser();

  useEffect(() => {
    const getUser = async () => {
      const data = await clientFetcher<SignedInUserData>("/api/signedInUser");
      setUser(data.data.address);
    };

    getUser();
  }, [setUser]);

  return <Component {...pageProps} />;
}
