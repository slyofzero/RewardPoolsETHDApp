import "@/styles/globals.css";
import { clientFetcher } from "@/utils/api";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { UserData } from "./api/user";
import { useUser } from "@/state";

export default function App({ Component, pageProps }: AppProps) {
  const { setUser } = useUser();

  useEffect(() => {
    const getUser = async () => {
      const data = await clientFetcher<UserData>("/api/user");
      setUser(data.data.data?.address);
    };

    getUser();
  }, [setUser]);

  return <Component {...pageProps} />;
}
