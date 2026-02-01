'use server';

import { auth } from '@/auth';
import { api, convex } from '@/lib/convex-server';
import { revalidatePath } from 'next/cache';

/**
 * Fetch questions for a listing
 */
export async function getProductQuestionsAction(listingId: string) {
  try {
    const questions = await convex.query(api.qa.getListingQuestions, { listingId: listingId as any });
    
    // Enrich with user data
    const enriched = await Promise.all(questions.map(async (q) => {
        const user = await convex.query(api.users.getByExternalId, { externalId: q.userId });
        
        const enrichedAnswers = await Promise.all((q.answers || []).map(async (a) => {
            const aUser = await convex.query(api.users.getByExternalId, { externalId: a.userId });
            return {
                ...a,
                id: a._id,
                user: {
                    name: aUser?.name || 'User',
                    image: aUser?.image || null,
                    role: aUser?.role || 'USER'
                }
            };
        }));

        return {
            ...q,
            id: q._id,
            user: {
                name: user?.name || 'User',
                image: user?.image || null,
            },
            answers: enrichedAnswers,
            _count: { answers: enrichedAnswers.length }
        };
    }));

    return { success: true, questions: enriched };
  } catch (error) {
    console.error('Error fetching questions:', error);
    return { success: false, questions: [] };
  }
}

/**
 * Post a new question
 */
export async function askQuestionAction(listingId: string, question: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'You must be logged in to ask a question.' };
  }

  if (!question.trim()) {
    return { success: false, message: 'Question cannot be empty.' };
  }

  try {
    await convex.mutation(api.qa.createQuestion, {
      listingId: listingId as any,
      userId: session.user.id,
      question: question.trim(),
    });

    revalidatePath(`/listings/${listingId}`);
    return { success: true, message: 'Question submitted successfully!' };
  } catch (error) {
    console.error('Error submitting question:', error);
    return { success: false, message: 'Failed to submit question.' };
  }
}

/**
 * Answer a question
 */
export async function answerQuestionAction(questionId: string, answer: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  if (!answer.trim()) {
    return { success: false, message: 'Answer cannot be empty.' };
  }

  try {
    const user = await convex.query(api.users.getByExternalId, { externalId: session.user.id });
    const isOfficial = user?.role === 'ADMIN';

    await convex.mutation(api.qa.createAnswer, {
      questionId: questionId as any,
      userId: session.user.id,
      answer: answer.trim(),
      isOfficial,
    });

    revalidatePath('/admin/messages'); // Admin questions page
    return { success: true, message: 'Answer submitted!' };
  } catch (error) {
    console.error('Error answering question:', error);
    return { success: false, message: 'Failed to submit answer.' };
  }
}

/**
 * Get all questions (admin only)
 */
export async function getAllQuestionsAction(page = 1, limit = 10, search = '') {
    try {
        const questions = await convex.query(api.qa.listAll, { limit: 50 });
        
        const enriched = await Promise.all(questions.map(async (q) => {
            const [user, listing] = await Promise.all([
                convex.query(api.users.getByExternalId, { externalId: q.userId }),
                convex.query(api.listings.getById, { id: q.listingId as any })
            ]);

            return {
                ...q,
                id: q._id,
                user: { name: user?.name, image: user?.image, email: user?.email },
                product: listing ? { id: listing._id, title: listing.title, thumbnail: listing.thumbnail } : null
            };
        }));

        return { 
            success: true, 
            questions: enriched, 
            total: enriched.length, 
            pages: 1 
        };
    } catch (error) {
        console.error('Admin Fetch Questions Error:', error);
        return { success: false, error: 'Failed to fetch questions' };
    }
}

export async function deleteQuestionAction(id: string) {
    try {
        await convex.mutation(api.qa.removeQuestion, { id: id as any });
        revalidatePath('/admin/messages');
        return { success: true, message: 'Question deleted' };
    } catch (error) {
        return { success: false, error: 'Failed to delete question' };
    }
}

export async function toggleQuestionVisibilityAction(id: string) {
    try {
        await convex.mutation(api.qa.toggleVisibility, { id: id as any });
        revalidatePath('/admin/messages');
        return { success: true, message: 'Visibility updated' };
    } catch (error) {
        return { success: false, error: 'Failed to update visibility' };
    }
}
