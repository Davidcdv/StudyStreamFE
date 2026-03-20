# StudyStream Frontend

StudyStream is a student-focused music and productivity app built with React, TypeScript, and Vite. It combines a music dashboard with Pomodoro-based focus sessions, ambient background sound, productivity tracking, and a cleaner auth-gated experience designed for study use rather than general music streaming.

## What The App Does

- Public landing page at `/` that introduces the product and encourages sign-in
- Protected dashboard at `/app`
- Focus Mode with:
  - 25-minute Pomodoro session flow
  - music playback
  - ambient background sound
  - distraction shield
  - productivity tracking
  - weekly focus trend
- Admin dashboard for managing songs and albums
- Clerk authentication for identity and protected access

## Main Features

### Focus Mode

- Start, pause, resume, and reset a study session
- Auto-play a study playlist
- Choose ambient sound:
  - Rain
  - White Noise
  - Cafe
  - Off
- Adjust ambient sound volume separately from the music player
- Hide non-essential panels with the distraction shield during an active session

### Productivity

- Track total focus time
- Track completed sessions
- Display a simple weekly focus trend chart
- Show a personal focus insights panel

### Playback

- Play, pause, next, and previous
- Seek through the current song
- Shuffle playback
- Repeat the current track
- Adjust music volume and mute/unmute

### Authentication

- Public landing page for visitors
- Protected app experience for signed-in users
- Redirect signed-in users into the dashboard
- Sign-out returns users to the landing page

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Zustand
- Tailwind CSS
- Clerk
- Axios
- Radix UI primitives

## Project Structure

- `src/App.tsx` - app routes
- `src/pages/landing/` - public landing page
- `src/pages/home/` - signed-in dashboard
- `src/pages/focus/` - Focus Mode
- `src/pages/admin/` - admin dashboard
- `src/layout/` - sidebar, insights panel, and player layout
- `src/stores/` - Zustand stores for auth, focus, player, music, and realtime state

## Routes

- `/` - public landing page
- `/app` - protected dashboard
- `/focus` - protected focus mode
- `/albums/:albumId` - protected album page
- `/admin` - protected admin area
- `/sso-callback` - Clerk OAuth callback
- `/auth-callback` - post-auth sync route

## Local Development

### Install dependencies

```bash
npm install
```

### Configure environment variables

Set your local `.env` like this:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:5001/api
VITE_CLERK_FRONTEND_API=your_clerk_frontend_api
```

### Start the app

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

## Backend

This frontend expects a separate backend service for:

- auth sync
- songs
- albums
- admin actions
- focus session persistence

The backend base URL is controlled with:

```env
VITE_API_URL=...
```

## Deployment Notes

### Frontend environment variables

For production hosting, set:

```env
VITE_API_URL=https://your-backend-url.com/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### Render static-site rewrite

If you deploy on Render as a static site, add this rewrite rule:

- Source: `/*`
- Destination: `/index.html`
- Action: `Rewrite`

This is required so React Router routes like `/app`, `/focus`, `/sso-callback`, and `/auth-callback` load correctly.

### Clerk

Make sure Clerk includes your frontend callback URLs:

- `/sso-callback`
- `/auth-callback`

## Current Positioning

StudyStream is best described as a polished student productivity and focus-music app prototype. The main product experience is built around Focus Mode and study support rather than general music streaming.
