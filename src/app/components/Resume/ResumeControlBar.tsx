"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "lib/supabase/client";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectSettings } from "lib/redux/settingsSlice";
import { SaveResumeModal } from "./SaveResumeModal";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSetDefaultScale } from "components/Resume/hooks";
import dynamic from "next/dynamic";

type ResumeControlBarProps = {
  scale: number;
  setScale: (scale: number) => void;
  documentSize: string;
  document: JSX.Element;
  fileName: string;
};

export function ResumeControlBar({ scale, setScale, documentSize, document, fileName }: ResumeControlBarProps) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const resumeData = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);
  const { scaleOnResize, setScaleOnResize } = useSetDefaultScale({
    setScale,
    documentSize,
  });

  // Get resumeId from URL if it exists (for updates)
  const resumeId = searchParams.get('id');

  const handleSave = () => {
    setShowModal(true);
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
          onClick={() => router.push('/dashboard?section=resumes')}
          className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
        >
          Back
        </button>
        <button
          onClick={handleSave}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Save Resume
        </button>
      </div>

      <SaveResumeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        resumeId={resumeId || undefined}
      />
    </div>
  );
}

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
