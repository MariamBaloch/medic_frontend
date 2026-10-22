import { QueryCache, QueryClient } from "@tanstack/react-query";
import { notifyApp } from "@services/api/appNotifications";
import { getApiErrorMessage } from "@services/api/errors";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      const notificationTitle = query.meta?.notificationTitle;
      const notificationKey = query.meta?.notificationKey;
      notifyApp({
        type: "error",
        message:
          typeof notificationTitle === "string" ? notificationTitle : "Request failed",
        description: getApiErrorMessage(error),
        key: typeof notificationKey === "string" ? notificationKey : query.queryHash,
      });
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
    mutations: { retry: 0 },
  },
});
