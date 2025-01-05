"use client";
import { useState, useEffect } from 'react';
import { createClient } from 'lib/supabase/client';
import { useAuth } from 'lib/context/AuthContext';
import { useSelector } from 'react-redux';
import { selectResume } from 'lib/redux/resumeSlice';

export function ProfileSection() {
  const [isPublic, setIsPublic] = useState(false);
  const [slug, setSlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const supabase = createClient();
  const { user } = useAuth();
  const resumeState = useSelector(selectResume);
  const [contactEnabled, setContactEnabled] = useState(true);

  const generateSlug = (name: string) => {
    return `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-10)}`;
  };

  const createPublicResumeData = (resumeData: any) => {
    // Create a deep copy
    const publicData = JSON.parse(JSON.stringify(resumeData));
    
    // Remove private information
    delete publicData.profile.email;
    delete publicData.profile.phone;
    
    return publicData;
  };

  const handleMakePublic = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const baseSlug = generateSlug(user.email?.split('@')[0] || 'user');
      const publicResumeData = createPublicResumeData(resumeState);
      
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          slug: baseSlug,
          is_public: true,
          public_resume_data: publicResumeData,
          contact_enabled: contactEnabled
        }, {
          onConflict: 'id'
        })
        .select('slug')
        .single();

      if (error) throw error;

      const profilePath = `/profile/${data.slug}`;
      setProfileUrl(window.location.origin + profilePath);
      setIsPublic(true);
    } catch (error) {
      console.error('Error making profile public:', error);
      setError('Failed to make profile public. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile Settings</h1>

      <div className="rounded-lg border border-gray-200 p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Public Profile</h2>
          <p className="text-gray-600">
            Make your resume information public (excluding personal details)
          </p>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="contactEnabled"
              checked={contactEnabled}
              onChange={(e) => setContactEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="contactEnabled" className="text-sm text-gray-600">
              Allow potential employers to contact me through a secure form
            </label>
          </div>

          {profileUrl ? (
            <div className="space-y-2">
              <p className="text-green-600 font-medium">Your profile is public!</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={profileUrl}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-gray-600"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(profileUrl)}
                  className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
                >
                  Copy
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleMakePublic}
              disabled={isLoading}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? 'Making Public...' : 'Make Public'}
            </button>
          )}

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
} 