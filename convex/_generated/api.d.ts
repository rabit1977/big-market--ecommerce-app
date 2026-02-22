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
import type * as admin_utils from "../admin_utils.js";
import type * as analytics from "../analytics.js";
import type * as categories from "../categories.js";
import type * as contact from "../contact.js";
import type * as crons from "../crons.js";
import type * as favorites from "../favorites.js";
import type * as history from "../history.js";
import type * as inquiries from "../inquiries.js";
import type * as listingBumps from "../listingBumps.js";
import type * as listings from "../listings.js";
import type * as message_emails from "../message_emails.js";
import type * as messages from "../messages.js";
import type * as migrations from "../migrations.js";
import type * as notifications from "../notifications.js";
import type * as presence from "../presence.js";
import type * as promotionPackages from "../promotionPackages.js";
import type * as promotions from "../promotions.js";
import type * as qa from "../qa.js";
import type * as recycleBin from "../recycleBin.js";
import type * as reports from "../reports.js";
import type * as reset from "../reset.js";
import type * as reviews from "../reviews.js";
import type * as savedSearches from "../savedSearches.js";
import type * as searches from "../searches.js";
import type * as settings from "../settings.js";
import type * as sitemap from "../sitemap.js";
import type * as storefront from "../storefront.js";
import type * as stripeActions from "../stripeActions.js";
import type * as subscriptions from "../subscriptions.js";
import type * as transactions from "../transactions.js";
import type * as typing from "../typing.js";
import type * as users from "../users.js";
import type * as wallet from "../wallet.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  activityLogs: typeof activityLogs;
  admin: typeof admin;
  admin_utils: typeof admin_utils;
  analytics: typeof analytics;
  categories: typeof categories;
  contact: typeof contact;
  crons: typeof crons;
  favorites: typeof favorites;
  history: typeof history;
  inquiries: typeof inquiries;
  listingBumps: typeof listingBumps;
  listings: typeof listings;
  message_emails: typeof message_emails;
  messages: typeof messages;
  migrations: typeof migrations;
  notifications: typeof notifications;
  presence: typeof presence;
  promotionPackages: typeof promotionPackages;
  promotions: typeof promotions;
  qa: typeof qa;
  recycleBin: typeof recycleBin;
  reports: typeof reports;
  reset: typeof reset;
  reviews: typeof reviews;
  savedSearches: typeof savedSearches;
  searches: typeof searches;
  settings: typeof settings;
  sitemap: typeof sitemap;
  storefront: typeof storefront;
  stripeActions: typeof stripeActions;
  subscriptions: typeof subscriptions;
  transactions: typeof transactions;
  typing: typeof typing;
  users: typeof users;
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
