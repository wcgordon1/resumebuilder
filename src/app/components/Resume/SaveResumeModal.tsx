"use client";
import { useState, useEffect } from 'react';

type SaveResumeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<string | void>;
  defaultName?: string;
  type: 'save' | 'download';
};

export function SaveResumeModal({ isOpen, onClose, onSave, defaultName = '', type }: SaveResumeModalProps) {
  const [name, setName] = useState(defaultName);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(defaultName);
      setError(null);
    }
  }, [isOpen, defaultName]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    
    try {
      const result = await onSave(name);
      
      // Handle download if URL is returned
      if (typeof result === 'string' && type === 'download') {
        // Create download link
        const link = document.createElement('a');
        link.href = result;
        link.download = `${name}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving resume:', error);
      setError(error instanceof Error ? error.message : 'Failed to save resume');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold">
          {type === 'save' ? 'Save Resume' : 'Download Resume'}
        </h2>
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        <form onSubmit={handleSave}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter resume name"
            className="mb-4 w-full rounded-md border border-gray-300 p-2"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-md bg-primary px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : type === 'save' ? 'Save' : 'Download'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 