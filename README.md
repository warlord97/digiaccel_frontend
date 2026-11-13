# To-Do List: Mobile-first Web App

A responsive to-do app built with React and Tailwind CSS. Tasks are organised by week (Monday to Sunday), with open and completed counts for each week. Users can create, edit, delete and search tasks, and mark them as completed or in progress.

**Live app:** `https://<your-site>.netlify.app`
**Backend repo:** `<link to backend repo>`
**Live API:** `https://<your-service>.onrender.com`
**Design reference:** [Figma](https://www.figma.com/design/mz2PJoTwa5DxYrdrFPem3f/To-Do-List-Mobileapp)

> The API runs on a free Render instance that sleeps when idle. If the app shows an error or loads slowly at first, wait about 30 seconds and reload.

## Features

- Weekly cards (Monday to Sunday) showing open and completed task counts. Tap a card to expand its tasks
- Current week summary: completed and pending stat cards with a progress bar
- Create a task with title and date and time (required), plus description and priority (optional)
- Edit any task field, using the same form as create
- Mark tasks as completed or in progress with a checkbox. Counts update immediately
- Delete tasks by **swiping left** on touch devices, or with the trash button
- Search tasks by title or description, with edit and delete available from the results
- Loading, empty and error states
- Responsive from small phones to desktop

## Tech stack

- React (Vite)
- Tailwind CSS v4
- Native `fetch` for API calls

There is no router, state library, date library or UI kit. The app has one main screen with two overlays, so the extra dependencies would only add weight.

## Project structure

```
client/
  src/
    main.jsx
    index.css                 # Tailwind import and theme colours
    App.jsx                   # page layout, data loading, modal and search state
    api/tasks.js              # all API calls in one place
    utils/date.js             # week start, formatting and input helpers
    components/
      WeekCard.jsx            # expandable weekly card
      TaskItem.jsx            # task row: checkbox, edit, delete, swipe
      TaskModal.jsx           # create and edit form
      SearchPanel.jsx         # debounced search overlay
      Icons.jsx               # inline SVG icons
```

## Getting started

**Prerequisites:** Node.js 18 or newer, and the [backend](`<link to backend repo>`) running locally.

```bash
git clone <this-repo-url>
cd <repo-folder>
npm install
cp .env.example .env     # then set the API URL
npm run dev
```

The app runs on `http://localhost:5173`.

### Environment variables

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend, with no trailing slash | `http://localhost:5000` |

Vite reads `VITE_` variables at build time. After changing one, restart the dev server or redeploy. The backend's `CLIENT_URL` must match the address you open the app on, otherwise the browser blocks requests (CORS).

### Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build |

## How to use the app

| Action | How |
|---|---|
| Add a task | Tap the blue **+** button |
| Edit a task | Tap the pencil icon on the task |
| Mark complete | Tick the checkbox. Untick to move it back to in progress |
| Delete a task | **Touch devices:** swipe the task left and tap **Delete**. **Mouse or desktop:** click the trash icon |
| Search | Tap the magnifier in the header and type a keyword |
| View a week | Tap a weekly card to expand or collapse it |

### About swipe to delete

Swipe-to-delete follows the product flow in the brief, and it uses touch events, so it works with a finger on a phone or tablet. A mouse cannot swipe, which is also true when you shrink a desktop browser window to a narrow width. For that reason a trash button is visible on every screen size, and both methods do the same thing.

To test the swipe on a desktop, open browser DevTools, turn on device mode, **reload the page**, then click and drag on a task row to the left.

## Design decisions

**Mobile-first responsive layout.** Base classes target phones, and `sm:`, `md:` and larger prefixes enhance the layout. The app sits in a centered column (`max-w-md`, widening on tablet and desktop) so it does not stretch across wide screens. The page height uses `dvh` units so mobile browser toolbars do not hide bottom controls.

**Add and edit form.** On phones the form is a bottom sheet, and from the `sm` breakpoint up it becomes a centered dialog. One component handles both create and edit.

**Weekly cards follow the brief.** The Figma home screen shows a day strip and a Tasks Today list. The assignment asks for weekly cards with open and completed counts, so the home screen is built around weeks. The Figma styling is reused: colours, stat cards, progress bar, rounded corners and the floating add button. The onboarding frame is not part of the build.

**Weeks are computed by the API.** The frontend sends its timezone with the summary request, so Monday to Sunday matches the user's local week. A week's tasks load only when its card is expanded, using the same boundaries (`from` and `to`).

**The current week always appears.** Even when it has no tasks, the current week card is shown, so the home screen never looks empty.

**Simple data flow.** One `version` counter in `App.jsx` acts as a refresh signal. Any create, edit, status change or delete bumps it, and the weekly summary, open week cards and search results all refetch. This keeps the state easy to follow, without a global store or cache.

**Debounced search.** Search waits 300 ms after the user stops typing before calling the API. It uses `setTimeout` with the `useEffect` cleanup to cancel the previous timer, so typing a word makes one request instead of one per letter.

**API layer in one file.** Components never build URLs or handle raw responses. `api/tasks.js` wraps `fetch`, throws the server's error message on failures and returns `null` for empty `204` responses.

**Native date handling.** The form uses `<input type='datetime-local'>`. Small helpers in `utils/date.js` convert between local input values and ISO timestamps, and calculate week boundaries without a date library.

**Accessibility basics.** Icon-only buttons have `aria-label`s, the search input is focused on open, and controls are at least touch-friendly in size.

## Deployment

The app is deployed on Netlify.

1. Create a new Netlify site from this repo. Build command `npm run build`, publish directory `dist`.
2. Add the environment variable `VITE_API_URL` with the deployed backend URL.
3. After the first deploy, set the backend's `CLIENT_URL` to the Netlify URL.

## Known limitations and future improvements

- No authentication, so all users share one task list
- No pagination for very large weeks
- Search runs on the server with a regex, which is fine for this size of data
- Possible additions: optimistic updates, drag and drop between weeks, overdue highlighting, a loading skeleton, and component tests

## Author

`Shubham Yadav` | `shubhamyadav81197@gmail.com`