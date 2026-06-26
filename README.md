# OG Chess Frontend

OG Chess Frontend is a responsive, highly polished Next.js application built with **React 19**, **Zustand**, **Tailwind CSS**, and **Socket.io-client**. It provides an interactive chess client with real-time matchmaking, local optimistic move predictions, custom Chess.com sound effects, game history tracking, and a player leaderboard dashboard.

---

## Technology Stack

- **Framework**: Next.js (v16 App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Sockets**: Socket.io-client
- **Components**: shadcn/ui components (Radix UI) & Lucide Icons

---

## Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher recommended)
- **npm** (v10 or higher)

---

## Step-by-Step Local Setup

### 1. Install Dependencies
Navigate to the frontend directory and install the packages:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root of the `og-chess-frontend` folder to point the client to your NestJS backend:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Run the Development Server
Start Next.js in development mode:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## Available Scripts

- **`npm run dev`**: Starts the development server with Hot Module Replacement (HMR).
- **`npm run build`**: Creates an optimized production build of the Next.js application.
- **`npm run start`**: Starts the compiled production server.
- **`npm run lint`**: Inspects all code for ESLint warnings.

---

## Key Features & UI Sections

### 1. Rooms Dashboard (`/rooms`)
- **Host a Match**: Generate a shareable room link after selecting your color preference (White, Black, or Random).
- **Join via Code**: Paste a room code to immediately join an active chess room.
- **Match History**: Read previous matches from a paginated table supporting room search. Clicking any row navigates you straight to the room to watch or play.
- **Leaderboard Navigation**: Quick link button to view the player standings.

### 2. Chess Gameplay Room (`/play/[roomId]`)
- **Dynamic Board Flipping**: Automatically flips the board perspective depending on whether you are playing as White or Black.
- **Move Constraints**: Only allows dragging and dropping your own pieces on your turn.
- **Optimistic State Updates**: Instantly updates the board on drop for zero-latency gameplay, rolling back changes if the server validates the move as illegal.
- **Chess.com Sound Pack**: Plays move, capture, check, and checkmate sound effects locally:
  - *Autoplay unblocker*: Unlocks the browser's audio context on the first user interaction to guarantee programmatic socket sound playbacks work across all browsers.
  - *Double-play fix*: Compares FEN states synchronously inside the Zustand store to make sure only the opponent plays the sound on socket broadcasts, keeping active-player sound playbacks strictly singular.
- **Match Interactivity**: Draw banners allowing players to Accept/Decline draw offers, and immediate defeat triggers on Resignation.
- **Moves List Panel**: Shows the chronological list of moves made during the game.

### 3. Leaderboard (`/leaderboard`)
- Ranks players according to matches won (1 win = 1 point).
- Features medal icons (Gold, Silver, Bronze) for the Top 3 players.
- Includes a debounced search bar to search for players by name or email, along with pagination controls.
- Fully supports responsive viewport scaling and automatic Light/Dark mode styling depending on the user's system preferences.
