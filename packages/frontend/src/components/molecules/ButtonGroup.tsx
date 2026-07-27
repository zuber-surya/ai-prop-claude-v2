import React from "react";
import Button from "../atoms/Button";

const ButtonGroup = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-wrap -mx-1">
      <div className="mx-1">{children}</div>
    </div>
  );
};

export default ButtonGroup;