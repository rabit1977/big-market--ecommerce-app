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
import type * as admin from "../admin.js";
import type * as analytics from "../analytics.js";
import type * as categories from "../categories.js";
import type * as checkCategories from "../checkCategories.js";
import type * as checkCustomCategories from "../checkCustomCategories.js";
import type * as checkListings from "../checkListings.js";
import type * as checkTemplates from "../checkTemplates.js";
import type * as cleanup from "../cleanup.js";
import type * as cleanupFavorites from "../cleanupFavorites.js";
import type * as clearListings from "../clearListings.js";
import type * as clearSeedData from "../clearSeedData.js";
import type * as contact from "../contact.js";
import type * as crons from "../crons.js";
import type * as debug from "../debug.js";
import type * as favorites from "../favorites.js";
import type * as history from "../history.js";
import type * as listings from "../listings.js";
import type * as messages from "../messages.js";
import type * as notifications from "../notifications.js";
import type * as promotions from "../promotions.js";
import type * as qa from "../qa.js";
import type * as reviews from "../reviews.js";
import type * as searches from "../searches.js";
import type * as seed from "../seed.js";
import type * as seedAmazon from "../seedAmazon.js";
import type * as seedCustom from "../seedCustom.js";
import type * as seedEnhanced from "../seedEnhanced.js";
import type * as seedGoogle from "../seedGoogle.js";
import type * as seedHomeAndGarden from "../seedHomeAndGarden.js";
import type * as seedListings from "../seedListings.js";
import type * as seedMacedonian from "../seedMacedonian.js";
import type * as seedSelected from "../seedSelected.js";
import type * as settings from "../settings.js";
import type * as stripeActions from "../stripeActions.js";
import type * as transactions from "../transactions.js";
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
  admin: typeof admin;
  analytics: typeof analytics;
  categories: typeof categories;
  checkCategories: typeof checkCategories;
  checkCustomCategories: typeof checkCustomCategories;
  checkListings: typeof checkListings;
  checkTemplates: typeof checkTemplates;
  cleanup: typeof cleanup;
  cleanupFavorites: typeof cleanupFavorites;
  clearListings: typeof clearListings;
  clearSeedData: typeof clearSeedData;
  contact: typeof contact;
  crons: typeof crons;
  debug: typeof debug;
  favorites: typeof favorites;
  history: typeof history;
  listings: typeof listings;
  messages: typeof messages;
  notifications: typeof notifications;
  promotions: typeof promotions;
  qa: typeof qa;
  reviews: typeof reviews;
  searches: typeof searches;
  seed: typeof seed;
  seedAmazon: typeof seedAmazon;
  seedCustom: typeof seedCustom;
  seedEnhanced: typeof seedEnhanced;
  seedGoogle: typeof seedGoogle;
  seedHomeAndGarden: typeof seedHomeAndGarden;
  seedListings: typeof seedListings;
  seedMacedonian: typeof seedMacedonian;
  seedSelected: typeof seedSelected;
  settings: typeof settings;
  stripeActions: typeof stripeActions;
  transactions: typeof transactions;
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
