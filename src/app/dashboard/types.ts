export const DASHBOARD_SECTIONS = [
  { id: "resumes" as const, label: "My Resumes" },
  { id: "profile" as const, label: "Profile" },
  { id: "import" as const, label: "Import Resume" },
] as const;

export const BOTTOM_SECTIONS = [
  { id: "settings" as const, label: "Settings" },
] as const;

export type SectionId = "resumes" | "profile" | "import" | "settings";

export type SavedResume = {
  id: string;
  user_id: string;
  name: string;
  resume_data: string;
  file_path?: string;
  updated_at: string;
}; 