import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  type?: 'website' | 'article';
  image?: string;
  path?: string;
}

export default function SEO({
  title = 'Help Me',
  description = '助け合いのためのディスカッションプラットフォーム',
  type = 'website',
  image = '/og-image.png',
  path = ''
}: SEOProps) {
  const siteUrl = 'https://helpme.example.com';
  const url = `${siteUrl}${path}`;
  const fullTitle = title === 'Help Me' ? title : `${title} | Help Me`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* OGP */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${siteUrl}${image}`} />
      <meta property="og:site_name" content="Help Me" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${image}`} />

      {/* その他のメタタグ */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <meta name="theme-color" content="#ffdb33" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
}