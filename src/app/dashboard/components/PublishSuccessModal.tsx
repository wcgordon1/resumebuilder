"use client";
import { useState } from 'react';

type PublishSuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  publicUrl: string;
};

export function PublishSuccessModal({ isOpen, onClose, publicUrl }: PublishSuccessModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleView = () => {
    const url = new URL(publicUrl);
    console.log('Opening URL:', url.pathname);
    window.open(url.pathname, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Resume Published!</h2>
        
        <div className="mb-6 space-y-4">
          <p className="text-gray-600">
            Your resume is now publicly available at:
          </p>

          <div className="flex items-center gap-2 rounded-md border border-gray-200 p-2">
            <input
              type="text"
              readOnly
              value={publicUrl}
              className="flex-1 bg-transparent px-2 text-sm text-gray-600"
            />
            <button
              onClick={handleCopy}
              className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-200"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleView}
            className="rounded-md bg-primary px-4 py-2 text-white hover:opacity-90"
          >
            View Page
          </button>
        </div>
      </div>
    </div>
  );
} 