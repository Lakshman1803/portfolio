# Lakshman — The Series (Portfolio)

Netflix-style portfolio: intro → "Who's watching?" → hero, resume, achievements, skills, projects, about, journey, contact.
Pure HTML/CSS/JS — no build step.

## Run locally
Open `index.html`, or: `python3 -m http.server 8000`

## Customize
- Add your photo as `assets/profile.jpg` (shows automatically; initials "NL" are used otherwise).
- GitHub links point to https://github.com/Lakshman1803 — change the Smart Service button to its repo URL once it exists.
- Update `assets/Lakshman_Resume.pdf` when your resume changes.

## Push to Git
```bash
cd portfolio
git init && git add . && git commit -m "Add portfolio website"
git branch -M main
git remote add origin https://github.com/Lakshman1803/portfolio.git
git push -u origin main
```
Free hosting: repo → Settings → Pages → Branch `main` / root.
