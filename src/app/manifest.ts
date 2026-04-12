import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Premium Cafeteria App',
    short_name: 'Cafeteria',
    description: 'Order your favorite meals seamlessly',
    start_url: '/home',
    display: 'standalone',
    background_color: '#0f0f14',
    theme_color: '#FF5A00',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
