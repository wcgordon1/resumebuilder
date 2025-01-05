"use client";
import { useState } from "react";
import { createClient } from "lib/supabase/client";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectSettings } from "lib/redux/settingsSlice";

type SaveResumeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  resumeId?: string;
  defaultName?: string;
};

export function SaveResumeModal({ isOpen, onClose, resumeId, defaultName = "" }: SaveResumeModalProps) {
  const [name, setName] = useState(defaultName);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const resumeData = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fullResumeData = {
        ...resumeData,
        settings: settings
      };

      if (resumeId) {
        const { error: updateError } = await supabase
          .from('resumes')
          .update({
            name: name,
            resume_data: JSON.stringify(fullResumeData),
            updated_at: new Date().toISOString()
          })
          .eq('id', resumeId);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('resumes')
          .insert({
            user_id: user.id,
            name: name,
            resume_data: JSON.stringify(fullResumeData)
          });

        if (insertError) throw insertError;
      }

      onClose();
    } catch (err) {
      console.error('Error saving resume:', err);
      setError('Failed to save resume. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold">
          Save Resume
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
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 