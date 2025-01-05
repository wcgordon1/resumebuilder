"use client";
import { ResumeDropzone } from 'components/ResumeDropzone';
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ImportSection() {
  const [hasAddedResume, setHasAddedResume] = useState(false);
  
  const onFileUrlChange = (fileUrl: string) => {
    setHasAddedResume(Boolean(fileUrl));
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Resume Importer</h1>
      <div className="mt-8 rounded-md border border-gray-200 px-10 py-10 text-center shadow-md">
        <h2 className="text-lg font-semibold text-gray-900">
          Import data from an existing resume
        </h2>
        <ResumeDropzone
          onFileUrlChange={onFileUrlChange}
          className="mt-5"
        />
        {!hasAddedResume && (
          <>
            <OrDivider />
            <SectionWithHeadingAndCreateButton />
          </>
        )}
      </div>
    </div>
  );
}

const OrDivider = () => (
  <div className="mx-[-2.5rem] flex items-center pb-6 pt-8" aria-hidden="true">
    <div className="flex-grow border-t border-gray-200" />
    <span className="mx-2 mt-[-2px] flex-shrink text-lg text-gray-400">or</span>
    <div className="flex-grow border-t border-gray-200" />
  </div>
);

const SectionWithHeadingAndCreateButton = () => {
  const router = useRouter();

  const handleCreateNew = () => {
    // Clear ALL resume-related data from localStorage
    const keysToRemove = [
      "resume-state",
      "hasUsedAppBefore",
      "lastSavedResume",
      "resumeTheme",
      "settings",
      "showResumePDF"
    ];

    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Force a clean state by setting initial values
    localStorage.setItem("hasUsedAppBefore", "false");
    
    // Navigate to resume builder
    router.push("/resume-builder");
    router.refresh(); // Force a refresh to ensure clean state
  };

  return (
    <>
      <p className="font-semibold text-gray-900">Don't have a resume yet?</p>
      <div className="mt-5">
        <button
          onClick={handleCreateNew}
          className="outline-theme-blue rounded-full bg-sky-500 px-6 pb-2 pt-1.5 text-base font-semibold text-white"
        >
          Create from scratch
        </button>
      </div>
    </>
  );
}; 