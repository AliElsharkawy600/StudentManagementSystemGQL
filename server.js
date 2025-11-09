import dotenv from "dotenv";
import { ApolloServer } from "apollo-server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import resolvers from "./schema/resolvers.js";
import typeDefs from "./schema/typeDefs.js";
import User from "./models/user.js";

dotenv.config();

const PORT = parseInt(process.env.PORT ?? "3000", 10);
const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017/schoolGQL";
const JWT_SECRET = process.env.JWT_SECRET ?? "change-me";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const header = req.headers.authorization ?? "";
    const token = header.startsWith("Bearer ")
      ? header.slice("Bearer ".length).trim()
      : null;

    if (!token) {
      return { user: null };
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(payload.sub);
      return { user: user ? { id: user.id, email: user.email } : null };
    } catch (error) {
      return { user: null };
    }
  },
});

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
