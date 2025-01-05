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
        }
      }
    };

    loadResumeData();
  }, [dispatch, router, searchParams, supabase]);

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
