"use client";
import { Provider } from "react-redux";
import { store } from "lib/redux/store";
import { ResumeForm } from "components/ResumeForm";
import { Resume } from "components/Resume";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "lib/supabase/client";
import { useAppDispatch } from "lib/redux/hooks";
import { setResumeData } from "lib/redux/resumeSlice";
import { setSettings } from "lib/redux/settingsSlice";

function ResumeBuilder() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const supabase = createClient();
  const searchParams = useSearchParams();

  useEffect(() => {
    const loadResumeData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
        return;
      }

      // Get resume ID from URL
      const resumeId = searchParams.get('id');
      if (resumeId) {
        // Load resume data from Supabase
        const { data: resume } = await supabase
          .from('resumes')
          .select('resume_data')
          .eq('id', resumeId)
          .single();

        if (resume) {
          const resumeData = JSON.parse(resume.resume_data);
          dispatch(setResumeData(resumeData));
          
          // Update settings/theme if they exist
          if (resumeData.settings) {
            dispatch(setSettings(resumeData.settings));
          }
        }
      }
    };

    loadResumeData();
  }, [dispatch, router, searchParams, supabase]);

  const saveResume = async (resumeData: any, settings: any) => {
    const resumeId = searchParams.get('id');
    if (!resumeId) return;

    try {
      const fullResumeData = {
        ...resumeData,
        settings: settings
      };

      const { error: updateError } = await supabase
        .from('resumes')
        .update({
          resume_data: JSON.stringify(fullResumeData),
          updated_at: new Date().toISOString()
        })
        .eq('id', resumeId);

      if (updateError) throw updateError;
    } catch (err) {
      console.error('Error auto-saving resume:', err);
    }
  };

  useEffect(() => {
    const autoSave = async () => {
      const resumeData = store.getState().resume;
      const settings = store.getState().settings;
      await saveResume(resumeData, settings);
    };

    // Auto-save every 30 seconds
    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative h-full w-full overflow-hidden bg-gray-50">
      <div className="grid grid-cols-3 md:grid-cols-6">
        <div className="col-span-3">
          <ResumeForm />
        </div>
        <div className="col-span-3">
          <Resume />
        </div>
      </div>
    </main>
  );
}

export default function Create() {
  return (
    <Provider store={store}>
      <ResumeBuilder />
    </Provider>
  );
}
