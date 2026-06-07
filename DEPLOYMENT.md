This repository can be deployed either as a static site or as a Node web service on Render.

Quick steps — push to GitHub

1. Initialize git (if not already):

```bash
git init
git add .
git commit -m "Initial commit - make repo ready for GitHub and Render"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

Deploy to Render (recommended: Web Service using Node)

1. Go to https://dashboard.render.com and create a new "Web Service".
2. Connect your GitHub account and pick this repository.
3. Render will read `render.yaml` — build command: `npm install`, start command: `npm start`.
4. Render will run `npm install` and then `node server.js` to serve the app.

Alternative: Deploy as a Static Site on Render

1. Create a new "Static Site" on Render and connect the repo.
2. Set the publish directory to `/` (or the folder containing `index.html`).
3. No start command is needed.

Local testing

Install dependencies then run locally:

```bash
npm install
npm start
# open http://localhost:3000
```

Files added/edited for deployment:
- [server.js](server.js#L1)
- [package.json](package.json#L1)
- [.gitignore](.gitignore#L1)
- [render.yaml](render.yaml#L1)
