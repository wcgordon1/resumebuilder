"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Providers } from "./components/Providers";
import { Sidebar } from "./components/Sidebar";
import { ResumesSection } from "./components/sections/ResumesSection";
import { ProfileSection } from "./components/sections/ProfileSection";
import { ImportSection } from "./components/sections/ImportSection";
import type { SectionId } from "./types";

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const section = searchParams.get("section") as SectionId;
  const currentSection = section || "resumes";

  const handleSectionChange = (sectionId: SectionId) => {
    router.push(`/dashboard?section=${sectionId}`);
  };

  const renderSection = () => {
    switch (currentSection) {
      case "resumes":
        return <ResumesSection />;
      case "profile":
        return <ProfileSection />;
      case "import":
        return <ImportSection />;
      case "settings":
        return <div>Settings</div>;
      default:
        return <ResumesSection />;
    }
  };

  return (
    <Providers>
      <div className="flex">
        <Sidebar
          isOpen={isOpen}
          currentSection={currentSection}
          onSectionChange={handleSectionChange}
        />
        <main className="min-h-[calc(100vh-var(--top-nav-bar-height))] w-full bg-gray-50 p-8">
          {renderSection()}
        </main>
      </div>
    </Providers>
  );
} 