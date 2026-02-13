'use client';

import { createCategory, deleteCategory, updateCategory } from '@/actions/admin/categories-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from 'convex/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronRight, Edit, Folder, FolderOpen, MoreHorizontal, Plus, Trash } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

// Types
interface Category {
  _id: Id<"categories">;
  id?: string; // For compatibility if actions return id
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  isFeatured: boolean;
  parentId?: string | null;
  template?: any;
}

// Schema
const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  parentId: z.string().optional().nullable(),
  template: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export function CategoriesClient() {
  const rootCategories = useQuery(api.categories.getRoot);
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [parentForNew, setParentForNew] = useState<string | null>(null);

  const openCreate = (parentId: string | null = null) => {
    setEditingCategory(null);
    setParentForNew(parentId);
    setIsOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditingCategory(category);
    setParentForNew(null);
    setIsOpen(true);
  };

  return (
    <div className='space-y-6 max-w-5xl mx-auto'>
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Categories</h2>
          <p className='text-muted-foreground'>Manage your product hierarchy.</p>
        </div>
        <Button onClick={() => openCreate(null)}>
            <Plus className='mr-2 h-4 w-4' /> New Root Category
        </Button>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Category Tree</CardTitle>
            <CardDescription>
                Expand folders to view subcategories.
            </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
             <ScrollArea className="h-[600px] p-4">
                {rootCategories === undefined ? (
                    <div className="flex items-center justify-center p-8 text-muted-foreground">Loading...</div>
                ) : rootCategories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-muted-foreground gap-2">
                        <FolderOpen className="h-8 w-8 opacity-50" />
                        <p>No categories found.</p>
                        <Button variant="link" onClick={() => openCreate(null)}>Create the first one</Button>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {rootCategories.map(cat => (
                            <CategoryTreeItem 
                                key={cat._id} 
                                category={cat} 
                                onEdit={openEdit} 
                                onCreateSub={openCreate} 
                            />
                        ))}
                    </div>
                )}
             </ScrollArea>
        </CardContent>
      </Card>

      <CategoryDialog 
        open={isOpen} 
        onOpenChange={setIsOpen} 
        editingCategory={editingCategory}
        parentForNew={parentForNew}
      />
    </div>
  );
}

// ------------------------------------------------------------------
// Recursive Tree Item Component
// ------------------------------------------------------------------

interface TreeItemProps {
    category: Category;
    onEdit: (cat: Category) => void;
    onCreateSub: (parentId: string) => void;
    level?: number;
}

