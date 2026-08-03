import React, {useState} from 'react'
import axios from 'axios'

export default function Home() {
  const [url, setUrl] = useState('')
  const [file, setFile] = useState(null)
  const [token, setToken] = useState('')
  const [status, setStatus] = useState('')

  async function login() {
    const res = await axios.post('/api/login', { email: 'neon32206@gmail.com', password: process.env.NEXT_PUBLIC_DEFAULT_PASSWORD || 'changeme123' })
    setToken(res.data.token)
    setStatus('Logged in')
  }

  async function submit() {
    if (!token) { setStatus('Please login first'); return }
    const form = new FormData()
    if (url) form.append('vodUrl', url)
    if (file) form.append('file', file)

    setStatus('Submitting job...')
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL || ''}/ingest`, form, {
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
    })
    setStatus('Job queued: ' + res.data.jobId)
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>AI Clipping — Starter</h1>
      <button onClick={login}>Login (single-user)</button>
      <div style={{ marginTop: 16 }}>
        <input placeholder="VOD URL (Twitch/YouTube)" value={url} onChange={e=>setUrl(e.target.value)} style={{ width: 480 }} />
      </div>
      <div style={{ marginTop: 8 }}>
        <input type="file" onChange={e=>setFile(e.target.files[0])} />
      </div>
      <div style={{ marginTop: 8 }}>
        <button onClick={submit}>Submit</button>
      </div>
      <div style={{ marginTop: 16 }}>Status: {status}</div>
    </main>
  )
}
