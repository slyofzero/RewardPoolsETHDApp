import React from "react";
import * as Popover from "@radix-ui/react-popover";

interface Props {
  children: React.ReactNode;
  text: string;
}

export function PopOver({ children, text }: Props) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>{children}</Popover.Trigger>

      <Popover.Portal>
        <Popover.Content>
          <span className="bg-white/80 rounded-md font-bold text-black py-2 px-8">
            {text}
          </span>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
