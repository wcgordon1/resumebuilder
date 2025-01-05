import dynamic from 'next/dynamic';

const FontsZh = dynamic(() => import('./FontsZh'), {
  ssr: false,
});

export const NonEnglishFontsCSSLazyLoader = () => {
  return <FontsZh />;
};
