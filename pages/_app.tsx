import { createClient as createWSClient, Client as WSClient } from "graphql-ws";
import type { AppProps } from "next/app";
import "tailwindcss/tailwind.css";
import {
  createClient,
  defaultExchanges,
  Exchange,
  Provider,
  subscriptionExchange,
} from "urql";

import "../styles/globals.css";

let isServer = process.browser ? false : true;

let wsClient: WSClient | null = null;
let exchanges: Exchange[] = defaultExchanges;

if (!isServer) {
  wsClient = createWSClient({
    url: "ws://localhost:8000/graphql",
  });
  exchanges = [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: (operation) => ({
        subscribe: (sink) => ({
          unsubscribe: wsClient.subscribe(operation, sink),
        }),
      }),
    }),
  ];
}

const client = createClient({
  url: "http://localhost:3000/graphql",
  exchanges,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
