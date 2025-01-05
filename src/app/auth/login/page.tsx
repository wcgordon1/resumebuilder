"use client"
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '../../lib/supabase/client'
import Image from 'next/image'
import logoSrc from "public/logopo.png"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.push('/resume-builder')
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <Image
            src={logoSrc}
            alt="Prosper.cv Logo"
            className="h-12 w-auto"
            priority
          />
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#2041A4',
                  brandAccent: '#1835A0',
                }
              }
            }
          }}
          providers={['google']}
          redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/resume-builder`}
          view="sign_in"
        />
      </div>
    </div>
  )
} 