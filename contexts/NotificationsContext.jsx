import { createContext, useContext, useState } from "react";
import { useQuery } from "react-query";
import { getNotifications } from "@/actions";

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children, status, session }) {
  const [notifications, setNotifications] = useState([]);
  useQuery({
    queryKey: "notifications",
    queryFn: () =>
      getNotifications({
        userId: session?.user?.id,
      }),
    enabled: status === "authenticated",
    onSuccess: setNotifications,
  });
  return (
    <NotificationsContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
