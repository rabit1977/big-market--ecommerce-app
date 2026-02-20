import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Biggest Market - Classifieds Platform',
    short_name: 'Biggest Market',
    description: 'Buy and sell anything in your local community. The best place for classifieds.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/icon?size=192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon?size=512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
