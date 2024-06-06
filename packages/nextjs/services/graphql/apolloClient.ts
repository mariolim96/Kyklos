import { ApolloClient, InMemoryCache } from "@apollo/client";

// Assuming you have a config file with environment variables
const subgraphUri = process.env.GRAPHQL_URI || "http://localhost:8000/subgraphs/name/kyklos";

export const apolloClient = new ApolloClient({
    uri: subgraphUri,
    cache: new InMemoryCache(),
});
