import NextLink from "next/link";
import { LinkProps } from "./types";
import { useRouter } from "next/router";
import { classNames } from "@/utils";

export function Link({
  children,
  href,
  className,
  showIsOnPage,
  ...props
}: LinkProps) {
  const { pathname } = useRouter();
  const isOnPage = pathname === href;
  showIsOnPage ??= true;

  return (
    <NextLink
      className={classNames(
        className || "",
        isOnPage && showIsOnPage ? "text-cyan-400 font-bold underline" : ""
      )}
      href={href}
      {...props}
    >
      {children}
    </NextLink>
  );
}
