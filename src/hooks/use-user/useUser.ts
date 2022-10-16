import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export const useUser = () => {
  const { data: sessionData, status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated") {
    router.push("/login");
  }

  return { user: sessionData?.user };
};
