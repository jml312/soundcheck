import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";

export default function Custom404() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    router.push(
      status === "unauthenticated"
        ? "/"
        : `/feed?date=${dayjs().format("YYYY-MM-DD")}`
    );
  }, []);

  return null;
}
