"use client";
import { useState } from 'react';
import { createClient } from 'lib/supabase/client';
import type { SavedResume } from '../types';
import { PublishSuccessModal } from './PublishSuccessModal';

type PublishResumeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  resume: SavedResume;
  userName: string;
  onSuccess: (url: string) => void;
};

export function PublishResumeModal({ isOpen, onClose, resume, userName, onSuccess }: PublishResumeModalProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contactEnabled, setContactEnabled] = useState(true);
  const supabase = createClient();

  if (!isOpen) return null;

  const generatePublicUrl = (name: string) => {
    // Convert to lowercase and replace spaces/special chars with hyphens
    const baseName = name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    
    // Add timestamp to ensure uniqueness
    return `${baseName}-${Date.now().toString().slice(-8)}`;
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setError(null);

    try {
      const resumeData = JSON.parse(resume.resume_data);
      const publicData = { ...resumeData };
      
      delete publicData.profile.email;
      delete publicData.profile.phone;

      const publicUrl = generatePublicUrl(userName);
      const fullUrl = new URL(`/p/${publicUrl}`, window.location.origin).toString();

      // Log the data we're about to save
      console.log('Publishing resume with data:', {
        id: resume.user_id,
        public_resume_id: resume.id,
        public_url: publicUrl,
        public_resume_data: publicData,
        is_public: true,
        is_contact_enabled: contactEnabled
      });

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: resume.user_id,
          public_resume_id: resume.id,
          public_url: publicUrl,
          public_resume_data: publicData,
          is_public: true,
          is_contact_enabled: contactEnabled
        }, {
          onConflict: 'id'
        });

      if (updateError) {
        console.error('Supabase update error:', updateError);
        throw updateError;
      }

      onClose();
      onSuccess(fullUrl);
    } catch (err) {
      console.error('Error publishing resume:', err);
      setError('Failed to publish resume. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Publish Resume</h2>
        
        <div className="mb-6 space-y-4">
          <p className="text-gray-600">
            This will make your resume publicly accessible (excluding email and phone number).
            Only one resume can be public at a time.
          </p>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="contactEnabled"
              checked={contactEnabled}
              onChange={(e) => setContactEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="contactEnabled" className="text-sm text-gray-600">
              Allow potential employers to contact me through a secure form
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-4 py-2 text-gray-600 hover:bg-gray-100"
            disabled={isPublishing}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="rounded-md bg-primary px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
          >
            {isPublishing ? 'Publishing...' : 'Publish Resume'}
          </button>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
} 