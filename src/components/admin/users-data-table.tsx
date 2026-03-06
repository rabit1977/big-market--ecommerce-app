'use client';

import {
  approveUserAction,
  deleteUserFromAdminAction,
  rejectUserAction,
  updateUserRoleAction,
} from '@/actions/user-actions';
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
import {
  Ban,
  CheckCircle,
  Clock,
  Edit,
  MoreHorizontal,
  Shield,
  ShieldOff,
  Trash2,
  UserCog,
  User as UserIcon,
  XCircle,
} from 'lucide-react';
import { useLocale } from 'next-intl';
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
    case 'ACTIVE':
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    case 'PENDING_APPROVAL':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    case 'SUSPENDED':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'BANNED':
      return 'bg-destructive/10 text-destructive border-destructive/20';
    default:
      return 'bg-secondary text-secondary-foreground border-border';
  }
};

/**
 * Mobile-optimized Users Data Table
 * Displays users as cards on mobile for better touch interaction
 */
export function UsersDataTable({ users }: UsersDataTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const isMk = locale === 'mk';

  // ── Delete dialog state ───────────────────────────────────────────
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  // ── Promote/Revoke dialog state ───────────────────────────────────
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [userForRole, setUserForRole] = useState<User | null>(null);
  const [roleAction, setRoleAction] = useState<'promote' | 'revoke'>('promote');
  const [roleConfirmation, setRoleConfirmation] = useState('');

  const handleRoleClick = useCallback(
    (user: User, action: 'promote' | 'revoke') => {
      setUserForRole(user);
      setRoleAction(action);
      setRoleConfirmation('');
      setShowRoleDialog(true);
    },
    [],
  );

  const handleConfirmRole = useCallback(async () => {
    if (!userForRole) return;
    const expectedText = `${roleAction === 'promote' ? 'Promote' : 'Revoke'} ${userForRole.name || 'User'}`;
    if (roleConfirmation !== expectedText) return;

    startTransition(async () => {
      try {
        const newRole = roleAction === 'promote' ? 'ADMIN' : 'USER';
        const result = await updateUserRoleAction(userForRole.id, newRole);
        if (result.success) {
          toast.success(
            roleAction === 'promote'
              ? isMk
                ? 'Корисникот е унапреден во Модератор'
                : 'User promoted to Moderator'
              : isMk
                ? 'Администраторскиот пристап е одземен'
                : 'Administrator access revoked',
          );
          setShowRoleDialog(false);
          setUserForRole(null);
          router.refresh();
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error(
          isMk ? 'Се случи неочекувана грешка' : 'An unexpected error occurred',
        );
      }
    });
  }, [userForRole, roleAction, roleConfirmation, router]);

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
          toast.success(
            result.message ||
              (isMk
                ? `Корисникот "${userToDelete.name}" е успешно избришан`
                : `User "${userToDelete.name}" deleted successfully`),
          );
          setShowDeleteDialog(false);
          setUserToDelete(null);
          setDeleteConfirmation('');
          router.refresh();
        } else {
          toast.error(
            result.error ||
              (isMk ? 'Бришењето не успеа' : 'Failed to delete user'),
          );
        }
      } catch (error) {
        console.error('Delete user error:', error);
        toast.error(
          error instanceof Error
            ? error.message
            : isMk
              ? 'Бришењето не успеа'
              : 'Failed to delete user',
        );
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
        <p className='text-muted-foreground font-medium'>
          {isMk ? 'Нема пронајдени корисници' : 'No users found'}
        </p>
        <p className='text-sm text-muted-foreground/70'>
          {isMk
            ? 'Корисниците ќе се појават тука кога ќе се регистрираат'
            : 'Users will appear here when they register'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className='divide-y divide-border/40'>
        {users.map((user) => (
          <div
            key={user.id}
            className='group relative flex items-center justify-between gap-3 p-3 sm:p-4 hover:bg-muted/30 transition-colors bm-interactive'
          >
            <div className='flex items-center gap-3 min-w-0 flex-1'>
              {/* Avatar */}
              <div className='shrink-0'>
                {user.image ? (
                  <div className='relative h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden ring-1 ring-border shadow-sm'>
                    <Image
                      src={
                        user.image.startsWith('http') ||
                        user.image.startsWith('/')
                          ? user.image
                          : `/${user.image}`
                      }
                      alt={user.name || 'User'}
                      fill
                      className='object-cover'
                    />
                  </div>
                ) : (
                  <div className='h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center ring-1 ring-border shadow-sm'>
                    <span className='text-xs sm:text-sm font-black text-primary'>
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className='flex flex-col min-w-0 flex-1 grid'>
                <div className='flex items-center gap-2 flex-wrap'>
                  <Link
                    href={`/admin/users/${user.id}`}
                    className='font-bold text-xs sm:text-sm text-foreground hover:text-primary transition-colors truncate max-w-[120px] sm:max-w-[200px]'
                  >
                    {user.name || (isMk ? 'Нема име' : 'No name')}
                  </Link>
                  <Badge
                    variant={
                      user.role?.toLowerCase() === 'admin'
                        ? 'default'
                        : 'secondary'
                    }
                    className='text-[8px] sm:text-[9px] px-1.5 h-4 sm:h-4.5 rounded uppercase tracking-wider font-black'
                  >
                    {user.role?.toLowerCase() === 'admin' ? (
                      <Shield className='h-2 w-2 mr-0.5' />
                    ) : (
                      <UserCog className='h-2 w-2 mr-0.5' />
                    )}
                    {isMk
                      ? user.role === 'ADMIN'
                        ? 'АДМИН'
                        : 'КОРИСНИК'
                      : user.role || 'user'}
                  </Badge>

                  <Badge
                    variant='outline'
                    className={cn(
                      'text-[8px] sm:text-[9px] px-1.5 h-4 sm:h-4.5 rounded uppercase tracking-wider font-bold shrink-0',
                      getStatusColor(user.accountStatus || 'ACTIVE'),
                    )}
                  >
                    {user.accountStatus === 'PENDING_APPROVAL' && (
                      <Clock className='h-2 w-2 mr-0.5' />
                    )}
                    {user.accountStatus === 'ACTIVE' && (
                      <CheckCircle className='h-2 w-2 mr-0.5' />
                    )}
                    {(user.accountStatus === 'SUSPENDED' ||
                      user.accountStatus === 'BANNED') && (
                      <Ban className='h-2 w-2 mr-0.5' />
                    )}
                    {isMk
                      ? {
                          ACTIVE: 'АКТИВЕН',
                          PENDING_APPROVAL: 'ЧЕКА',
                          SUSPENDED: 'СУСПЕНДИРАН',
                          BANNED: 'БАНУРАН',
                        }[user.accountStatus || 'ACTIVE']
                      : (user.accountStatus || 'ACTIVE').replace('_', ' ')}
                  </Badge>
                </div>
                <div className='flex items-center justify-between gap-2 mt-0.5'>
                  <p className='text-[10px] sm:text-xs text-muted-foreground truncate'>
                    {user.email}
                  </p>
                  <span className='text-[9px] sm:text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60 shrink-0 hidden sm:block'>
                    {isMk ? 'ПРИДРУЖЕН ' : 'JOINED '}
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className='flex items-center gap-1 shrink-0'>
              {/* Direct Edit button — always visible */}
              <Button
                variant='ghost'
                size='sm'
                asChild
                className='h-8 w-8 p-0 rounded-lg'
                title={isMk ? 'Уреди корисник' : 'Edit User'}
              >
                <Link href={`/admin/users/${user.id}/edit`}>
                  <Edit className='h-4 w-4' />
                  <span className='sr-only'>
                    {isMk ? 'Уреди корисник' : 'Edit user'}
                  </span>
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
                  {user.accountStatus === 'PENDING_APPROVAL' && (
                    <>
                      <DropdownMenuItem
                        className={cn(
                          'cursor-pointer focus:text-emerald-500',
                          user.membershipStatus !== 'ACTIVE'
                            ? 'opacity-50 cursor-not-allowed'
                            : 'text-emerald-500',
                        )}
                        // Prevent action if not subscribed
                        onSelect={(e) => {
                          if (user.membershipStatus !== 'ACTIVE') {
                            e.preventDefault();
                            toast.error(
                              'User must have an active subscription to be approved.',
                            );
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
                        {isMk ? 'Одобри корисник' : 'Approve User'}
                        {user.membershipStatus !== 'ACTIVE' && (
                          <span className='ml-2 text-[10px] bg-red-100 text-red-800 px-1 rounded'>
                            No Sub
                          </span>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className='cursor-pointer text-destructive focus:text-destructive'
                        onSelect={() =>
                          startTransition(async () => {
                            const result = await rejectUserAction(user.id);
                            if (result.success) {
                              toast.success('User rejected/suspended');
                              router.refresh();
                            } else {
                              toast.error(result.error);
                            }
                          })
                        }
                      >
                        <XCircle className='h-4 w-4 mr-2' />
                        {isMk ? 'Одбиј корисник' : 'Reject User'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}

                  {(user.accountStatus === 'ACTIVE' || !user.accountStatus) && (
                    <DropdownMenuItem
                      className='cursor-pointer text-orange-500 focus:text-orange-500'
                      onSelect={() =>
                        startTransition(async () => {
                          const result = await rejectUserAction(user.id);
                          if (result.success) {
                            toast.success('User suspended');
                            router.refresh();
                          } else {
                            toast.error(result.error);
                          }
                        })
                      }
                    >
                      <Ban className='h-4 w-4 mr-2' />
                      {isMk ? 'Суспендирај корисник' : 'Suspend User'}
                    </DropdownMenuItem>
                  )}

                  {user.accountStatus === 'SUSPENDED' && (
                    <DropdownMenuItem
                      className='cursor-pointer text-emerald-500 focus:text-emerald-500'
                      onSelect={() =>
                        startTransition(async () => {
                          const result = await approveUserAction(user.id);
                          if (result.success) {
                            toast.success('User reactivated');
                            router.refresh();
                          } else {
                            toast.error(result.error);
                          }
                        })
                      }
                    >
                      <CheckCircle className='h-4 w-4 mr-2' />
                      {isMk ? 'Активирај корисник' : 'Reactivate User'}
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  {user.role !== 'ADMIN' ? (
                    <DropdownMenuItem
                      className='cursor-pointer text-indigo-500 focus:text-indigo-500'
                      onSelect={() => handleRoleClick(user, 'promote')}
                    >
                      <Shield className='h-4 w-4 mr-2' />
                      {isMk ? 'Направи модератор' : 'Make Moderator'}
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      className='cursor-pointer text-orange-500 focus:text-orange-500'
                      onSelect={() => handleRoleClick(user, 'revoke')}
                    >
                      <ShieldOff className='h-4 w-4 mr-2' />
                      {isMk ? 'Одземи модератор' : 'Revoke Moderator'}
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className='text-destructive focus:text-destructive cursor-pointer'
                    onSelect={() => handleDeleteClick(user)}
                  >
                    <Trash2 className='h-4 w-4 mr-2' />
                    {isMk ? 'Избриши корисник' : 'Delete User'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className='max-w-[90vw] sm:max-w-lg rounded-2xl'>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isMk ? 'Избриши корисник?' : 'Delete User?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isMk
                ? 'Оваа акција не може да се врати. Ова трајно ќе ја избрише корисничката сметка за'
                : 'This action cannot be undone. This will permanently delete the user account for'}{' '}
              <span className='font-semibold text-foreground'>
                {userToDelete?.name || (isMk ? 'овој корисник' : 'this user')}
              </span>{' '}
              {isMk
                ? 'и ќе ги отстрани сите нивни податоци од системот.'
                : `(${userToDelete?.email}) and remove all their data from the system.`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className='space-y-2'>
            <label
              htmlFor='confirm-delete'
              className='block text-sm font-medium text-foreground'
            >
              {isMk ? 'За потврда, внесете ' : 'To confirm, type '}{' '}
              <span className='font-bold select-all'>
                Delete {userToDelete?.name || 'User'}
              </span>{' '}
              {isMk ? 'подолу:' : 'below:'}
            </label>
            <input
              id='confirm-delete'
              type='text'
              className='flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
              placeholder={`Delete ${userToDelete?.name || 'User'}`}
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              autoComplete='off'
            />
          </div>
          <AlertDialogFooter className='flex-col sm:flex-row gap-2'>
            <AlertDialogCancel
              onClick={handleCancelDelete}
              disabled={isPending}
              className='w-full sm:w-auto'
            >
              {isMk ? 'Откажи' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                if (
                  deleteConfirmation !==
                  `Delete ${userToDelete?.name || 'User'}`
                ) {
                  e.preventDefault();
                  return;
                }
                handleConfirmDelete();
              }}
              disabled={
                isPending ||
                deleteConfirmation !== `Delete ${userToDelete?.name || 'User'}`
              }
              className='w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {isPending ? (
                <>
                  <span className='animate-spin mr-2'>⏳</span>
                  {isMk ? 'Бришење...' : 'Deleting...'}
                </>
              ) : (
                <>
                  <Trash2 className='h-4 w-4 mr-2' />
                  {isMk ? 'Избриши корисник' : 'Delete User'}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Promote / Revoke Confirmation Dialog */}
      <AlertDialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <AlertDialogContent className='max-w-[90vw] sm:max-w-lg rounded-2xl'>
          <AlertDialogHeader>
            <AlertDialogTitle className='flex items-center gap-2'>
              {roleAction === 'promote' ? (
                <Shield className='h-5 w-5 text-indigo-500' />
              ) : (
                <ShieldOff className='h-5 w-5 text-orange-500' />
              )}
              {roleAction === 'promote'
                ? isMk
                  ? 'Направи модератор?'
                  : 'Make Moderator?'
                : isMk
                  ? 'Одземи модератор?'
                  : 'Revoke Moderator?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {roleAction === 'promote' ? (
                <>
                  {isMk ? 'Ќе му дадете на ' : 'You are about to grant '}{' '}
                  <span className='font-semibold text-foreground'>
                    {userForRole?.name ||
                      (isMk ? 'овој корисник' : 'this user')}
                  </span>{' '}
                  {isMk
                    ? 'целосен администраторски (Модератор) пристап. Тие ќе можат да управуваат со огласи, корисници и поставки.'
                    : 'full administrator (Moderator) access. They will be able to manage listings, users, and site settings.'}
                </>
              ) : (
                <>
                  {isMk
                    ? 'Ќе му го одземете администраторскиот пристап на '
                    : 'You are about to revoke administrator access from '}{' '}
                  <span className='font-semibold text-foreground'>
                    {userForRole?.name ||
                      (isMk ? 'овој корисник' : 'this user')}
                  </span>
                  .{' '}
                  {isMk
                    ? 'Тие ќе бидат деградирани во обичен корисник.'
                    : 'They will be demoted to a regular user.'}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className='space-y-2'>
            <label
              htmlFor='confirm-role'
              className='block text-sm font-medium text-foreground'
            >
              {isMk ? 'За потврда, внесете ' : 'To confirm, type '}
              <span className='font-bold select-all'>
                {roleAction === 'promote' ? 'Promote' : 'Revoke'}{' '}
                {userForRole?.name || 'User'}
              </span>{' '}
              {isMk ? 'подолу:' : 'below:'}
            </label>
            <input
              id='confirm-role'
              type='text'
              className='flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
              placeholder={`${roleAction === 'promote' ? 'Promote' : 'Revoke'} ${userForRole?.name || 'User'}`}
              value={roleConfirmation}
              onChange={(e) => setRoleConfirmation(e.target.value)}
              autoComplete='off'
            />
          </div>

          <AlertDialogFooter className='flex-col sm:flex-row gap-2'>
            <AlertDialogCancel
              onClick={() => {
                setShowRoleDialog(false);
                setUserForRole(null);
                setRoleConfirmation('');
              }}
              disabled={isPending}
              className='w-full sm:w-auto'
            >
              {isMk ? 'Откажи' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                const expected = `${roleAction === 'promote' ? 'Promote' : 'Revoke'} ${userForRole?.name || 'User'}`;
                if (roleConfirmation !== expected) {
                  e.preventDefault();
                  return;
                }
                handleConfirmRole();
              }}
              disabled={
                isPending ||
                roleConfirmation !==
                  `${roleAction === 'promote' ? 'Promote' : 'Revoke'} ${userForRole?.name || 'User'}`
              }
              className={`w-full sm:w-auto ${
                roleAction === 'promote'
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-orange-600 hover:bg-orange-700 text-white'
              }`}
            >
              {isPending ? (
                <>
                  <span className='animate-spin mr-2'>⏳</span>
                  {isMk ? 'Се процесира...' : 'Processing...'}
                </>
              ) : roleAction === 'promote' ? (
                <>
                  <Shield className='h-4 w-4 mr-2' />
                  {isMk ? 'Да, направи модератор' : 'Yes, Make Moderator'}
                </>
              ) : (
                <>
                  <ShieldOff className='h-4 w-4 mr-2' />
                  {isMk ? 'Да, одземи пристап' : 'Yes, Revoke Access'}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
