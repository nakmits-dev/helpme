export interface SEOConfig {
  title: string;
  description: string;
  type: 'website' | 'article';
  image: string;
  url: string;
  siteName: string;
  locale: string;
}

export const defaultSEOConfig: SEOConfig = {
  title: 'Help Me',
  description: '助け合いのためのディスカッションプラットフォーム',
  type: 'website',
  image: '/og-image.png',
  url: 'https://helpme.example.com',
  siteName: 'Help Me',
  locale: 'ja_JP'
};

export function generateCanonicalUrl(path: string): string {
  const baseUrl = defaultSEOConfig.url.replace(/\/$/, '');
  const cleanPath = path.replace(/^\/+/, '');
  return `${baseUrl}/${cleanPath}`;
}

export function generateStructuredData(config: Partial<SEOConfig> = {}): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.title || defaultSEOConfig.title,
    description: config.description || defaultSEOConfig.description,
    url: config.url || defaultSEOConfig.url
  };
  return JSON.stringify(data);
}