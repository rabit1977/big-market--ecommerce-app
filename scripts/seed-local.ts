import { ConvexHttpClient } from "convex/browser";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { api } from "../convex/_generated/api";

// Load .env.local manually
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  console.error("NEXT_PUBLIC_CONVEX_URL is not set");
  process.exit(1);
}

const client = new ConvexHttpClient(convexUrl);

async function main() {
  console.log("Seeding listings to", convexUrl);
  try {
    // @ts-ignore
    const result = await client.mutation(api.seedListings.seedListings);
    console.log("Seed result:", result);
    
    console.log("Checking listings...");
    // @ts-ignore
    const check = await client.query(api.checkListings.check);
    console.log("Check result:", check);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
