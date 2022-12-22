import React, { FC } from "react";

interface IfProps {
  condition: boolean | number;
  children?: React.ReactNode;
}

const If: FC<IfProps> = ({ condition, children }) => {
  if (!condition) return null;
  return <>{children}</>;
};

export default If;
