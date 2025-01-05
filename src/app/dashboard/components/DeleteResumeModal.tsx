"use client";
import { useState } from 'react';

type DeleteResumeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
  resumeName: string;
};

export function DeleteResumeModal({ isOpen, onClose, onDelete, resumeName }: DeleteResumeModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
      setSuccess(true);
      // Close modal after showing success message
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error deleting resume:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {success ? (
          <div className="text-center">
            <p className="text-lg font-semibold text-green-600">Resume successfully deleted!</p>
          </div>
        ) : (
          <>
            <h2 className="mb-4 text-xl font-bold text-gray-900">Delete Resume</h2>
            <p className="mb-4 text-gray-600">
              Are you sure you want to delete &quot;{resumeName}&quot;? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md px-4 py-2 text-gray-600 hover:bg-gray-100"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 