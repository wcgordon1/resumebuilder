"use client";
import { useState, useEffect } from 'react';
import { createClient } from 'lib/supabase/client';
import { useAuth } from 'lib/context/AuthContext';
import { Switch } from '@headlessui/react';
import { HeaderStylePicker } from '../../../components/ResumeDisplay/HeaderStylePicker';
import { GlobeAltIcon, EnvelopeIcon, PencilIcon } from '@heroicons/react/24/outline';

type ProfileSettings = {
  is_public: boolean;
  is_contact_enabled: boolean;
  public_url: string | null;
  public_resume_id: string | null;
  header_style?: {
    type: 'color' | 'gradient';
    value: string;
  };
  intro_text?: string;
};

export function ProfileSection() {
  const [settings, setSettings] = useState<ProfileSettings>({
    is_public: false,
    is_contact_enabled: true,
    public_url: null,
    public_resume_id: null,
    header_style: {
      type: 'color',
      value: '#1a365d'
    },
    intro_text: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftIntroText, setDraftIntroText] = useState('');
  const supabase = createClient();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchProfileSettings() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_public, is_contact_enabled, public_url, public_resume_id, header_style, intro_text')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        if (data) {
          setSettings(data);
        }
      } catch (error) {
        console.error('Error fetching profile settings:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfileSettings();
  }, [user]);

  useEffect(() => {
    if (settings.intro_text) {
      setDraftIntroText(settings.intro_text);
    }
  }, [settings.intro_text]);

  const handleToggleSetting = async (setting: 'is_public' | 'is_contact_enabled') => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const newValue = !settings[setting];
      
      const { error } = await supabase
        .from('profiles')
        .update({ [setting]: newValue })
        .eq('id', user.id);

      if (error) throw error;

      setSettings(prev => ({ ...prev, [setting]: newValue }));
    } catch (error) {
      console.error(`Error updating ${setting}:`, error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStyleChange = async (headerStyle: { type: 'color' | 'gradient'; value: string }) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ header_style: headerStyle })
        .eq('id', user.id);

      if (error) throw error;

      setSettings(prev => ({ ...prev, header_style: headerStyle }));
    } catch (error) {
      console.error('Error updating header style:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleIntroTextSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ intro_text: draftIntroText })
        .eq('id', user.id);

      if (error) throw error;

      setSettings(prev => ({ ...prev, intro_text: draftIntroText }));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating intro text:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const profileUrl = settings.public_url 
    ? `${window.location.origin}/p/${settings.public_url}`
    : null;

  if (isLoading) {
    return <div className="text-gray-600">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Profile Page Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your public profile page and contact settings.
        </p>
      </div>

      <div className="space-y-6">
        {/* Public Profile Status */}
        <div className="rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GlobeAltIcon className="h-6 w-6 text-gray-400" />
              <div>
                <h3 className="font-medium">Public Profile</h3>
                <p className="text-sm text-gray-500">
                  Make your profile page visible to others
                </p>
              </div>
            </div>
            <Switch
              checked={settings.is_public}
              onChange={() => handleToggleSetting('is_public')}
              disabled={!settings.public_resume_id || isSaving}
              className={`${
                settings.is_public ? 'bg-primary' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
            >
              <span className="sr-only">Enable public profile</span>
              <span
                className={`${
                  settings.is_public ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>

          {!settings.public_resume_id && (
            <p className="mt-4 text-sm text-amber-600">
              You need to publish a resume first before enabling your public profile.
            </p>
          )}

          {settings.is_public && profileUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Your public profile is available at:</p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={profileUrl}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(profileUrl);
                  }}
                  className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
                >
                  Copy
                </button>
                <button
                  onClick={() => window.open(profileUrl, '_blank')}
                  className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  View
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Contact Form Settings */}
        <div className="rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <EnvelopeIcon className="h-6 w-6 text-gray-400" />
              <div>
                <h3 className="font-medium">Contact Form</h3>
                <p className="text-sm text-gray-500">
                  Allow visitors to contact you through your profile page
                </p>
              </div>
            </div>
            <Switch
              checked={settings.is_contact_enabled}
              onChange={() => handleToggleSetting('is_contact_enabled')}
              disabled={!settings.is_public || isSaving}
              className={`${
                settings.is_contact_enabled ? 'bg-primary' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
            >
              <span className="sr-only">Enable contact form</span>
              <span
                className={`${
                  settings.is_contact_enabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>

          {!settings.is_public && (
            <p className="mt-4 text-sm text-amber-600">
              Enable your public profile first to manage contact settings.
            </p>
          )}
        </div>

        {/* Intro Text Settings */}
        <div className="rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Introduction Text</h3>
            <button
              onClick={() => {
                if (isEditing) {
                  handleIntroTextSave();
                } else {
                  setIsEditing(true);
                }
              }}
              className="rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-600 hover:bg-gray-200"
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
          {isEditing ? (
            <textarea
              value={draftIntroText}
              onChange={(e) => setDraftIntroText(e.target.value)}
              className="mt-4 w-full rounded-md border border-gray-300 p-2"
              rows={4}
              placeholder="Add a personal introduction..."
            />
          ) : (
            <p className="mt-4 text-gray-600">
              {settings.intro_text || 'No introduction text added yet.'}
            </p>
          )}
        </div>

        {/* Header Style Settings */}
        <div className="rounded-lg border border-gray-200 p-6">
          <h3 className="mb-4 font-medium">Profile Header Style</h3>
          <HeaderStylePicker
            value={settings.header_style || { type: 'color', value: '#1a365d' }}
            onChange={handleStyleChange}
          />
        </div>
      </div>
    </div>
  );
} 