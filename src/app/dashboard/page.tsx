"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Sidebar } from "./components/Sidebar";
import { ResumesSection } from "./components/sections/ResumesSection";
import { ProfileSection } from "./components/sections/ProfileSection";
import { ImportSection } from "./components/sections/ImportSection";
import { BuildSection } from "./components/sections/BuildSection";
import { BillingSection } from "./components/sections/BillingSection";
import { SettingsSection } from "./components/sections/SettingsSection";
import { type SectionId } from "./types";
import { Providers } from "./components/Providers";

export default function DashboardPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentSection = (searchParams.get("section") as SectionId) || "resumes";

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleSectionChange = (sectionId: SectionId) => {
    if (sectionId === "build") {
      router.push("/resume-builder");
    } else {
      router.push(`/dashboard?section=${sectionId}`);
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case "resumes":
        return <ResumesSection />;
      case "profile":
        return <ProfileSection />;
      case "import":
        return <ImportSection />;
      case "build":
        return <BuildSection />;
      case "billing":
        return <BillingSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <ResumesSection />;
    }
  };

  return (
    <Providers>
      <div className="flex h-[calc(100vh-var(--top-nav-bar-height))]">
        <button
          onClick={toggleSidebar}
          className="fixed right-4 top-20 z-50 rounded-md bg-white p-2 shadow-md lg:hidden"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>

        <Sidebar
          isOpen={isSidebarOpen}
          currentSection={currentSection}
          onSectionChange={handleSectionChange}
        />

        <main className="flex-1 overflow-auto p-6">
          {renderSection()}
        </main>
      </div>
    </Providers>
  );
} 