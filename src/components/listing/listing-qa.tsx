'use client';

import { answerQuestionAction, askQuestionAction } from '@/actions/qa-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { CornerDownRight, MessageSquare, ShieldCheck, User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function ListingQA({ listingId, sellerId, initialQuestions = [] }: { listingId: string; sellerId: string, initialQuestions?: any[] }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [questions, setQuestions] = useState(initialQuestions);
  const [newQuestion, setNewQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for replying to a question
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const isOwner = session?.user?.id === sellerId;
  const isAdmin = session?.user?.role === 'ADMIN';

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !session?.user) return;

    setIsSubmitting(true);
    try {
      const res = await askQuestionAction(listingId, newQuestion);
      if (res.success) {
        toast.success(res.message);
        setNewQuestion('');
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      toast.error('Failed to submit question.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (questionId: string) => {
    if (!replyText.trim() || !session?.user) return;

    setIsSubmitting(true);
    try {
      const res = await answerQuestionAction(questionId, replyText);
      if (res.success) {
        toast.success(res.message);
        setReplyText('');
        setReplyingTo(null);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      toast.error('Failed to submit answer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pt-6 mt-8 border-t">
       <div className="flex items-center gap-2 mb-6">
         <MessageSquare className="w-5 h-5 text-primary" />
         <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight">Questions & Answers</h2>
         <span className="bg-primary/10 text-primary font-black text-xs px-2.5 py-0.5 rounded-full ml-auto">{questions.length}</span>
       </div>

       {/* Form for asking a question */}
       {!isOwner ? (
         <div className="bg-muted/50 p-4 md:p-6 rounded-2xl border mb-8">
           <h3 className="font-bold mb-3 text-sm">Ask the seller a question</h3>
           {session?.user ? (
             <form onSubmit={handleAskQuestion} className="space-y-3">
               <Textarea
                 placeholder="What are the exact dimensions? Is the price negotiable?"
                 value={newQuestion}
                 onChange={(e) => setNewQuestion(e.target.value)}
                 className="bg-background resize-none"
                 rows={3}
                 maxLength={500}
               />
               <div className="flex justify-between items-center">
                 <p className="text-xs text-muted-foreground">{newQuestion.length}/500</p>
                 <Button type="submit" disabled={isSubmitting || newQuestion.length < 5}>
                    Ask Question
                 </Button>
               </div>
             </form>
           ) : (
             <div className="text-sm text-muted-foreground bg-background p-4 rounded-xl text-center border">
               Please <a href="/login" className="text-primary font-bold hover:underline">log in</a> to ask questions.
             </div>
           )}
         </div>
       ) : (
          <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 mb-8 text-sm font-medium text-center">
             You are the owner of this listing. You can answer questions below.
          </div>
       )}

       {/* Q&A List */}
       <div className="space-y-6">
         {questions.length > 0 ? (
           questions.map((q) => (
             <div key={q.id || q._id} className="p-4 md:p-5 rounded-2xl border bg-card/50 shadow-sm flex flex-col gap-3">
               {/* Question */}
               <div className="flex gap-3">
                 <Avatar className="h-8 w-8 border border-border mt-1 shrink-0">
                    <AvatarImage src={q.user?.image || ''} alt={q.user?.name || 'User'} />
                    <AvatarFallback className="bg-muted text-xs font-bold text-muted-foreground"><User className="w-4 h-4" /></AvatarFallback>
                 </Avatar>
                 <div className="space-y-1 w-full">
                    <div className="flex justify-between items-center">
                       <p className="text-sm font-bold">{q.user?.name || 'User'}</p>
                       <span className="text-xs text-muted-foreground">{formatDistanceToNow(q.createdAt, { addSuffix: true })}</span>
                    </div>
                    <p className="text-sm font-medium">{q.question}</p>
                 </div>
               </div>

               {/* Answers list */}
               {q.answers && q.answers.length > 0 && (
                 <div className="ml-4 md:ml-12 space-y-3 mt-2 border-l-2 border-primary/20 pl-4">
                   {q.answers.map((a: any) => (
                     <div key={a.id || a._id} className="flex gap-3 relative">
                       <CornerDownRight className="w-4 h-4 text-muted-foreground absolute -left-6 top-1.5 opacity-50" />
                       <div className="flex-1 bg-background p-3 rounded-xl border shadow-sm">
                         <div className="flex justify-between items-center mb-1">
                           <div className="flex items-center gap-1.5">
                             <p className="text-sm font-bold">{a.user?.name || 'User'}</p>
                             {(a.isOfficial || a.userId === sellerId) && (
                               <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                             )}
                             {(a.isOfficial || a.userId === sellerId) && (
                                <span className="bg-primary/10 text-primary text-[10px] uppercase font-black px-1.5 py-0.5 rounded-sm">Seller</span>
                             )}
                           </div>
                           <span className="text-xs text-muted-foreground">{formatDistanceToNow(a.createdAt, { addSuffix: true })}</span>
                         </div>
                         <p className="text-sm text-foreground">{a.answer}</p>
                       </div>
                     </div>
                   ))}
                 </div>
               )}

               {/* Reply Button for Owners/Admins */}
               {(isOwner || isAdmin) && replyingTo !== (q.id || q._id) && (
                 <div className="ml-4 md:ml-12 mt-1">
                   <Button variant="ghost" size="sm" className="h-8 text-xs font-bold" onClick={() => setReplyingTo(q.id || q._id)}>
                     Reply
                   </Button>
                 </div>
               )}

               {/* Reply Box */}
               {replyingTo === (q.id || q._id) && (
                 <div className="ml-4 md:ml-12 mt-2 bg-background p-3 rounded-xl border flex flex-col gap-2">
                   <Textarea
                     placeholder="Type your official answer here..."
                     value={replyText}
                     onChange={(e) => setReplyText(e.target.value)}
                     className="resize-none min-h-[80px]"
                   />
                   <div className="flex justify-end gap-2">
                     <Button variant="ghost" size="sm" onClick={() => { setReplyingTo(null); setReplyText(''); }}>Cancel</Button>
                     <Button size="sm" onClick={() => handleReplySubmit(q.id || q._id)} disabled={isSubmitting || !replyText.trim()}>Submit Answer</Button>
                   </div>
                 </div>
               )}
             </div>
           ))
         ) : (
           <div className="text-center py-10 bg-muted/30 rounded-2xl border border-dashed text-muted-foreground">
             <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
             <p className="text-sm font-medium">No questions asked yet.</p>
             {!isOwner && <p className="text-xs mt-1">Be the first to ask the seller a question!</p>}
           </div>
         )}
       </div>
    </div>
  );
}
