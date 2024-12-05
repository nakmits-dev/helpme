import React, { useRef, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  showCount?: boolean;
}

export default function Textarea({
  label,
  error,
  helperText,
  className = '',
  id,
  maxLength,
  showCount = true,
  value = '',
  onChange,
  ...props
}: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自動リサイズの処理
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    adjustHeight();
    textarea.addEventListener('input', adjustHeight);
    return () => textarea.removeEventListener('input', adjustHeight);
  }, [value]);

  const currentLength = typeof value === 'string' ? value.length : 0;
  const isNearLimit = maxLength && currentLength >= maxLength * 0.9;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          ref={textareaRef}
          id={textareaId}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          className={`
            block w-full rounded-lg border px-4 py-3 shadow-sm
            placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
            min-h-[5rem] max-h-[20rem] overflow-y-auto
            ${error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-200 focus:border-primary-500 focus:ring-primary-200'
            }
            ${isNearLimit ? 'border-yellow-300' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <div className="pointer-events-none absolute top-3 right-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>
      <div className="flex justify-between items-center text-sm">
        {(error || helperText) && (
          <p className={`${error ? 'text-red-600' : 'text-gray-500'}`}>
            {error || helperText}
          </p>
        )}
        {showCount && maxLength && (
          <p className={`text-right ${
            isNearLimit ? 'text-yellow-600' : 'text-gray-500'
          }`}>
            {currentLength} / {maxLength}
          </p>
        )}
      </div>
    </div>
  );
}