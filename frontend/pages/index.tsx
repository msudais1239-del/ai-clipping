import React, {useState} from 'react'
import axios from 'axios'
import Head from 'next/head'

export default function Home() {
  const [url, setUrl] = useState('')
  const [file, setFile] = useState(null)
  const [token, setToken] = useState('')
  const [status, setStatus] = useState('')

  async function login() {
    try {
      const res = await axios.post('/api/login', { email: 'neon32206@gmail.com', password: process.env.NEXT_PUBLIC_DEFAULT_PASSWORD || 'changeme123' })
      setToken(res.data.token)
      setStatus('Logged in')
    } catch (err) {
      setStatus('Login failed')
    }
  }

  async function submit() {
    if (!token) { setStatus('Please login first'); return }
    const form = new FormData()
    if (url) form.append('vodUrl', url)
    if (file) form.append('file', file)

    setStatus('Submitting job...')
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL || ''}/ingest`, form, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      })
      setStatus('Job queued: ' + res.data.jobId)
    } catch (err) {
      setStatus('Submit failed')
    }
  }

  return (
    <main style={{ padding: 18, fontFamily: 'system-ui, -apple-system, Roboto, sans-serif' }}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>AI Clipping — Mobile</title>
      </Head>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>AI Clipping</h1>
        <p style={{ marginTop: 0, marginBottom: 12, color: '#666' }}>Create clips from uploads or VOD URLs. Private — single-user.</p>

        <button onClick={login} style={{ width: '100%', padding: 12, fontSize: 16, borderRadius: 8, background: '#0ea5e9', color: 'white', border: 'none' }}>Login (single-user)</button>

        <div style={{ marginTop: 16 }}>
          <input placeholder="VOD URL (Twitch/YouTube)" value={url} onChange={e=>setUrl(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
        </div>
        <div style={{ marginTop: 8 }}>
          <input type="file" onChange={e=>setFile(e.target.files[0])} style={{ width: '100%' }} />
        </div>
        <div style={{ marginTop: 12 }}>
          <button onClick={submit} style={{ width: '100%', padding: 12, fontSize: 16, borderRadius: 8, background: '#06b6d4', color: 'white', border: 'none' }}>Submit</button>
        </div>
        <div style={{ marginTop: 12, fontSize: 14, color: '#333' }}>Status: {status}</div>
      </div>
    </main>
  )
}
