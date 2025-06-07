# OBS Overlays

A modern, customizable overlay system for Escape from Tarkov, built with Next.js, shadcn/ui, Upstash Redis, and Pusher. Designed for streamers and content creators who want real-time, beautiful overlays in OBS.

---

## ⚡️ Project Rule #1

> **The assistant will always make all necessary fixes and improvements automatically, without asking the user for implementation details. The assistant will only ask clarifying questions if absolutely necessary.**

---

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000)

---

## 🔌 Real-Time Updates with Pusher

This project uses [Pusher Channels](https://pusher.com/channels) for real-time overlay updates, which works reliably on Vercel's free tier.

### Setup
1. Create a free account at [pusher.com](https://pusher.com/).
2. Create a new Channels app (choose your region/cluster).
3. Copy your App ID, Key, Secret, and Cluster from the Pusher dashboard.
4. Add these to your `.env.local` (or `.env`) file:
   ```env
   PUSHER_APP_ID=your_app_id
   PUSHER_SECRET=your_app_secret
   NEXT_PUBLIC_PUSHER_KEY=your_app_key
   NEXT_PUBLIC_PUSHER_CLUSTER=your_app_cluster
   ```
5. **Important:** Do not use quotes around the values. Restart your dev server after editing the env file.

---

## 🎥 How to Add the Overlay to OBS

1. **Open OBS Studio.**
2. In the **Sources** panel, click the **+** button and select **Browser**.
3. Name your source (e.g., `Tarkov Overlay`) and click **OK**.
4. In the **URL** field, enter the overlay link you want to use:
   - **FIR Items Overlay:**  
     `https://wiz-overlay.vercel.app/overlay/fir-items`
   - **Player Stats Overlay:**  
     `https://wiz-overlay.vercel.app/overlay/player-stats`
   - **Full Overlay:**  
     `https://wiz-overlay.vercel.app/overlay`
5. Set the **Width** and **Height** to match your stream layout (e.g., 1920x1080 for full HD, or use the recommended size in the admin panel).
6. Click **OK** to add the overlay.
7. Position and resize the overlay as needed in your scene.

> **Tip:**
> For local development, use `http://localhost:3000/overlay/fir-items` (works only on your own computer while the dev server is running).

---

## 🗂️ Codebase Structure

- **/components/**
  - `FIRItemsOverlay.tsx` — FIR item overlay logic
  - `PlayerStatsOverlay.tsx` — Player stats overlay logic
  - `overlayConfig.tsx` — Overlay item/stat config
  - `types.ts` — Shared types
- **/app/page.tsx** — Admin panel (overlay management, preview, settings)
- **/app/overlay/** — Overlay routes for OBS
- **/app/api/socket/route.ts** — API route for real-time updates (Pusher)
- **/lib/pusher.ts** — Pusher server config (Node.js only)
- **/lib/pusherClient.ts** — Pusher client config (browser only)
- **/lib/hooks/useSocket.ts** — React hook for real-time overlay updates
- **/data/** — Persistent data (Upstash Redis)
- **/public/** — Static assets (images, video, etc.)

---

## 🛠️ Implementation History (Changelog)

- **2024-06-07**: Major UI/UX refactor, shadcn/ui components, dark mode, settings modal, preview improvements, background video restored, overlays positioned in corners.
- **2024-06-06**: Overlay scaling, dynamic size recommendations, admin panel preview, improved OBS instructions.
- **2024-06-05**: Initial Next.js app, FIR Items and Player Stats overlays, Upstash Redis integration, basic admin panel.
- **2024-06-08**: Switched to Pusher for real-time updates, improved codebase structure, added Project Rule #1.

---

## 🚀 Roadmap / Planned Features

- [x] **WebSocket Live Updates (Pusher):**
      - Push real-time stat/item changes to overlays without polling.
- [ ] **Twitch Bot Integration:**
      - Allow chat commands to update overlays (e.g., !addkill, !firitem).
- [ ] **More Overlay Types:**
      - Boss spawns, timers, custom widgets.
- [ ] **User Authentication:**
      - Secure admin panel, multi-user support.
- [ ] **Overlay Themes:**
      - Light/dark, color customization, font options.
- [ ] **Mobile Admin Panel:**
      - Responsive controls for on-the-go management.
- [ ] **Better Error Handling & Logging**
- [ ] **Automated Testing & CI/CD**

---

## 🤝 Contributing / Dev Notes

- All overlay logic is in `/components/FIRItemsOverlay.tsx` and `/components/PlayerStatsOverlay.tsx`.
- Admin panel is in `/app/page.tsx`.
- Overlay routes are in `/app/overlay/`.
- Uses Upstash Redis for persistent config/stats.
- Styling: Tailwind CSS + shadcn/ui.
- Real-time: Pusher Channels (see setup above).
- For local dev, ensure you have a `.env.local` or `.env` with Upstash and Pusher credentials if needed.

---

**Made with ❤️ by th1lo and contributors.**
