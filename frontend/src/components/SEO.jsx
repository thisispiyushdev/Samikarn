import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, path = '', image }) {
  const siteUrl = 'https://samikaran.org';
  const canonicalUrl = `${siteUrl}${path}`;
  const ogImageUrl = image || `${siteUrl}/og-image.png`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:site_name" content="Samikaran NGO" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:secure_url" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Samikaran - Social Initiative & NGO" />
      <meta property="og:image:type" content="image/png" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:image:alt" content="Samikaran - Social Initiative & NGO" />
    </Helmet>
  );
}
