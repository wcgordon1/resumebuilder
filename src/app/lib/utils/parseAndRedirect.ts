import { createClient } from '../supabase/client';

export async function parseAndRedirectToBuilder(filePath: string) {
  try {
    const supabase = createClient();
    
    // Get signed URL for the file
    const { data, error: urlError } = await supabase.storage
      .from('resumes')
      .createSignedUrl(filePath, 60); // 60 seconds is enough for parsing

    if (urlError) throw urlError;
    if (!data) throw new Error('Failed to get file URL');

    // Fetch the PDF file
    const response = await fetch(data.signedUrl);
    const blob = await response.blob();

    // Create a File object from the blob
    const file = new File([blob], 'resume.pdf', { type: 'application/pdf' });

    // Create FormData and append file
    const formData = new FormData();
    formData.append('file', file);

    // Send to our parser endpoint
    const parseResponse = await fetch('/api/parse-resume', {
      method: 'POST',
      body: formData,
    });

    if (!parseResponse.ok) {
      throw new Error('Failed to parse resume');
    }

    const resumeData = await parseResponse.json();

    // Store parsed data in localStorage
    localStorage.setItem('resume-state', JSON.stringify(resumeData));
    localStorage.setItem('hasUsedAppBefore', 'true');

    // Return true to indicate success
    return true;
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw error;
  }
} 