'use client';

import { approveUserAction, deleteUserFromAdminAction, rejectUserAction } from '@/actions/user-actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Ban, CheckCircle, Clock, Edit, Eye, MoreHorizontal, Shield, Trash2, UserCog, User as UserIcon, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';
import { toast } from 'sonner';

interface UsersDataTableProps {
  users: User[];
}

const getStatusColor = (status?: string) => {
    switch (status) {
        case 'ACTIVE': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        case 'PENDING_APPROVAL': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        case 'SUSPENDED': return 'bg-red-500/10 text-red-500 border-red-500/20';
        case 'BANNED': return 'bg-destructive/10 text-destructive border-destructive/20';
        default: return 'bg-secondary text-secondary-foreground border-border';
    }
};

/**
 * Mobile-optimized Users Data Table
 * Displays users as cards on mobile for better touch interaction
 */
export function UsersDataTable({ users }: UsersDataTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handleDeleteClick = useCallback((user: User) => {
    setUserToDelete(user);
    setDeleteConfirmation('');
    setShowDeleteDialog(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!userToDelete) return;
    
    // extra safety check
    if (deleteConfirmation !== `Delete ${userToDelete.name || 'User'}`) return;

    startTransition(async () => {
      try {
        const result = await deleteUserFromAdminAction(userToDelete.id);

        if (result.success) {
          toast.success(result.message || `User "${userToDelete.name}" deleted successfully`);
          setShowDeleteDialog(false);
          setUserToDelete(null);
          setDeleteConfirmation('');
          router.refresh();
        } else {
          toast.error(result.error || 'Failed to delete user');
        }
      } catch (error) {
        console.error('Delete user error:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to delete user');
      }
    });
  }, [userToDelete, router, deleteConfirmation]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteDialog(false);
    setUserToDelete(null);
    setDeleteConfirmation('');
  }, []);

  if (users.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <UserIcon className='h-12 w-12 text-muted-foreground/30 mb-3' />
        <p className='text-muted-foreground font-medium'>No users found</p>
        <p className='text-sm text-muted-foreground/70'>Users will appear here when they register</p>
      </div>
    );
  }

  return (
    <>
      <div className='space-y-2 sm:space-y-3'>
        {users.map((user) => (
          <div
            key={user.id}
            className={cn(
              'group relative bg-card border border-border/50 rounded-xl',
              'p-3 sm:p-4',
              'hover:bg-muted/30 hover:border-primary/20 transition-all duration-200'
            )}
          >
            <div className='flex items-start gap-3'>
              {/* Avatar */}
              <div className='shrink-0'>
                {user.image ? (
                  <div className='relative h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden ring-2 ring-border'>
                    <Image 
                      src={user.image.startsWith('http') || user.image.startsWith('/') ? user.image : `/${user.image}`} 
                      alt={user.name || 'User'} 
                      fill
                      className='object-cover'
                    />
                  </div>
                ) : (
                  <div className='h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-border'>
                    <span className='text-sm sm:text-base font-bold text-primary'>
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className='flex-1 min-w-0 space-y-1'>
                {/* Name + Role */}
                <div className='flex items-center gap-2 flex-wrap'>
                  <Link 
                    href={`/admin/users/${user.id}`}
                    className='font-semibold text-sm sm:text-base text-foreground hover:text-primary transition-colors truncate'
                  >
                    {user.name || 'No name'}
                  </Link>
                  <Badge 
                    variant={user.role?.toLowerCase() === 'admin' ? 'destructive' : 'secondary'}
                    className='text-[9px] sm:text-[10px] px-1.5 py-0 h-5'
                  >
                    {user.role?.toLowerCase() === 'admin' ? (
                      <Shield className='h-2.5 w-2.5 mr-0.5' />
                    ) : (
                      <UserCog className='h-2.5 w-2.5 mr-0.5' />
                    )}
                    {(user.role || 'user').toUpperCase()}
                  </Badge>
                  
                  <Badge 
                        variant="outline" 
                        className={cn('text-[9px] sm:text-[10px] px-1.5 py-0 h-5 ml-2', getStatusColor(user.accountStatus || 'ACTIVE'))}
                    >
                        {user.accountStatus === 'PENDING_APPROVAL' && <Clock className="h-2.5 w-2.5 mr-0.5" />}
                        {user.accountStatus === 'ACTIVE' && <CheckCircle className="h-2.5 w-2.5 mr-0.5" />}
                        {(user.accountStatus === 'SUSPENDED' || user.accountStatus === 'BANNED') && <Ban className="h-2.5 w-2.5 mr-0.5" />}
                        {(user.accountStatus || 'ACTIVE').replace('_', ' ')}
                   </Badge>
                </div>

                {/* Email */}
                <p className='text-xs sm:text-sm text-muted-foreground truncate'>
                  {user.email}
                </p>

                {/* Date + Actions Row */}
                <div className='flex items-center justify-between gap-2 mt-2'>
                  <span className='text-[10px] sm:text-xs text-muted-foreground'>
                    Joined {user.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'N/A'
                    }
                  </span>

                  {/* Actions */}
                  <div className='flex items-center gap-1'>
                    <Button
                      variant='ghost'
                      size='sm'
                      asChild
                      className='h-8 w-8 p-0 rounded-lg'
                    >
                      <Link href={`/admin/users/${user.id}`}>
                        <Eye className='h-4 w-4' />
                        <span className='sr-only'>View user</span>
                      </Link>
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          aria-haspopup='true' 
                          size='sm' 
                          variant='ghost'
                          className='h-8 w-8 p-0 rounded-lg'
                        >
                          <MoreHorizontal className='h-4 w-4' />
                          <span className='sr-only'>Open menu for {user.name}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end' className='w-48'>
                        <DropdownMenuItem asChild>
                          <Link 
                            href={`/admin/users/${user.id}`}
                            className='cursor-pointer'
                          >
                            <Eye className='h-4 w-4 mr-2' />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link 
                            href={`/admin/users/${user.id}/edit`}
                            className='cursor-pointer'
                          >
                            <Edit className='h-4 w-4 mr-2' />
                            Edit User
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        
                        {user.accountStatus === 'PENDING_APPROVAL' && (
                            <>
                                <DropdownMenuItem
                                    className={cn(
                                        'cursor-pointer focus:text-emerald-500', 
                                        user.membershipStatus !== 'ACTIVE' ? 'opacity-50 cursor-not-allowed' : 'text-emerald-500'
                                    )}
                                    // Prevent action if not subscribed
                                    onSelect={(e) => {
                                        if (user.membershipStatus !== 'ACTIVE') {
                                            e.preventDefault();
                                            toast.error('User must have an active subscription to be approved.');
                                            return;
                                        }
                                        
                                        startTransition(async () => {
                                            const result = await approveUserAction(user.id);
                                            if (result.success) {
                                                toast.success('User approved');
                                                router.refresh();
                                            } else {
                                                toast.error(result.error);
                                            }
                                        });
                                    }}
                                >
                                    <CheckCircle className='h-4 w-4 mr-2' />
                                    Approve User
                                    {user.membershipStatus !== 'ACTIVE' && (
                                        <span className="ml-2 text-[10px] bg-red-100 text-red-800 px-1 rounded">
                                            No Sub
                                        </span>
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className='cursor-pointer text-destructive focus:text-destructive'
                                    onSelect={() => startTransition(async () => {
                                        const result = await rejectUserAction(user.id);
                                        if (result.success) {
                                            toast.success('User rejected/suspended');
                                            router.refresh();
                                        } else {
                                            toast.error(result.error);
                                        }
                                    })}
                                >
                                    <XCircle className='h-4 w-4 mr-2' />
                                    Reject User
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </>
                        )}
                        
                        {(user.accountStatus === 'ACTIVE' || !user.accountStatus) && (
                            <DropdownMenuItem
                                className='cursor-pointer text-orange-500 focus:text-orange-500'
                                onSelect={() => startTransition(async () => {
                                    const result = await rejectUserAction(user.id);
                                    if (result.success) {
                                        toast.success('User suspended');
                                        router.refresh();
                                    } else {
                                        toast.error(result.error);
                                    }
                                })}
                            >
                                <Ban className='h-4 w-4 mr-2' />
                                Suspend User
                            </DropdownMenuItem>
                        )}

                        {user.accountStatus === 'SUSPENDED' && (
                              <DropdownMenuItem
                                className='cursor-pointer text-emerald-500 focus:text-emerald-500'
                                onSelect={() => startTransition(async () => {
                                    const result = await approveUserAction(user.id);
                                    if (result.success) {
                                        toast.success('User reactivated');
                                        router.refresh();
                                    } else {
                                        toast.error(result.error);
                                    }
                                })}
                            >
                                <CheckCircle className='h-4 w-4 mr-2' />
                                Reactivate User
                            </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className='text-destructive focus:text-destructive cursor-pointer'
                          onSelect={() => handleDeleteClick(user)}
                        >
                          <Trash2 className='h-4 w-4 mr-2' />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className='max-w-[90vw] sm:max-w-lg rounded-2xl'>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account for
              {' '}
              <span className='font-semibold text-foreground'>
                {userToDelete?.name || 'this user'}
              </span>
              {' '}
              ({userToDelete?.email}) and remove all their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-2">
              <label htmlFor="confirm-delete" className="block text-sm font-medium text-foreground">
                  To confirm, type <span className="font-bold select-all">Delete {userToDelete?.name || 'User'}</span> below:
              </label>
              <input
                id="confirm-delete"
                type="text"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={`Delete ${userToDelete?.name || 'User'}`}
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                autoComplete="off"
              />
          </div>
          <AlertDialogFooter className='flex-col sm:flex-row gap-2'>
            <AlertDialogCancel 
              onClick={handleCancelDelete}
              disabled={isPending}
              className='w-full sm:w-auto'
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                if (deleteConfirmation !== `Delete ${userToDelete?.name || 'User'}`) {
                    e.preventDefault();
                    return;
                }
                handleConfirmDelete();
              }}
              disabled={isPending || deleteConfirmation !== `Delete ${userToDelete?.name || 'User'}`}
              className='w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {isPending ? (
                <>
                  <span className='animate-spin mr-2'>⏳</span>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className='h-4 w-4 mr-2' />
                  Delete User
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}