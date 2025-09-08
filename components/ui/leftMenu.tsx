import { ReactNode } from "react";

type LeftMenuProps = {
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
};

const LeftMenu = ({ title, description, children, className }: LeftMenuProps) => {
  return (
    <div
      className={`w-full min-h-fit md:w-[350px] md:min-w-[300px] lg:min-w-[350px] gap-0 bg-neutral-100 md:flex flex-col pb-2 md:pb-12 pt-6 md:pt-8 ${
        className || ""
      }`}
    >
      <div className="leading-none font-bold text-xl text-center mx-auto">{title}</div>
      <p className="text-secondary w-full text-sm text-center px-4 py-4">{description}</p>
      {children}
    </div>
  );
};

export default LeftMenu;
