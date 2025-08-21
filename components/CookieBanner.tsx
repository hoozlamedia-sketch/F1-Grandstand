import React, { useEffect, useState } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'fg_consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const v = localStorage.getItem(STORAGE_KEY)
    if (!v) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
    // Optionally trigger GA init if needed
  }
  function decline() {
    localStorage.setItem(STORAGE_KEY, 'declined')
    setVisible(false)
  }

  if (!visible) return null
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto m-3 p-4 rounded-2xl" style={{ backgroundColor: '#111', border: '1px solid #2a2a2a' }}>
        <p className="text-sm text-neutral-300">
          We use cookies (including Google Analytics) to improve your experience. By using this site, you agree to our cookie policy. 
          Read our <Link href="/privacy" className="underline" style={{ color: '#d4b36c' }}>Privacy & Cookies</Link>.
        </p>
        <div className="mt-3 flex gap-2">
          <button onClick={accept} className="px-4 py-2 rounded-xl" style={{ backgroundColor: '#d4b36c', color: '#0c0c0c' }}>Accept</button>
          <button onClick={decline} className="px-4 py-2 rounded-xl" style={{ backgroundColor: '#181818', border: '1px solid #2a2a2a' }}>Decline</button>
        </div>
      </div>
    </div>
  )
}
