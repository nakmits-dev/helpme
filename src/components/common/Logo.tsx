import React from 'react';
import { HelpCircle } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="flex items-center bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-lg text-white">
        <HelpCircle className={sizes[size]} />
      </div>
      <h1 className={`${textSizes[size]} font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent`}>
        Help Me
      </h1>
    </div>
  );
}