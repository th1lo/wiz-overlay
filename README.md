# OBS-Overlay

A modern, customizable overlay system for streamers, built with Next.js, shadcn/ui, and Pusher. Designed for streamers who want real-time, beautiful overlays in OBS with minimal setup and maximum performance.

## 🎯 Vision

To become the go-to platform for streamers seeking high-performance, customizable overlays that enhance their stream without compromising quality or requiring technical expertise.

## 🌟 Key Features

### Current
- **Tarkov Player Stats Overlay**
  - Real-time player statistics
  - Customizable display options
  - Performance-optimized for OBS
  - Minimal resource usage

- **Tarkov FIR Items Overlay**
  - Track Found in Raid items
  - Real-time updates
  - Customizable layout
  - Chat bot integration for moderators

### Planned
- **Chat Bot Integration**
  - Moderator commands for item tracking
  - Viewer stats lookup
  - Custom command creation
  - Moderation tools

- **Dashboard & Configuration**
  - Modern sidebar navigation
  - Block-based control interface
  - Shared configuration with moderators
  - Easy setup wizards

- **Future Overlays**
  - Spotify integration
  - General streaming tools
  - Custom overlay creation
  - Ad integration platform

## 🚀 Roadmap

### Phase 1: Foundation (Current)
- [x] Basic overlay system
- [x] Real-time updates with Pusher
- [ ] Refactored codebase
- [ ] New dashboard UI
- [ ] Improved configuration system
- [ ] Chat bot integration

### Phase 2: Growth (6-12 months)
- [ ] Spotify overlay
- [ ] Advanced customization options
- [ ] Moderation tools
- [ ] User feedback system
- [ ] Performance optimizations
- [ ] Documentation and guides

### Phase 3: Platform (1-3 years)
- [ ] Ad integration platform
- [ ] Streamer revenue sharing
- [ ] Advanced analytics
- [ ] Community features
- [ ] API for third-party integrations
- [ ] Premium features

## 🎯 Milestones

1. **100 Users**
   - Solid user base
   - Initial feedback
   - Core features validated

2. **1,000 Users**
   - Growing community
   - Feature requests
   - Platform stability

3. **10,000 Users**
   - Major platform
   - Revenue generation
   - Industry recognition

## 🛠 Technical Stack

- **Frontend**: Next.js 14, React 18, shadcn/ui
- **Real-time**: Pusher
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## 🚀 Deployment & Release Pipeline

### Environments
- **Production**: Live environment at [production-url]
- **Preview**: Staging environment at [preview-url]
- **Development**: Local development environment

### Release Process
1. **Development**
   - Feature branches from `main`
   - Regular commits with clear messages
   - Pull requests for review
   - Automated testing

2. **Preview**
   - Automatic deployment on PR merge
   - Manual testing environment
   - Performance testing
   - User acceptance testing

3. **Production**
   - Scheduled releases
   - Version tagging
   - Changelog updates
   - Performance monitoring

### Release Schedule
- **Weekly Releases**
  - Small, incremental updates
  - Bug fixes
  - Performance improvements
  - Minor features

- **Monthly Releases**
  - Major features
  - Architecture changes
  - Breaking changes
  - Platform updates

### Quality Gates
1. **Code Quality**
   - TypeScript strict mode
   - ESLint passing
   - No critical issues
   - Test coverage >80%

2. **Performance**
   - OBS resource usage <5%
   - Update latency <100ms
   - Load time <1s
   - No memory leaks

3. **User Experience**
   - No critical bugs
   - All features working
   - Smooth animations
   - Responsive design

### Monitoring
- **Performance Metrics**
  - OBS resource usage
  - Update latency
  - Error rates
  - User metrics

- **Usage Analytics**
  - Active users
  - Feature usage
  - Error tracking
  - User feedback

## 🎨 Design Principles

1. **Performance First**
   - Minimal resource usage
   - Optimized for OBS
   - Fast loading times
   - Low latency updates

2. **User Experience**
   - Simple setup process
   - Intuitive configuration
   - Clear documentation
   - Helpful error messages

3. **Customization**
   - Minimal default design
   - Easy branding integration
   - Flexible layouts
   - Theme support

4. **Reliability**
   - Stable real-time updates
   - Error handling
   - Fallback mechanisms
   - Regular backups

## 📊 Monitoring & Analytics

### Usage Tracking
- Active users count
- Overlay usage statistics
- Feature adoption rates
- User retention metrics
- Popular configuration patterns

### Performance Monitoring
- Overlay load times
- Real-time update latency
- Resource usage in OBS
- Error rates and types
- Connection stability

### Implementation Priority
1. Basic usage tracking
   - User registration
   - Overlay activation
   - Feature usage
2. Performance metrics
   - Load times
   - Update latency
   - Error tracking
3. Advanced analytics
   - User behavior
   - Performance trends
   - Usage patterns

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines and code of conduct before submitting pull requests.

## 📝 Development Process

This project is developed using AI assistance (Claude) to maintain high code quality and consistent development practices. The development process follows these principles:

1. **Code Quality**
   - TypeScript for type safety
   - ESLint for code consistency
   - Prettier for formatting
   - Regular refactoring

2. **Documentation**
   - Clear README
   - Code comments
   - API documentation
   - Setup guides

3. **Testing**
   - Unit tests
   - Integration tests
   - Performance testing
   - User testing

4. **Deployment**
   - Automated builds
   - Staging environment
   - Production monitoring
   - Regular updates

## 📫 Contact

For support, feedback, or inquiries, please use our contact form or reach out through our social media channels.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

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
