# StudyForge – GenAI Learning Studio
Summariser, Quiz generator, Infographic generator and Video generator.

## Architecture
Browser (index.html) -> /api/ai (Vercel serverless function) -> Anthropic Claude API
The API key lives only in a server environment variable, never in the browser.

## Deploy (about 5 minutes)
1. Get an API key at https://console.anthropic.com (add a few dollars of credit).
2. Create a GitHub repo and upload everything in this folder.
3. Go to https://vercel.com, sign in with GitHub, click "Add New > Project", import the repo.
4. Before deploying, open "Environment Variables" and add:
   ANTHROPIC_API_KEY = your key
   (optional) MODEL = claude-sonnet-4-6
5. Click Deploy. Your public link appears when it finishes.

## Run locally
npm i -g vercel
vercel dev      # then add ANTHROPIC_API_KEY when prompted / in .env.local

## Notes
- Video is rendered in-browser with Canvas + MediaRecorder (use Chrome); output is .webm.
- Narration uses the browser SpeechSynthesis API (not recorded into the file).
