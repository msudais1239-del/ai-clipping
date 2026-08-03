import express from 'express'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 8080
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_with_strong_secret'
const DEFAULT_EMAIL = process.env.DEFAULT_USER_EMAIL || 'neon32206@gmail.com'
const DEFAULT_PASSWORD = process.env.DEFAULT_USER_PASSWORD || 'changeme123'

// Multer setup for uploads
const upload = multer({ dest: 'uploads/' })

function generateToken(email: string) {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: '7d' })
}

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body
  if (email === DEFAULT_EMAIL && password === DEFAULT_PASSWORD) {
    return res.json({ token: generateToken(email) })
  }
  return res.status(401).json({ error: 'invalid credentials' })
})

function authMiddleware(req, res, next) {
  const h = req.headers['authorization'] as string
  if (!h) return res.status(401).json({ error: 'no auth' })
  const parts = h.split(' ')
  if (parts.length !== 2) return res.status(401).json({ error: 'invalid auth' })
  const token = parts[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'invalid token' })
  }
}

// Simple ingest endpoint: accepts vodUrl or file upload
app.post('/ingest', authMiddleware, upload.single('file'), async (req, res) => {
  const vodUrl = req.body.vodUrl
  let savedFilePath = null
  if (req.file) {
    savedFilePath = path.resolve(req.file.path)
  }

  // TODO: queue job to worker. For now, return a dummy job id and store minimal metadata
  const jobId = 'job_' + Date.now()
  const job = { id: jobId, vodUrl, savedFilePath, status: 'queued', createdAt: new Date().toISOString() }
  // Save job to jobs directory for now
  if (!fs.existsSync('jobs')) fs.mkdirSync('jobs')
  fs.writeFileSync(path.join('jobs', jobId + '.json'), JSON.stringify(job, null, 2))

  return res.json({ jobId })
})

app.get('/job/:id', authMiddleware, (req, res) => {
  const id = req.params.id
  const p = path.join('jobs', id + '.json')
  if (!fs.existsSync(p)) return res.status(404).json({ error: 'not found' })
  const data = JSON.parse(fs.readFileSync(p, 'utf8'))
  return res.json(data)
})

app.listen(PORT, () => console.log(`Backend listening on ${PORT}`))
