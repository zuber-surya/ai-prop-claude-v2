import "dotenv/config";
import { defineConfig } from "prisma/config";

console.log("DATABASE_URL from process.env:", process.env.DATABASE_URL);

const config = defineConfig({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

console.log("Config created successfully");