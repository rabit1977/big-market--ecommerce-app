'use client';

import { createCategory, deleteCategory, updateCategory } from '@/actions/admin/categories-actions';
import { AdminFilterToolbar } from '@/components/admin/admin-filter-toolbar';
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

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from 'convex/react';
import { ChevronDown, ChevronRight, Edit, Folder, FolderOpen, MoreHorizontal, Plus, Trash } from 'lucide-react';
import { memo, useCallback, useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { CategoryTemplateBuilder } from './category-template-builder';

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

interface Category {
  _id: Id<'categories'>;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  isFeatured: boolean;
  parentId?: string | null;
  template?: any;
  count?: number;
}

interface DialogState {
  open: boolean;
  editingCategory: Category | null;
  parentForNew: string | null;
}

// ------------------------------------------------------------------
// Schema
// ------------------------------------------------------------------

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  parentId: z.string().optional().nullable(),
  template: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        try {
          JSON.parse(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: 'Must be valid JSON' }
    ),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

// ------------------------------------------------------------------
// Root Component
// ------------------------------------------------------------------

export default function CategoriesClient() {
  const rootCategories = useQuery(api.categories.getRoot);

  const [search, setSearch]     = useState('');
  const [activeFilter, setActive] = useState<'all' | 'active' | 'inactive' | 'featured'>('all');

  const [dialogState, setDialogState] = useState<DialogState>({
    open: false,
    editingCategory: null,
    parentForNew: null,
  });

  const openCreate = useCallback((parentId: string | null = null) => {
    setDialogState({ open: true, editingCategory: null, parentForNew: parentId });
  }, []);

  const openEdit = useCallback((category: Category) => {
    setDialogState({ open: true, editingCategory: category, parentForNew: null });
  }, []);

  const closeDialog = useCallback((open: boolean) => {
    setDialogState((prev) => ({ ...prev, open }));
  }, []);

  // Flatten categories for search
  const allCats = rootCategories || [];
  const totalCount = allCats.length;
  const activeCount = allCats.filter((c: any) => c.isActive).length;
  const featuredCount = allCats.filter((c: any) => c.isFeatured).length;

  // Filter the root list
  const filteredRoots = allCats.filter((cat: any) => {
    const matchSearch = !search.trim() || cat.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      activeFilter === 'all' ? true :
      activeFilter === 'active' ? cat.isActive :
      activeFilter === 'inactive' ? !cat.isActive :
      activeFilter === 'featured' ? cat.isFeatured : true;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
            Categories
            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-inset ring-primary/20">
              {totalCount}
            </span>
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            {activeCount} active · {featuredCount} featured
          </p>
        </div>
        <Button onClick={() => openCreate(null)} className="rounded-full font-bold shadow-lg shadow-primary/20 shrink-0">
          <Plus className="mr-2 h-4 w-4" /> New Root Category
        </Button>
      </div>

      {/* Filter toolbar */}
      <div className="glass-card rounded-2xl p-4 border border-border/60 space-y-3">
        <AdminFilterToolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search categories by name..."
          showTimeRange={false}
        />
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/30">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Filter:</span>
          {(['all', 'active', 'inactive', 'featured'] as const).map(f => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                activeFilter === f
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
          <span className="ml-auto text-xs text-muted-foreground">
            <span className="font-bold text-foreground">{filteredRoots.length}</span> of <span className="font-bold text-foreground">{totalCount}</span> root categories
          </span>
        </div>
      </div>

      <Card className="rounded-[2rem] overflow-hidden border border-border/60 shadow-xl shadow-black/5 glass-card">
        <CardHeader className="border-b border-border/40 bg-muted/20">
          <CardTitle>Category Tree</CardTitle>
          <CardDescription>Expand folders to view subcategories.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px] p-4">
            {rootCategories === undefined ? (
              <div className="flex items-center justify-center p-8 text-muted-foreground">Loading...</div>
            ) : filteredRoots.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-muted-foreground gap-2">
                <FolderOpen className="h-8 w-8 opacity-50" />
                <p>{search ? `No categories matching "${search}"` : 'No categories found.'}</p>
                {!search && (
                  <Button variant="link" onClick={() => openCreate(null)}>
                    Create the first one
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredRoots.map((cat: any) => (
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
        open={dialogState.open}
        onOpenChange={closeDialog}
        editingCategory={dialogState.editingCategory}
        parentForNew={dialogState.parentForNew}
        rootCategories={rootCategories}
      />
    </div>
  );
}

// ------------------------------------------------------------------
// Recursive Tree Item — memoized to prevent cascade re-renders
// ------------------------------------------------------------------

interface TreeItemProps {
  category: Category;
  onEdit: (cat: Category) => void;
  onCreateSub: (parentId: string) => void;
  level?: number;
}

const CategoryTreeItem = memo(function CategoryTreeItem({
  category,
  onEdit,
  onCreateSub,
  level = 0,
}: TreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const children = useQuery(
    api.categories.getChildren,
    isExpanded ? { parentId: category._id } : 'skip'
  );

  const handleDelete = useCallback(async () => {
    if (confirm('Delete this category?')) {
      await deleteCategory(category._id);
      toast.success('Deleted');
    }
  }, [category._id]);

  const handleEdit = useCallback(() => onEdit(category), [category, onEdit]);
  const handleCreateSub = useCallback(() => onCreateSub(category._id), [category._id, onCreateSub]);
  const toggleExpand = useCallback(() => setIsExpanded((prev) => !prev), []);

  const paddingLeft = level > 0 ? `${level * 1.5}rem` : undefined;

  return (
    <div>
      <div
        className="group flex items-center gap-2 py-2 px-2 hover:bg-muted/50 rounded-md transition-colors"
        style={{ marginLeft: paddingLeft }}
      >
        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={toggleExpand}>
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
          {typeof category.count === 'number' && (
            <span className="text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-full">
              {category.count}
            </span>
          )}
          {!category.isActive && (
            <span className="text-[10px] bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded-full">
              Inactive
            </span>
          )}
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCreateSub}>
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
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCreateSub}>
                <Plus className="mr-2 h-4 w-4" /> Add Subcategory
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={handleDelete}
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* CSS-only expand/collapse — avoids framer-motion overhead per node */}
      <div
        className="overflow-hidden transition-all duration-200"
        style={{ maxHeight: isExpanded ? '9999px' : '0px' }}
      >
        {isExpanded && (
          <>
            {children === undefined ? (
              <div
                className="py-2 pl-8 text-xs text-muted-foreground"
                style={{ marginLeft: paddingLeft }}
              >
                Loading...
              </div>
            ) : children.length === 0 ? (
              <div
                className="py-2 pl-8 text-xs text-muted-foreground italic"
                style={{ marginLeft: paddingLeft }}
              >
                No subcategories
              </div>
            ) : (
              <div>
                {children.map((child) => (
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
          </>
        )}
      </div>
    </div>
  );
});

// ------------------------------------------------------------------
// Dialog Form Component
// ------------------------------------------------------------------

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: Category | null;
  parentForNew: string | null;
  rootCategories: Category[] | undefined;
}

function CategoryDialog({
  open,
  onOpenChange,
  editingCategory,
  parentForNew,
  rootCategories,
}: CategoryDialogProps) {
  const [isPending, startTransition] = useTransition();

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

  // Reset form whenever the dialog opens or the target changes
  useEffect(() => {
    if (!open) return;
    if (editingCategory) {
      form.reset({
        name: editingCategory.name,
        slug: editingCategory.slug,
        description: editingCategory.description ?? '',
        image: editingCategory.image ?? '',
        isActive: editingCategory.isActive,
        isFeatured: editingCategory.isFeatured,
        parentId: editingCategory.parentId ?? null,
        template: editingCategory.template
          ? JSON.stringify(editingCategory.template, null, 2)
          : '',
      });
    } else {
      form.reset({
        name: '',
        slug: '',
        description: '',
        image: '',
        isActive: true,
        isFeatured: false,
        parentId: parentForNew,
        template: '',
      });
    }
  }, [open, editingCategory, parentForNew, form]);

  // Auto-generate slug from name only when creating
  const name = form.watch('name');
  useEffect(() => {
    if (editingCategory || !name) return;
    form.setValue(
      'slug',
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),
      { shouldValidate: false }
    );
  }, [name, editingCategory, form]);

  const onSubmit = (data: CategoryFormValues) => {
    startTransition(async () => {
      try {
        let parsedTemplate: any = undefined;
        if (data.template) {
          parsedTemplate = JSON.parse(data.template); // already validated by zod
        }

        const payload = { ...data, template: parsedTemplate };
        const result = editingCategory
          ? await updateCategory(editingCategory._id, payload)
          : await createCategory(payload);

        if (result.success) {
          toast.success(editingCategory ? 'Updated' : 'Created');
          onOpenChange(false);
        } else {
          toast.error(result.error);
        }
      } catch {
        toast.error('Error saving category');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{editingCategory ? 'Edit Category' : 'Create Category'}</DialogTitle>
          <DialogDescription>
            {editingCategory ? 'Modify category details.' : 'Add a new category to the hierarchy.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Electronics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="electronics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Category</FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(val === 'null' ? null : val)}
                      value={field.value ?? 'null'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Root (None)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="null">None (Root)</SelectItem>
                        {rootCategories?.map((c) => (
                          <SelectItem key={c._id} value={c._id}>
                            {c.name}
                          </SelectItem>
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Optional description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-6">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="text-sm">Active</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="text-sm">Featured</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="template"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dynamic Template Fields</FormLabel>
                  <FormControl>
                    <CategoryTemplateBuilder value={field.value || ''} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}