import dotenv from "dotenv";
import { ApolloServer } from "apollo-server";
import mongoose from "mongoose";

import resolvers from "./schema/resolvers.js";
import typeDefs from "./schema/typeDefs.js";

dotenv.config();

const PORT = Number.parseInt(process.env.PORT ?? "3000", 10);
const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017/schoolGQL";

const server = new ApolloServer({ typeDefs, resolvers });

mongoose
  .connect(MONGO_URI)
  .then(() => {
    server.listen({ port: PORT }).then(({ url }) => {
      console.log(`➡️➡️➡️➡️ Server ready at ${url}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  });
