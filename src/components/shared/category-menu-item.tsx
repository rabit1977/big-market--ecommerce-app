
import {
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu';
import { CategoryNode } from '@/lib/utils/category-tree';

interface CategoryMenuItemProps {
    category: CategoryNode;
    selectedCategory: string;
    onSelect: (slug: string) => void;
}

export const CategoryMenuItem = ({ category, selectedCategory, onSelect }: CategoryMenuItemProps) => {
    const hasChildren = category.children && category.children.length > 0;
    const isSelected = selectedCategory === category.slug;

    if (hasChildren) {
        return (
            <DropdownMenuSub>
                <DropdownMenuSubTrigger 
                    className={isSelected ? 'bg-primary/5 text-primary font-bold' : ''}
                >
                   {category.name}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="max-h-[300px] overflow-auto">
                    {/* Option to select the parent category itself inside its submenu? */}
                    <DropdownMenuItem onClick={() => onSelect(category.slug)}>
                        All in {category.name}
                    </DropdownMenuItem>
                    {category.children.map(child => (
                        <CategoryMenuItem 
                            key={child._id} 
                            category={child} 
                            selectedCategory={selectedCategory} 
                            onSelect={onSelect} 
                        />
                    ))}
                </DropdownMenuSubContent>
            </DropdownMenuSub>
        );
    }

    return (
        <DropdownMenuItem 
            onClick={() => onSelect(category.slug)}
            className={isSelected ? 'bg-primary/5 text-primary font-bold' : ''}
        >
            {category.name}
        </DropdownMenuItem>
    );
};
