import { getAllQuestionsAction } from '@/actions/qa-actions';
import { AdminReportsClient } from '@/components/admin/admin-reports-client';
import { AdminSupportChatClient } from '@/components/admin/admin-support-chat-client';
import { ContactInquiriesClient } from '@/components/admin/contact-inquiries-client';
import { QuestionsClient } from '@/components/admin/questions-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flag, Headset, MessageCircle, MessageSquare, ShieldAlert } from 'lucide-react';

export const metadata = {
  title: 'Communications | Admin',
  description: 'Manage support inquiries, product Q&A, and contact forms',
};

interface AdminMessagesPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

export default async function AdminMessagesPage(props: AdminMessagesPageProps) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || '';
  const startDate = searchParams.startDate ? Number(searchParams.startDate) : undefined;
  const endDate = searchParams.endDate ? Number(searchParams.endDate) : undefined;

  const { questions, total, pages } = await getAllQuestionsAction(page, 10, search, startDate, endDate);

  return (
    <div className='space-y-6 sm:space-y-8 pb-20'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <h1 className='text-xl sm:text-2xl lg:text-4xl font-black tracking-tight text-foreground flex items-center gap-2 sm:gap-3 flex-wrap'>
            <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            Communications Center
          </h1>
          <p className='text-xs sm:text-sm text-muted-foreground font-medium'>
            Manage direct user chats, Q&A, and contact forms in one place.
          </p>
        </div>
      </div>

      <Tabs defaultValue="support" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-[800px]">
          <TabsTrigger value="support" className="gap-2 text-xs sm:text-sm">
            <ShieldAlert className="w-4 h-4 hidden sm:block" /> Live Chat
          </TabsTrigger>
          <TabsTrigger value="qa" className="gap-2 text-xs sm:text-sm">
            <MessageCircle className="w-4 h-4 hidden sm:block" /> Product Q&A
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-2 text-xs sm:text-sm">
            <Headset className="w-4 h-4 hidden sm:block" /> Contact Forms
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2 text-xs sm:text-sm">
            <Flag className="w-4 h-4 hidden sm:block" /> User Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="support" className="space-y-4">
            <div className="rounded-xl border bg-card p-4 md:p-6 shadow-sm">
                <div className="mb-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-primary" />
                        Live Support
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Chat directly with users who have requested support.
                    </p>
                </div>
                <AdminSupportChatClient />
            </div>
        </TabsContent>

        <TabsContent value="qa" className="space-y-4">
            <div className="rounded-xl border bg-card p-4 md:p-6 shadow-sm">
                 <div className="mb-4 flex items-center gap-2">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-primary" />
                        Product Questions
                        <span className='inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-inset ring-primary/20'>
                            {total || 0}
                        </span>
                    </h2>
                 </div>
                 <QuestionsClient 
                    questions={questions || []} 
                    total={total || 0} 
                    pages={pages || 1} 
                />
            </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
           <div className="rounded-xl border bg-card p-4 md:p-6 shadow-sm">
                <div className="mb-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Headset className="w-5 h-5 text-primary" />
                        Contact Form Inquiries
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Messages sent via the public contact us form. Data updates in real-time.
                    </p>
                </div>
                <ContactInquiriesClient />
           </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
           <div className="rounded-xl border bg-card p-4 md:p-6 shadow-sm">
                <div className="mb-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Flag className="w-5 h-5 text-primary" />
                        Moderation Queue (User Reports)
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Review suspicious listings, scams, and policy violations flagged by users.
                    </p>
                </div>
                <AdminReportsClient />
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
