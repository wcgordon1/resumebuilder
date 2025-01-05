"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  
  useEffect(() => {
    const supabase = createClient()
    
    // Check auth status
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        router.push('/resume-builder') // Or wherever you want verified users to go
      }
    })
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Verifying your email...</p>
    </div>
  )
} 