function CategoryTreeItem({ category, onEdit, onCreateSub, level = 0 }: TreeItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const children = useQuery(api.categories.getChildren, isExpanded ? { parentId: category._id } : "skip");
    
    // Indent based on level
    const paddingLeft = `${level * 1.5}rem`;

    return (
        <div>
            <div 
                className="group flex items-center gap-2 py-2 px-2 hover:bg-muted/50 rounded-md transition-colors"
                style={{ marginLeft: level > 0 ? paddingLeft : 0 }}
            >
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 shrink-0"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                </Button>

                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {isExpanded ? (
                        <FolderOpen className="h-4 w-4 text-primary shrink-0" />
                    ) : (
                        <Folder className="h-4 w-4 text-primary/80 shrink-0" />
                    )}
                    <span className="font-medium truncate text-sm">{category.name}</span>
                    {!category.isActive && (
                        <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">Inactive</span>
                    )}
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                     <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onCreateSub(category._id)}>
                        <Plus className="h-3.5 w-3.5" />
                        <span className="sr-only">Add Subcategory</span>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onEdit(category)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onCreateSub(category._id)}>
                                <Plus className="mr-2 h-4 w-4" /> Add Subcategory
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={async () => {
                                    if(confirm('Delete this category?')) {
                                        await deleteCategory(category._id); // Use Convex ID
                                        toast.success('Deleted');
                                    }
                                }}
                            >
                                <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        {children === undefined ? (
                            <div className="py-2 pl-8 text-xs text-muted-foreground" style={{ marginLeft: paddingLeft }}>Loading...</div>
                        ) : children.length === 0 ? (
                            <div className="py-2 pl-8 text-xs text-muted-foreground italic" style={{ marginLeft: paddingLeft }}>No subcategories</div>
                        ) : (
                            <div>
                                {children.map(child => (
                                    <CategoryTreeItem 
                                        key={child._id} 
                                        category={child} 
                                        onEdit={onEdit} 
                                        onCreateSub={onCreateSub}
                                        level={level + 1}
                                    />
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ------------------------------------------------------------------
// Dialog Form Component
// ------------------------------------------------------------------

interface CategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingCategory: Category | null;
    parentForNew: string | null;
}

function CategoryDialog({ open, onOpenChange, editingCategory, parentForNew }: CategoryDialogProps) {
    const [isPending, startTransition] = useTransition();
    
    // We fetch root categories to populate the parent selector (simplification: only showing roots as parents for now to avoid massive list)
    // A fully scalable implementation would use an async select or searchable dropdown.
    const rootCategories = useQuery(api.categories.getRoot);

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: '',
            slug: '',
            description: '',
            image: '',
            isActive: true,
            isFeatured: false,
            parentId: null,
            template: '',
        },
    });

    useEffect(() => {
        if (editingCategory) {
            form.reset({
                name: editingCategory.name,
                slug: editingCategory.slug,
                description: editingCategory.description || '',
                image: editingCategory.image || '',
                isActive: editingCategory.isActive,
                isFeatured: editingCategory.isFeatured,
                parentId: editingCategory.parentId || null,
                template: editingCategory.template ? JSON.stringify(editingCategory.template, null, 2) : '',
            });
        } else {
            form.reset({
                name: '',
                slug: '',
                description: '',
                image: '',
                isActive: true,
                isFeatured: false,
                parentId: parentForNew, // Pre-select parent if creating subcategory
                template: '',
            });
        }
    }, [editingCategory, parentForNew, form, open]);

     // Auto-generate slug
     const name = form.watch('name');
     useEffect(() => {
       if (!editingCategory && name) {
         form.setValue('slug', name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''));
       }
     }, [name, editingCategory, form]);

    const onSubmit = (data: CategoryFormValues) => {
        startTransition(async () => {
             try {
                let parsedTemplate = undefined;
                if (data.template) {
                    try {
                        parsedTemplate = JSON.parse(data.template);
                    } catch (e) {
                         toast.error('Invalid JSON');
                         return;
                    }
                }

                const payload = { ...data, template: parsedTemplate };

                let result;
                if (editingCategory) {
                    result = await updateCategory(editingCategory._id, payload);
                } else {
                    result = await createCategory(payload);
                }

                if (result.success) {
                    toast.success(editingCategory ? 'Updated' : 'Created');
                    onOpenChange(false);
                } else {
                    toast.error(result.error);
                }

             } catch (e) {
                 toast.error('Error saving category');
             }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-xl'>
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Create Category'}</DialogTitle>
              <DialogDescription>
                {editingCategory ? 'Modify category details.' : 'Add a new category to the hierarchy.'}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder='Electronics' {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name='slug'
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                            <Input placeholder='electronics' {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name='parentId'
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Parent Category</FormLabel>
                             <Select 
                                onValueChange={(val) => field.onChange(val === 'null' ? null : val)} 
                                value={field.value || 'null'}
                            >
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Root (None)" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="null">None (Root)</SelectItem>
                                    {/* Ideally this list should be searchable or hierarchical too, but for now showing roots is a safe default */}
                                    {rootCategories?.map(c => (
                                        <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                </div>
                
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea rows={3} placeholder='Optional description...' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center gap-6">
                    <FormField
                    control={form.control}
                    name='isActive'
                    render={({ field }) => (
                        <FormItem className='flex flex-row items-center space-x-2 space-y-0'>
                        <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className='space-y-0.5'>
                            <FormLabel className='text-sm'>Active</FormLabel>
                        </div>
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name='isFeatured'
                    render={({ field }) => (
                        <FormItem className='flex flex-row items-center space-x-2 space-y-0'>
                        <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className='space-y-0.5'>
                            <FormLabel className='text-sm'>Featured</FormLabel>
                        </div>
                        </FormItem>
                    )}
                    />
                </div>


                <DialogFooter>
                  <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button type='submit' disabled={isPending}>
                    {isPending ? 'Saving...' : 'Save'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
            </DialogContent>
        </Dialog>
    );
}
