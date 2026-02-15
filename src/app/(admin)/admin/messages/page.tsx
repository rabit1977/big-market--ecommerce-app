import { getAllQuestionsAction } from '@/actions/qa-actions';
import { AdminSupportChatClient } from '@/components/admin/admin-support-chat-client';
import { QuestionsClient } from '@/components/admin/questions-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, MessageSquare, ShieldAlert } from 'lucide-react';

export const metadata = {
  title: 'Messages & Support | Admin',
  description: 'Manage support inquiries and product Q&A',
};

interface AdminQuestionsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function AdminMessagesPage(props: AdminQuestionsPageProps) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || '';

  const { questions, total, pages } = await getAllQuestionsAction(page, 10, search);

  return (
    <div className='space-y-6 sm:space-y-8 pb-20'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <h1 className='text-xl sm:text-2xl lg:text-4xl font-black tracking-tight text-foreground flex items-center gap-2 sm:gap-3 flex-wrap'>
            <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            Messages & Support center
          </h1>
          <p className='text-xs sm:text-sm text-muted-foreground font-medium'>
            Manage direct user support chats and public product Q&A.
          </p>
        </div>
      </div>

      <Tabs defaultValue="support" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="support" className="gap-2">
            <ShieldAlert className="w-4 h-4" /> Support Chat
          </TabsTrigger>
          <TabsTrigger value="qa" className="gap-2">
            <MessageCircle className="w-4 h-4" /> Product Q&A
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
      </Tabs>
    </div>
  );
}
