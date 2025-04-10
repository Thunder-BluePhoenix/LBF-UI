import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className=" pl-4 md:pl-16 lg:pl-16 xl:pl-28 pt-16 bg-gray-50">
          {children}
        </div>
      </div>
    </>
  );
}
