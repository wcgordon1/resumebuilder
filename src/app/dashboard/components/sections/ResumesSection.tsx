"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@heroicons/react/24/outline";
import { createClient } from "lib/supabase/client";
import { useAppDispatch } from "lib/redux/hooks";
import { setResumeData } from "lib/redux/resumeSlice";
import { setSettings } from "lib/redux/settingsSlice";
import { SavedResume } from "../../types";
import { PublishResumeModal } from "../PublishResumeModal";
import { PublishSuccessModal } from "../PublishSuccessModal";
import { parseAndRedirectToBuilder } from "../../../lib/utils/parseAndRedirect";
import { DeleteResumeModal } from "../DeleteResumeModal";

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
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<SavedResume | null>(null);

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
      setIsLoading({ ...isLoading, [resume.id]: true });
      const resumeData = JSON.parse(resume.resume_data);
      console.log('Loaded resume data:', resumeData);
      
      // Update resume data
      dispatch(setResumeData(resumeData));
      
      // Update settings/theme if they exist in the saved data
      if (resumeData.settings) {
        console.log('Found settings:', resumeData.settings);
        dispatch(setSettings(resumeData.settings));
      } else {
        console.log('No settings found in resume data');
      }
      
      router.push(`/resume-builder?id=${resume.id}`);
    } catch (error) {
      console.error('Error parsing resume data:', error);
      alert('Failed to load resume. Please try again.');
    } finally {
      setIsLoading({ ...isLoading, [resume.id]: false });
    }
  };

  const handleDeleteResume = (resume: SavedResume) => {
    setResumeToDelete(resume);
    setIsDeleteModalOpen(true);
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

  const handleViewPDF = (filePath: string) => {
    const { data: { publicUrl } } = supabase.storage
      .from('resumes')
      .getPublicUrl(filePath);
    
    window.open(publicUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Resumes</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {resumes.map((resume) => (
          <div
            key={resume.id}
            className="relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <button
              onClick={() => handleDeleteResume(resume)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
              title="Delete Resume"
            >
              <TrashIcon className="h-5 w-5" />
            </button>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{resume.name}</h3>
              <p className="mt-1 text-sm text-gray-500">
                Last updated: {new Date(resume.updated_at).toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleEditResume(resume)}
                  disabled={isLoading[resume.id]}
                  className="rounded-md bg-primary px-4 py-2 text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isLoading[resume.id] ? 'Loading...' : 'Edit'}
                </button>
                {resume.file_path && (
                  <button
                    onClick={() => handleViewPDF(resume.file_path!)}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    View
                  </button>
                )}
              </div>
              <button
                onClick={() => handlePublishResume(resume)}
                className="w-full rounded-md border border-primary bg-white px-4 py-2 text-primary transition-colors hover:bg-gray-50"
              >
                Publish
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

      {resumeToDelete && (
        <DeleteResumeModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          resume={resumeToDelete}
          onSuccess={() => {
            fetchResumes();
            setResumeToDelete(null);
          }}
        />
      )}
    </div>
  );
} 