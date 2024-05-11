import React from "react";
import { cn } from "~~/utils/utils";

type Props = {
  onButtonClick: (index: number, href: string) => void;
  index: number;
  item: { title: string; src: JSX.Element; href: string };
  selected: number;
  open: boolean;
};

const SidebarTab = (props: Props) => {
  const { onButtonClick, index, item, selected, open } = props;
  return (
    <div
      tabIndex={0}
      onClick={() => onButtonClick(index, item.href)}
      onKeyDown={e => {
        if (e.key === "Enter") onButtonClick(index, item.href);
      }}
      role="button"
      className={cn(
        "mt-2 flex cursor-pointer items-center gap-x-4 whitespace-nowrap rounded-md p-2 pl-[5px] text-lg hover:bg-secondary transition-bg-color shadow-lg shadow-base-2 duration-300  text-base-content-4 ease-in-out",
        {
          "bg-secondary shadow-md shadow-red text-secondary-foreground": index === selected,
        },
      )}
    >
      <div>{item.src}</div>
      <h1 className={cn("origin-left duration-200 ease-in-out font-semibold ", { "scale-0": !open })}>{item.title}</h1>
    </div>
  );
};

export default SidebarTab;
