import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient, Role } from "../generated/prisma/client.js";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter =
  process.env.NODE_ENV === "PROD"
    ? new PrismaNeon({ connectionString })
    : new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma, Role };
