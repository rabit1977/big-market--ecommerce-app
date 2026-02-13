import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

// Run daily refreshes for promoted listings at 13:00 MKD (12:00 UTC)
crons.daily(
  "daily-listing-refresh",
  { hourUTC: 12, minuteUTC: 0 },
  api.promotions.runDailyRefreshes
);

crons.daily(
  "daily-promotion-expiry-check",
  { hourUTC: 12, minuteUTC: 30 },
  api.promotions.checkExpiringPromotions
);

export default crons;
