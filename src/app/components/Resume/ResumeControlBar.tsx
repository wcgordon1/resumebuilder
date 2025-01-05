"use client";
import { useEffect, useState } from "react";
import { useSetDefaultScale } from "components/Resume/hooks";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { usePDF } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import { SaveResumeModal } from './SaveResumeModal';
import { createClient } from 'lib/supabase/client';
import { useAuth } from 'lib/context/AuthContext';
import { useSelector } from 'react-redux';
import { selectResume } from 'lib/redux/resumeSlice';
import { selectSettings } from 'lib/redux/settingsSlice';

const ResumeControlBar = ({
  scale,
  setScale,
  documentSize,
  document,
  fileName,
}: {
  scale: number;
  setScale: (scale: number) => void;
  documentSize: string;
  document: JSX.Element;
  fileName: string;
}) => {
  const { scaleOnResize, setScaleOnResize } = useSetDefaultScale({
    setScale,
    documentSize,
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'save' | 'download'>('save');
  const supabase = createClient();
  const { user } = useAuth();
  const resumeState = useSelector(selectResume);
  const settingsState = useSelector(selectSettings);

  const [instance, update] = usePDF({ document });

  // Hook to update pdf when document changes
  useEffect(() => {
    update();
  }, [update, document]);

  const handleSaveResume = async (name: string) => {
    try {
      if (!user && modalType === 'save') {
        throw new Error("Must be logged in to save resume");
      }

      if (!instance.url) {
        throw new Error("PDF not generated yet");
      }

      if (modalType === 'download') {
        return instance.url;
      }

      // Only proceed with Supabase upload if it's a save action
      const response = await fetch(instance.url);
      const pdfBlob = await response.blob();

      // Create unique filename
      const timestamp = Date.now();
      const storagePath = `${user!.id}/${timestamp}-${name.replace(/[^a-zA-Z0-9-_.]/g, '_')}.pdf`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(storagePath, pdfBlob, {
          contentType: 'application/pdf',
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Failed to upload resume: ${uploadError.message}`);
      }

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(storagePath);

      // Save resume metadata to database with current resume AND settings state
      const { error: dbError } = await supabase
        .from('resumes')
        .insert({
          name,
          user_id: user!.id,
          file_path: storagePath,
          resume_data: JSON.stringify(resumeState),
          settings_data: JSON.stringify(settingsState)
        });

      if (dbError) {
        // If database insert fails, try to clean up the uploaded file
        await supabase.storage
          .from('resumes')
          .remove([storagePath]);
        
        console.error('Database insert error:', dbError);
        throw new Error(`Failed to save resume metadata: ${dbError.message}`);
      }

    } catch (error) {
      console.error('Error saving resume:', error);
      throw error;
    }
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 flex h-[var(--resume-control-bar-height)] items-center justify-between px-[var(--resume-padding)] text-gray-600">
      <div className="flex items-center gap-2">
        <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
        <input
          type="range"
          min={0.5}
          max={1.5}
          step={0.01}
          value={scale}
          onChange={(e) => {
            setScaleOnResize(false);
            setScale(Number(e.target.value));
          }}
        />
        <div className="w-10">{`${Math.round(scale * 100)}%`}</div>
        <label className="hidden items-center gap-1 lg:flex">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4"
            checked={scaleOnResize}
            onChange={() => setScaleOnResize((prev) => !prev)}
          />
          <span className="select-none">Autoscale</span>
        </label>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setModalType('save');
            setShowModal(true);
          }}
          className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
        >
          Save
        </button>
        <button
          onClick={() => {
            setModalType('download');
            setShowModal(true);
          }}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Download
        </button>
      </div>

      <SaveResumeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveResume}
        type={modalType}
      />
    </div>
  );
};

/**
 * Load ResumeControlBar client side since it uses usePDF, which is a web specific API
 */
export const ResumeControlBarCSR = dynamic(
  () => Promise.resolve(ResumeControlBar),
  {
    ssr: false,
  }
);

export const ResumeControlBarBorder = () => (
  <div className="absolute bottom-[var(--resume-control-bar-height)] w-full border-t-2 bg-gray-50" />
);
