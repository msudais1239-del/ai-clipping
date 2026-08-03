// Worker now runs ffmpeg on local uploaded files when present.
const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

async function runCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) return reject({ err, stdout, stderr })
      resolve({ stdout, stderr })
    })
  })
}

async function processJob(jobPath) {
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'))
  if (job.status && job.status !== 'queued') return
  console.log('Processing job', job.id)

  try {
    // if there's a savedFilePath, create a 15s clip starting at 00:00:10
    if (job.savedFilePath && fs.existsSync(job.savedFilePath)) {
      const input = job.savedFilePath
      const outDir = path.resolve('outputs')
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)
      const outFile = path.join(outDir, `${job.id}_clip.mp4`)

      // create a 15 second clip at 00:00:10, scale for vertical format as example
      const cmd = `ffmpeg -y -i "${input}" -ss 00:00:10 -t 15 -c:v libx264 -c:a aac -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" "${outFile}"`
      console.log('Running:', cmd)
      await runCommand(cmd)

      job.status = 'completed'
      job.output = outFile
      job.completedAt = new Date().toISOString()
      fs.writeFileSync(jobPath, JSON.stringify(job, null, 2))
      console.log('Job completed, output at', outFile)
      return
    }

    // If there's a vodUrl, we currently do not download VODs automatically.
    // Future: integrate youtube-dl/yt-dlp to fetch remotes.
    job.status = 'no_input'
    job.completedAt = new Date().toISOString()
    fs.writeFileSync(jobPath, JSON.stringify(job, null, 2))
    console.log('Job marked no_input for', job.id)
  } catch (err) {
    console.error('Error processing job', job.id, err)
    job.status = 'error'
    job.error = String(err)
    job.completedAt = new Date().toISOString()
    fs.writeFileSync(jobPath, JSON.stringify(job, null, 2))
  }
}

async function main() {
  console.log('Worker started — scanning jobs directory')
  const jobsDir = path.resolve('jobs')
  if (!fs.existsSync(jobsDir)) fs.mkdirSync(jobsDir)

  while (true) {
    try {
      const files = fs.readdirSync(jobsDir)
      for (const f of files) {
        if (!f.endsWith('.json')) continue
        const jobPath = path.join(jobsDir, f)
        await processJob(jobPath)
      }
    } catch (err) {
      console.error('Worker loop error', err)
    }
    // sleep 8s
    await new Promise(r => setTimeout(r, 8000))
  }
}

main().catch(err => console.error(err))
