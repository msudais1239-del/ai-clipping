Updated backend Dockerfile to include ffmpeg, worker to run ffmpeg on uploaded files, mobile-friendly frontend page, and render.yaml manifest for Render deployment.

Notes:
- Worker will only clip local uploaded files (not remote VOD URLs). To support VOD URLs, integrate yt-dlp to download first.
- Change DEFAULT_USER_PASSWORD and JWT_SECRET in Render settings after deploy.
