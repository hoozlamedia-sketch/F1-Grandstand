import Layout from '../components/Layout'
import React, { useState } from 'react'

const EMAIL = 'f1grandstandtv@gmail.com'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  function openMail() {
    const subject = encodeURIComponent(`Message from ${name || 'F1 Grandstand visitor'}`)
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}${email ? ` <${email}>` : ''}`)
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`
  }

  return (
    <Layout title="Contact" description="Get in touch with F1 Grandstand. Tips, corrections, and partnerships welcome.">
      <section className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold mb-4" style={{ color: '#f5e9c8' }}>Contact</h1>
        <p className="text-neutral-300 mb-6">
          Prefer email? Reach us at <a href={`mailto:${EMAIL}`} className="underline" style={{ color: '#d4b36c' }}>{EMAIL}</a>.
        </p>

        <div className="p-5 rounded-2xl space-y-3" style={{ backgroundColor: '#0f0f0f', border: '1px solid #2a2a2a' }}>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Your name</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Jane Doe" className="w-full rounded-xl px-3 py-2 outline-none" style={{ backgroundColor: '#111', border: '1px solid #2a2a2a' }} />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Your email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com" className="w-full rounded-xl px-3 py-2 outline-none" style={{ backgroundColor: '#111', border: '1px solid #2a2a2a' }} />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Message</label>
            <textarea value={message} onChange={e=>setMessage(e.target.value)} rows={6} placeholder="Your message..." className="w-full rounded-xl px-3 py-2 outline-none" style={{ backgroundColor: '#111', border: '1px solid #2a2a2a' }} />
          </div>
          <div className="flex gap-2">
            <button onClick={openMail} className="px-5 py-2 rounded-xl" style={{ backgroundColor: '#d4b36c', color: '#0c0c0c' }}>Email us</button>
            <a href={`mailto:${EMAIL}`} className="px-5 py-2 rounded-xl" style={{ backgroundColor: '#181818', border: '1px solid #2a2a2a' }}>Open mail app</a>
          </div>
        </div>
      </section>
    </Layout>
  )
}
