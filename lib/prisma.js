import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient, Role } from "../generated/prisma/client.js";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma, Role };
