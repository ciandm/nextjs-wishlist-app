import React from "react";
import { chakra } from "@chakra-ui/react";

export const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <chakra.div className="mx-auto flex min-h-screen flex-col bg-blue-50 p-4">
      {children}
    </chakra.div>
  );
};
