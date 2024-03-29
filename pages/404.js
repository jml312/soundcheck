import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Custom404() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    router.push(status === "unauthenticated" ? "/" : "/feed");
  }, []);

  return null;
}
