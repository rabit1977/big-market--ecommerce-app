import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const usePathnameClearEffect = (
  resetSearch: () => void,
  keepAlivePrefix: string
) => {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.startsWith(keepAlivePrefix)) {
      resetSearch();
    }
  }, [pathname, resetSearch, keepAlivePrefix]);
};