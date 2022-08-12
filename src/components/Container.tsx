import React from "react";
import BottomNav from "./BottomNav";
import Navbar from "./Navbar";

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <BottomNav />
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-32">{children}</div>
    </>
  );
};

export default Container;
