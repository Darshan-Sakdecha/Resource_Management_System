import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// ✅ Create adapter
const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST!,
  user: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  port: Number(process.env.DB_PORT || 3306),
  connectionLimit: 10,
});

// ✅ Singleton Prisma instance
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development"
      ? ["query", "error"]
      : ["error"],
  });

// ✅ Prevent multiple instances in development (Hot Reload Fix)
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
