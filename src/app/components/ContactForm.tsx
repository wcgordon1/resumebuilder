"use client";
import { useState } from 'react';

type ContactFormProps = {
  profileSlug: string;
};

export function ContactForm({ profileSlug }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          profileSlug,
          name: formData.get('name'),
          email: formData.get('email'),
          company: formData.get('company'),
          message: formData.get('message')
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      setSuccess(true);
      form.reset();
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
        <input
          type="text"
          name="company"
          id="company"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
        <textarea
          name="message"
          id="message"
          required
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-primary px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>

      {success && (
        <p className="text-green-600">Message sent successfully!</p>
      )}

      {error && (
        <p className="text-red-600">{error}</p>
      )}
    </form>
  );
} 