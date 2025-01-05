import { createClient } from 'lib/supabase/server';
import { notFound } from 'next/navigation';
import { ContactForm } from 'components/ContactForm';
import { ProfileHeader } from '../../components/ResumeDisplay/ProfileHeader';
import { WorkHistory } from '../../components/ResumeDisplay/WorkHistory';
import { Education } from '../../components/ResumeDisplay/Education';
import { Skills } from '../../components/ResumeDisplay/Skills';

export default async function PublicProfilePage({
  params: { id }
}: {
  params: { id: string }
}) {
  const supabase = createClient();

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*, public_resume_data')
      .eq('public_url', id)
      .eq('is_public', true)
      .single();

    if (error || !profile || !profile.public_resume_data) {
      return notFound();
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl bg-white shadow-sm">
          <ProfileHeader
            name={profile.public_resume_data.profile.name}
            location={profile.public_resume_data.profile.location}
            summary={profile.public_resume_data.profile.summary}
            headerStyle={profile.header_style}
            introText={profile.intro_text}
          />

          <div className="space-y-8 px-8 py-6">
            <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4">
              <h4 className="mb-2 font-mono text-sm text-red-500">Full Supabase Profile Data:</h4>
              <pre className="whitespace-pre-wrap break-words text-xs text-red-700">
                {JSON.stringify(profile, null, 2)}
              </pre>
            </div>

            <Skills 
              skills={profile.public_resume_data.skills}
              headerStyle={profile.header_style}
            />

            <WorkHistory 
              experiences={profile.public_resume_data.workExperiences} 
              headerStyle={profile.header_style}
            />

            <Education 
              educations={profile.public_resume_data.educations}
              headerStyle={profile.header_style}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading profile:', error);
    return notFound();
  }
} 