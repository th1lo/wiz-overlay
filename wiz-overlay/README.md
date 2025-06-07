This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

### 🎥 How to Add the Overlay to OBS

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
5. Set the **Width** and **Height** to match your stream layout (e.g., 1920x1080 for full HD).
6. Click **OK** to add the overlay.
7. Position and resize the overlay as needed in your scene.

> **Tip:**
> If you are developing locally, you can use `http://localhost:3000/overlay/fir-items` instead, but this will only work on your own computer while the dev server is running.
