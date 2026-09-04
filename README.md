# StayUp Conversation App

StayUp is a React conversation-starter library for people who are already talking through WhatsApp, FaceTime, normal calls, DMs or in person. One person opens the site, finds a prompt, then copies it or says it aloud.

The product name is temporary. Change `APP_NAME` in `src/config.js` and the page title in `index.html` when the final name is ready.

## Included

- Friends and Relationship modes on every category
- 1,000 distinct prompt cards per mode for every conversation category
- 1,000 distinct prompt cards per mode for every game category
- Truth or Dare includes 1,000 Truth prompts plus 1,000 Dare prompts per mode
- 50,000 prompt cards across both modes
- Relationship stages: Talking Stage, New Relationship, Been Together a While, Long-Term, Married
- Intensity filters: Chill, Interesting, Deep, No Filter, plus Flirty and Spicy in Relationship mode
- General and 18+ audience controls
- General Spirituality and Christian filters for Faith & Spirituality
- Search across the prompt library
- Copy, Share, Save, Previous, Random and Give me another one actions
- Focus mode for long calls and chats
- Favourites, history, seen prompts and last position saved in localStorage
- No account, room, score system or multiplayer requirement
- Mobile-first responsive layout plus full desktop workspace
- Separate accent treatment for Friends and Relationship modes

## Games

- Truth & Dare
- Never Have I Ever
- Two Truths & A Lie
- Kiss, Marry, Avoid
- What Would You Do?
- If You Had To Choose
- Who Is More Likely To?
- How Well Do You Know Me?
- Finish the Sentence

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

The production build runs `scripts/expand-to-1000.mjs` before Vite so the full 1,000-prompt pools and matching UI counts stay in sync.

The project uses Vite and React only. No backend is required for the current version.
