"use client";
import { useState } from 'react';

type ProfileHeaderProps = {
  name: string;
  location: string;
  summary?: string;
  headerStyle?: {
    type: 'color' | 'gradient';
    value: string;
  };
  introText?: string;
};

export function ProfileHeader({ name, location, summary, headerStyle, introText }: ProfileHeaderProps) {
  const backgroundStyle = headerStyle?.type === 'gradient' 
    ? { background: headerStyle.value }
    : { backgroundColor: headerStyle?.value || '#1a365d' };

  return (
    <div className="relative">
      {/* Hero Background */}
      <div 
        className="h-48 w-full overflow-hidden rounded-t-lg transition-colors duration-500"
        style={backgroundStyle}
      />

      {/* Profile Info */}
      <div className="px-8 pb-6 pt-6">
        <h1 className="text-4xl font-bold text-gray-900">{name}</h1>
        <div className="mt-2 flex items-center text-gray-600">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="ml-2">{location}</span>
        </div>
        {introText && (
          <p className="mt-4 italic text-gray-600">{introText}</p>
        )}
        {summary && (
          <p className="mt-4 text-gray-600">{summary}</p>
        )}
      </div>
    </div>
  );
} 