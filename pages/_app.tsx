import type { AppProps } from "next/app";
import { cacheExchange, createClient, Provider } from "urql";
import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import { GetTasksDocument } from "../graphql";

const client = createClient({
  url: "http://localhost:3000/graphql",
});

cacheExchange({
  updates: {
    Mutation: {
      addTodo(result, _args, cache, _info) {
        cache.updateQuery({ query: GetTasksDocument }, (data) => {
          data.tasks.push(result.addTask);
          return data;
        });
      },
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
