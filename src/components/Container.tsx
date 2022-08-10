import React from "react";
import Navbar from "./Navbar";

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto py-12">{children}</div>
    </>
  );
};

export default Container;
