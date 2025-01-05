"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "lib/supabase/client";
import { useAppDispatch } from "lib/redux/hooks";
import { setResumeData } from "lib/redux/resumeSlice";
import { SavedResume } from "../../types";
import { PublishResumeModal } from "../PublishResumeModal";
import { PublishSuccessModal } from "../PublishSuccessModal";
import { parseAndRedirectToBuilder } from "../../../lib/utils/parseAndRedirect";

export function ResumesSection() {
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState("");
  const [selectedResume, setSelectedResume] = useState<SavedResume | null>(null);
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [userName, setUserName] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const supabase = createClient();

  const fetchResumes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    if (profile) {
      setUserName(profile.full_name);
    }

    const { data: resumes } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (resumes) {
      setResumes(resumes);
    }
  };

  useEffect(() => {
    fetchResumes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditResume = async (resume: SavedResume) => {
    try {
      const resumeData = JSON.parse(resume.resume_data);
      dispatch(setResumeData(resumeData));
      router.push('/resume-builder');
    } catch (error) {
      console.error('Error parsing resume data:', error);
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this resume?');
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resumeId);

      if (error) throw error;

      // Update profiles table if this was the public resume
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('public_resume_id')
          .eq('id', user.id)
          .single();

        if (profile && profile.public_resume_id === resumeId) {
          await supabase
            .from('profiles')
            .update({
              public_resume_id: null,
              public_url: null,
              public_resume_data: null,
              is_public: false
            })
            .eq('id', user.id);
        }
      }

      // Refresh the resumes list
      fetchResumes();
    } catch (error) {
      console.error('Error deleting resume:', error);
    }
  };

  const handlePublishResume = (resume: SavedResume) => {
    setSelectedResume(resume);
    setIsPublishModalOpen(true);
  };

  const handlePublishSuccess = (url: string) => {
    setPublishedUrl(url);
    setIsSuccessModalOpen(true);
  };

  const handleImportResume = async (resume: SavedResume) => {
    try {
      if (!resume.file_path) {
        throw new Error('No file path found for this resume');
      }

      const success = await parseAndRedirectToBuilder(resume.file_path);
      if (success) {
        router.push('/resume-builder');
      }
    } catch (error) {
      console.error('Error importing resume:', error);
      alert('Failed to import resume. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Resumes</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {resumes.map((resume) => (
          <div
            key={resume.id}
            className="relative rounded-lg border border-gray-200 p-6 shadow-sm"
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold">{resume.name}</h3>
              <p className="text-sm text-gray-500">
                Last updated: {new Date(resume.updated_at).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => handleEditResume(resume)}
                className="w-full rounded-md bg-primary px-4 py-2 text-white hover:opacity-90"
              >
                Edit Resume
              </button>
              <button
                onClick={() => handlePublishResume(resume)}
                className="w-full rounded-md border border-primary bg-white px-4 py-2 text-primary hover:bg-gray-50"
              >
                Publish
              </button>
              {resume.file_path && (
                <button
                  onClick={() => handleImportResume(resume)}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-600 hover:bg-gray-50"
                >
                  Import from PDF
                </button>
              )}
              <button
                onClick={() => handleDeleteResume(resume.id)}
                className="w-full rounded-md border border-red-200 bg-white px-4 py-2 text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedResume && (
        <PublishResumeModal
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          resume={selectedResume}
          userName={userName}
          onSuccess={handlePublishSuccess}
        />
      )}

      <PublishSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        publicUrl={publishedUrl}
      />
    </div>
  );
} 