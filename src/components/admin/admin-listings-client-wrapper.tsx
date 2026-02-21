'use client';

import { AdminListingsTable } from '@/components/admin/AdminListingsTable';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';

interface AdminListingsClientWrapperProps {
  status: string;
  isPromoted: boolean;
  listingNumber?: number;
}

export function AdminListingsClientWrapper({ status, isPromoted, listingNumber }: AdminListingsClientWrapperProps) {
  const queryArgs = useMemo(() => {
    if (listingNumber !== undefined && !isNaN(listingNumber)) {
      return { listingNumber };
    }
    if (isPromoted) {
      return { isPromoted: true };
    }
    return { status };
  }, [listingNumber, isPromoted, status]);

  const listingsRaw = useQuery(api.admin.getListingsDetailed, queryArgs as any);

  if (listingsRaw === undefined) {
    return (
      <div className="flex flex-col h-[calc(100vh-220px)] items-center justify-center bg-card rounded-xl border border-border/50">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const serializedListings = (listingsRaw || []).map((l: any) => ({
      ...l,
      id: l._id,
  }));

  return (
    <AdminListingsTable listings={serializedListings} isPromotedView={isPromoted} />
  );
}
