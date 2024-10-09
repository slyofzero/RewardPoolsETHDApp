import { ReactNode } from "react";
import { Header } from "../Header";

interface Props {
  children: ReactNode;
}

export function MainLayout({ children }: Props) {
  return (
    <div className="flex flex-col bg-dark-1 h-screen gap-16 p-4">
      <Header />

      {children}
    </div>
  );
}
