"use client";
import { useEffect, useState } from "react";
import { createClient } from "lib/supabase/client";
import { useAuth } from "lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useDispatch } from 'react-redux';
import { setResume } from 'lib/redux/resumeSlice';
import { setSettings } from 'lib/redux/settingsSlice';
import { parseAndRedirectToBuilder } from "lib/utils/parseAndRedirect";
import { TrashIcon } from "@heroicons/react/24/outline";
import { DeleteResumeModal } from "../DeleteResumeModal";

type SavedResume = {
  id: string;
  name: string;
  created_at: string;
  file_path: string;
};

export function ResumesSection() {
  const dispatch = useDispatch();
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const supabase = createClient();
  const { user } = useAuth();
  const router = useRouter();
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; resume: SavedResume | null }>({
    isOpen: false,
    resume: null
  });

  useEffect(() => {
    async function fetchResumes() {
      try {
        if (!user) return;

        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setResumes(data || []);
      } catch (e) {
        console.error('Error fetching resumes:', e);
        setError('Failed to load resumes');
      } finally {
        setIsLoading(false);
      }
    }

    fetchResumes();
  }, [user, supabase]);

  const handleViewResume = async (filePath: string) => {
    try {
      // Get signed URL that expires in 1 hour
      const { data, error } = await supabase.storage
        .from('resumes')
        .createSignedUrl(filePath, 3600); // 3600 seconds = 1 hour

      if (error) throw error;
      if (!data) throw new Error('Failed to get signed URL');

      window.open(data.signedUrl, '_blank');
    } catch (e) {
      console.error('Error getting signed URL:', e);
      // You might want to show an error toast here
    }
  };

  const handleEdit = async (resume: SavedResume) => {
    try {
      setEditingId(resume.id);
      
      // Get both resume and settings data
      const { data, error } = await supabase
        .from('resumes')
        .select('resume_data, settings_data')
        .eq('id', resume.id)
        .single();

      if (error) throw error;
      if (!data?.resume_data) throw new Error('No resume data found');

      // Clear localStorage and reset Redux state
      localStorage.clear();
      
      // Parse the stored data
      const resumeData = JSON.parse(data.resume_data);
      const settingsData = data.settings_data ? JSON.parse(data.settings_data) : null;

      // Small delay to ensure state is cleared
      await new Promise(resolve => setTimeout(resolve, 100));

      // Update Redux store with fresh data
      dispatch(setResume(resumeData));
      if (settingsData) {
        dispatch(setSettings(settingsData));
      }

      // Set new data in localStorage
      localStorage.setItem('resume-state', data.resume_data);
      if (settingsData) {
        localStorage.setItem('settings', JSON.stringify(settingsData));
      }
      localStorage.setItem('hasUsedAppBefore', 'true');
      
      // Redirect to resume builder
      router.push('/resume-builder');
    } catch (error) {
      console.error('Error editing resume:', error);
      setError('Failed to edit resume. Please try again.');
    } finally {
      setEditingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.resume) return;

    try {
      // Delete the PDF file from storage
      const { error: storageError } = await supabase.storage
        .from('resumes')
        .remove([deleteModal.resume.file_path]);

      if (storageError) throw storageError;

      // Delete the resume record from the database
      const { error: dbError } = await supabase
        .from('resumes')
        .delete()
        .eq('id', deleteModal.resume.id);

      if (dbError) throw dbError;

      // Update the local state to remove the deleted resume
      const resumeId = deleteModal.resume.id; // Store ID before async operations
      setResumes(resumes.filter(r => r.id !== resumeId));
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">My Resumes</h1>
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">My Resumes</h1>
        <div className="rounded-md bg-red-50 p-4 text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Resumes</h1>
      
      {resumes.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center text-gray-600">
          <p>No resumes saved yet.</p>
          <p className="mt-1 text-sm">Create a new resume or import an existing one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="relative flex flex-col justify-between rounded-lg border border-gray-200 p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <button
                onClick={() => setDeleteModal({ isOpen: true, resume })}
                className="absolute right-2 top-2 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Delete resume"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
              <div>
                <h3 className="font-medium text-gray-900">{resume.name}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Created {new Date(resume.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleViewResume(resume.file_path)}
                  className="flex-1 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200"
                >
                  View
                </button>
                <button
                  onClick={() => handleEdit(resume)}
                  disabled={editingId === resume.id}
                  className="flex-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                >
                  {editingId === resume.id ? (
                    <span className="flex items-center justify-center">
                      <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    'Edit'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteResumeModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, resume: null })}
        onDelete={handleDelete}
        resumeName={deleteModal.resume?.name ?? ''}
      />
    </div>
  );
} 