"use client";
import { cx } from "lib/cx";
import { DASHBOARD_SECTIONS, BOTTOM_SECTIONS, type SectionId } from "../types";
import { createClient } from "lib/supabase/client";
import { useRouter } from "next/navigation";

type SidebarProps = {
  isOpen: boolean;
  currentSection: SectionId;
  onSectionChange: (section: SectionId) => void;
};

export function Sidebar({ isOpen, currentSection, onSectionChange }: SidebarProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
      router.refresh(); // Force a refresh to update auth state
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div
      className={cx(
        "fixed inset-y-[var(--top-nav-bar-height)] left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <nav className="flex h-full flex-col gap-1 p-4">
        <div className="flex-1">
          {DASHBOARD_SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onSectionChange(id)}
              className={cx(
                "w-full rounded-md px-4 py-2 text-left text-sm font-medium transition-colors",
                currentSection === id
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="space-y-1">
          {BOTTOM_SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onSectionChange(id)}
              className={cx(
                "w-full rounded-md px-4 py-2 text-left text-sm font-medium transition-colors",
                currentSection === id
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full rounded-md bg-red-50 px-4 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
} 