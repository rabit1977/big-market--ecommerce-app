import { Listing } from '@/lib/types';
import { formatPrice } from '@/lib/utils/formatters';
import Image from 'next/image';
import Link from 'next/link';

interface SearchResultItemProps {
  listing: Listing;
  index: number;
  onSelect: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLAnchorElement>, index: number) => void;
}

export const SearchResultItem = ({
  listing,
  index,
  onSelect,
  onKeyDown,
}: SearchResultItemProps) => {
  return (
    // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
    <li role='option'>
      <Link
        href={`/listings/${listing.id}`}
        onClick={onSelect}
        onKeyDown={(e) => onKeyDown(e, index)}
        className='flex items-center gap-3 rounded-md p-2 hover:bg-accent transition-colors focus:bg-accent focus:outline-none'
      >
        <div className='relative h-12 w-12 flex shrink-0 rounded-md overflow-hidden bg-muted'>
           {(listing.thumbnail) ? (
              <Image
                src={listing.thumbnail}
                alt={listing.title}
                fill
                className='object-cover'
                sizes='48px'
              />
           ) : (
              <div className="w-full h-full bg-secondary flex items-center justify-center text-[10px] text-muted-foreground">Img</div>
           )}
        </div>

        <div className='flex-1 min-w-0'>
          <div className='text-sm font-medium truncate'>{listing.title}</div>
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            {listing.category && <span>{listing.category}</span>}
            {listing.price !== null && (
              <>
                <span>•</span>
                <span className='font-semibold text-foreground'>
                  {formatPrice(listing.price)}
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
};
