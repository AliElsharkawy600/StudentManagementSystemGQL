import dotenv from "dotenv";
import { ApolloServer } from "apollo-server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import resolvers from "./schema/resolvers.js";
import typeDefs from "./schema/typeDefs.js";
import User from "./models/user.js";

dotenv.config();

const PORT = parseInt(process.env.PORT);
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

const dropLegacyEmailNormalizedIndex = async () => {
  try {
    const collection = mongoose.connection.db?.collection("users");
    if (!collection) {
      return;
    }
    await collection.dropIndex("emailNormalized_1");
    console.info("Removed legacy emailNormalized index");
  } catch (error) {
    if (error?.code !== 27) {
      console.warn("Failed to drop legacy emailNormalized index", error);
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {

// console.log(req.headers.bearer);

const token =req.headers.bearer;

    if (!token) {
      return { user: null };
    }

    try {
      // console.log(process.env.JWT_SECRET);

      const payload = jwt.verify(token, JWT_SECRET);
      const userId = payload.sub ?? payload.id;
      if (!userId) {
        return { user: null };
      }
      const user = await User.findById(userId);
      return { user: user ? { id: user.id, email: user.email } : null };
    } catch (error) {
      return { user: null };
    }
  },
});

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    await dropLegacyEmailNormalizedIndex();
    server.listen({ port: PORT }).then(({ url }) => {
      console.log(`➡️➡️➡️➡️ Server ready at ${url}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  });
