'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation, usePaginatedQuery } from 'convex/react';
import { CheckCircle2, Headset, Loader2, Mail, Phone, Trash2, User } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function ContactInquiriesClient() {
  const [activeTab, setActiveTab] = useState<'new' | 'resolved'>('new');
  
  const { results: newInquiries, status: newStatus, loadMore: loadMoreNew } = usePaginatedQuery(
    api.contact.list,
    {},
    { initialNumItems: 10 }
  );

  const { results: resolvedInquiries, status: resolvedStatus, loadMore: loadMoreResolved } = usePaginatedQuery(
    api.contact.getResolved,
    {},
    { initialNumItems: 10 }
  );

  const resolveMutation = useMutation(api.contact.resolve);
  const removeMutation = useMutation(api.contact.remove);
  const [actionId, setActionId] = useState<string | null>(null);

  const handleResolve = async (id: Id<"contactSubmissions">) => {
    setActionId(id);
    try {
      await resolveMutation({ id });
      toast.success('Inquiry marked as resolved');
    } catch (error) {
      toast.error('Failed to resolve inquiry');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: Id<"contactSubmissions">) => {
    if (!confirm("Are you sure you want to permanently delete this inquiry?")) return;
    setActionId(id);
    try {
      await removeMutation({ id });
      toast.success('Inquiry deleted');
    } catch (error) {
      toast.error('Failed to delete inquiry');
    } finally {
      setActionId(null);
    }
  };

  const currentResults = activeTab === 'new' ? newInquiries : resolvedInquiries;
  const currentStatus = activeTab === 'new' ? newStatus : resolvedStatus;
  const currentLoadMore = activeTab === 'new' ? loadMoreNew : loadMoreResolved;

  return (
    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-4">
      <TabsList className="grid w-full max-w-[400px] grid-cols-2">
        <TabsTrigger value="new">New Inquiries</TabsTrigger>
        <TabsTrigger value="resolved">Resolved</TabsTrigger>
      </TabsList>
      
      <TabsContent value={activeTab} className="space-y-4">
        {currentStatus === "LoadingFirstPage" ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : currentResults.length === 0 ? (
          <Card className="p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Headset className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold">No Inquiries Found</h3>
              <p className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {activeTab === 'new' ? "You're all caught up! No new messages." : "No resolved messages yet."}
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {currentResults.map((inquiry: any) => (
              <Card key={inquiry._id} className="border-border/50 hover:border-primary/20 transition-colors">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={inquiry.status === 'NEW' ? 'default' : 'secondary'}>
                        {inquiry.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(inquiry.createdAt || inquiry._creationTime).toLocaleString()}
                      </span>
                    </div>
                    <CardTitle className="text-lg pt-1">{inquiry.subject}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {inquiry.status === 'NEW' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleResolve(inquiry._id)}
                        disabled={actionId === inquiry._id}
                        className="text-xs h-8"
                      >
                        {actionId === inquiry._id ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <CheckCircle2 className="h-3 w-3 mr-1" />}
                        Resolve
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(inquiry._id)}
                      disabled={actionId === inquiry._id}
                      className="text-xs h-8 text-destructive hover:bg-destructive/10"
                    >
                      {actionId === inquiry._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg border border-border/40">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4 border-t border-border pt-4">
                      <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{inquiry.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a href={`mailto:${inquiry.email}`} className="text-primary hover:underline">{inquiry.email}</a>
                      </div>
                      {inquiry.phone && (
                          <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{inquiry.phone}</span>
                          </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {currentStatus === "CanLoadMore" && (
               <Button 
                  variant="outline" 
                  onClick={() => currentLoadMore(10)}
                  className="w-full mt-2"
               >
                 Load More
               </Button>
            )}
            {currentStatus === "LoadingMore" && (
               <div className="flex justify-center p-4">
                 <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
               </div>
            )}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
