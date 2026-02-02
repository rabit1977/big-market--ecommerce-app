/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as activityLogs from "../activityLogs.js";
import type * as analytics from "../analytics.js";
import type * as categories from "../categories.js";
import type * as cleanup from "../cleanup.js";
import type * as debug from "../debug.js";
import type * as favorites from "../favorites.js";
import type * as history from "../history.js";
import type * as listings from "../listings.js";
import type * as messages from "../messages.js";
import type * as notifications from "../notifications.js";
import type * as qa from "../qa.js";
import type * as reviews from "../reviews.js";
import type * as searches from "../searches.js";
import type * as seed from "../seed.js";
import type * as seedEnhanced from "../seedEnhanced.js";
import type * as seedGoogle from "../seedGoogle.js";
import type * as seedMacedonian from "../seedMacedonian.js";
import type * as seedSelected from "../seedSelected.js";
import type * as settings from "../settings.js";
import type * as users from "../users.js";
import type * as verification from "../verification.js";
import type * as wallet from "../wallet.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  activityLogs: typeof activityLogs;
  analytics: typeof analytics;
  categories: typeof categories;
  cleanup: typeof cleanup;
  debug: typeof debug;
  favorites: typeof favorites;
  history: typeof history;
  listings: typeof listings;
  messages: typeof messages;
  notifications: typeof notifications;
  qa: typeof qa;
  reviews: typeof reviews;
  searches: typeof searches;
  seed: typeof seed;
  seedEnhanced: typeof seedEnhanced;
  seedGoogle: typeof seedGoogle;
  seedMacedonian: typeof seedMacedonian;
  seedSelected: typeof seedSelected;
  settings: typeof settings;
  users: typeof users;
  verification: typeof verification;
  wallet: typeof wallet;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
