# Tic-Tac-Toe Game

It's a complete multiplayer Tic-Tac-Toe game where two players are automatically matched. They can play in real-time using WebSocket, and the game results are saved in a PostgreSQL database.

## Technology Stack

- Backend -> Node, TypeScript, Express, WebSocket and PostgreSQL runs in Docker
- FrontEnd-> React, TypeScript, Redux Toolkit, React Router, Axios, WebSocket
- Database-> PostgreSQL

## Local Development Setup

### 1. Prerequisites
```bash
- Node.js [I have used v22.17.1]
- npm [11.6.2]
- Docker and Docker Compose (used to run PostgreSQL)
- Git
```

### 2. Clone the Repository

```bash
git clone git@github.com:DhilipKumarMarimuthu/tic-tac-toe.git

```


### 3. Start PostgreSQL

```bash
cd tic-tac-toe
docker-compose up -d
```

### 4. Run the backend

```bash
cd backend
cp .env.local .env
npm install
npm run dev  # http://localhost:3001
```

### 5. Run the frontend

```bash
cd frontend
npm install
npm run dev  # http://localhost:5173
```

### 6. How it works
Open http://localhost:5173 in two browser tabs (or two browsers) to play.

- A player enters their name and clicks Find Match.
- The backend either creates a new waiting game or atomically joins an existing one (SELECT FOR UPDATE SKIP LOCKED prevents matchmaking races).
- Both players receive real-time updates via WebSocket (subscribe → game_start → game_update → game_over).
- Moves are submitted over HTTP. The backend validates turn order and win conditions, then broadcasts the new state to both clients.
- Game result and player stats (wins / losses / draws) are persisted in PostgreSQL.
- The Rankings page shows the top five players ordered by wins.

### 7. Assumptions

Assumptions have already been discussed with Long Mai.

- Haven't implemented Authentication as part of this assignment
- Haven't implemented unit & integration testing
- Haven't implemented storybook