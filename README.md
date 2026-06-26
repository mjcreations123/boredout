# BoredOut

A progressive web app for bored people to find things to do nearby and people to do them with.

Tap **"I'm bored!"** and BoredOut picks an activity for you based on your interests, the time of day, and the weather. Browse activities, match with people, make plans, chat, and level up as you go.

## Features

- **One-tap boredom cure** — smart suggestion engine (interests × time of day × live weather)
- **Discover** — personalized "Picked for you" row, categories, search, and filters
- **People** — browse or Tinder-style quick match with drag-to-swipe
- **Plans** — create plans, RSVP, invite friends
- **Friends & chat** — friend requests, live-feeling chat with typing indicators
- **Gamification** — XP, levels, daily streaks, badges, and a local leaderboard
- **Installable PWA** — add to your home screen, works offline
- **Light / dark / auto** theme

## Tech

Pure static site — no build step, no backend. HTML + CSS + vanilla JavaScript, with `localStorage` for persistence. Free APIs only (Open-Meteo for weather, Nominatim for reverse geocoding).

## Run locally

Serve the folder with any static server, e.g.:

```
npx serve .
```

Then open the printed URL.

## Deploy

Pushing to the connected GitHub repo auto-deploys to Netlify.
