import React from 'react';
import { ExternalLink } from 'lucide-react';

interface UrlLinkProps {
  url: string;
  className?: string;
  showIcon?: boolean;
}

export default function UrlLink({ url, className = '', showIcon = true }: UrlLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 hover:underline ${className}`}
    >
      {url}
      {showIcon && <ExternalLink className="h-4 w-4" />}
    </a>
  );
}