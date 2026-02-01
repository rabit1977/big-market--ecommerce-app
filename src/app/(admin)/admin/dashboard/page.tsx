import DashboardClient from '@/components/admin/DashboardClient';
import { api, convex } from '@/lib/convex-server';

export const metadata = {
  title: 'Admin Dashboard',
};

export default async function AdminDashboardPage() {
  const [listings, users] = await Promise.all([
    convex.query(api.listings.list, {}),
    convex.query(api.users.list, {})
  ]);

  const serializedListings = (listings || []).map(l => ({
      ...l,
      id: l._id,
      createdAt: new Date(l._creationTime).toISOString()
  }));

  const serializedUsers = (users || []).map(u => ({
      ...u,
      id: u._id,
      createdAt: new Date(u._creationTime).toISOString(),
      updatedAt: new Date(u._creationTime).toISOString(), // Convex documents don't have separate updatedAt by default
      name: u.name || "Unknown",
      email: u.email || "",
  }));

  return <DashboardClient listings={serializedListings as any} users={serializedUsers as any} />;
}