// Simple API route that proxies login to backend during local dev
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL || ''
  const r = await fetch(`${backend}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
  const data = await r.json()
  res.status(r.status).json(data)
}
