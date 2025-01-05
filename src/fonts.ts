import localFont from 'next/font/local';

export const caladea = localFont({
  src: [
    {
      path: '../public/fonts/Caladea-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Caladea-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-caladea'
});

// ... repeat for other fonts 