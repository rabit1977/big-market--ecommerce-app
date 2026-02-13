import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api, convex } from '@/lib/convex-server';
import { Headset, Mail, Phone, User } from 'lucide-react';

export const metadata = {
  title: 'Support Inquiries | Admin',
};

export default async function SupportPage() {
  const inquiries = await convex.query(api.contact.list, {});

  return (
    <div className='space-y-6 pb-20'>
      <div className='space-y-1'>
        <h1 className='text-3xl font-black tracking-tight'>Support Inquiries</h1>
        <p className='text-muted-foreground'>Messages from users regarding technical issues or services.</p>
      </div>

      {inquiries.length === 0 ? (
        <Card className="p-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <Headset className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold">No Inquiries Found</h3>
            <p className="text-sm text-muted-foreground">When users contact you via the support form, their messages will appear here.</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {inquiries.map((inquiry: any) => (
            <Card key={inquiry._id} className="border-border/50 hover:border-primary/20 transition-colors">
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={inquiry.status === 'NEW' ? 'default' : 'secondary'}>
                      {inquiry.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(inquiry.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <CardTitle className="text-lg pt-1">{inquiry.subject}</CardTitle>
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
        </div>
      )}
    </div>
  );
}
