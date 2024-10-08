import { ReactNode } from "react";
import { Header } from "../Header";

interface Props {
  children: ReactNode;
}

export function MainLayout({ children }: Props) {
  return (
    <div className="flex flex-col bg-dark-1 h-screen p-4 gap-16">
      <Header />

      {children}
    </div>
  );
}
