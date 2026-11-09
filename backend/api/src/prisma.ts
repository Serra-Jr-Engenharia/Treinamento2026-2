import { PrismaClient } from "./generated/prisma/client.ts";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(
  process.env["DATABASE_URL"] ?? "" /*{
  host: "localhost",
  port: 3306,
  user: process.env["DB_USER"] ?? "",
  password: process.env["DB_PASSWORD"] ?? "",
  database: "sala",
  connectionLimit: 10,
  connectTimeout: 1000,
}*/,
);

export default new PrismaClient({ adapter });
