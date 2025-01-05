export const DASHBOARD_SECTIONS = [
  { id: "resumes", label: "My Resumes" },
  { id: "profile", label: "Profile Page" },
  { id: "import", label: "Resume Importer" },
  { id: "build", label: "Build Fresh" },
] as const;

export const BOTTOM_SECTIONS = [
  { id: "billing", label: "Billing" },
  { id: "settings", label: "Account Settings" },
] as const;

export type SectionId = 
  | (typeof DASHBOARD_SECTIONS)[number]["id"] 
  | (typeof BOTTOM_SECTIONS)[number]["id"]; 

export type SavedResume = {
  id: string;
  name: string;
  created_at: string;
  file_path: string;
  resume_data: string;
  user_id: string;
}; 