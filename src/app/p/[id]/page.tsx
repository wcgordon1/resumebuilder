import { createClient } from 'lib/supabase/server';
import { notFound } from 'next/navigation';
import { ContactForm } from 'components/ContactForm';

export default async function PublicProfilePage({
  params: { id }
}: {
  params: { id: string }
}) {
  console.log('Attempting to load profile with id:', id);
  const supabase = createClient();

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('public_url', id)
      .eq('is_public', true)
      .single();

    console.log('Profile data:', profile);

    if (error || !profile || !profile.public_resume_data) {
      console.error('Profile fetch error:', error);
      return notFound();
    }

    const resumeData = profile.public_resume_data;
    const userName = resumeData.profile?.name || 'Anonymous';

    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="prose max-w-none">
            <h1>{userName}'s Resume</h1>
            <div className="whitespace-pre-wrap">
              {JSON.stringify(resumeData, null, 2)}
            </div>
          </div>

          {profile.is_contact_enabled && (
            <div className="rounded-lg border border-gray-200 p-6">
              <h2 className="mb-4 text-xl font-bold">Contact</h2>
              <ContactForm profileSlug={id} />
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading profile:', error);
    return notFound();
  }
} 