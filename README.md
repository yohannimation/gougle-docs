# Gougle docs

A Google-docs app like, using `socket-io` to edit a document with multi-editors.<br/>
Support markdown and styling features.

>   This project is a educational project.<br/>
    Don't use it to save your personal data.<br/>
    Each hour, the documents created will be removed.

## 🧰 Tech Stack

### Frontend

- ⚙️ Next.JS - Front-end framework
- 🟦 TypeScript - Type safety
- 💠 Shadcn - UI component library
- 📄 TipTap - Text editor library

### Backend

- ⚙️ Node.JS - Back-end framework
- 🟦 TypeScript - Type safety
- 🛣️ Express - API structure
- 🔗 Socket.io - Websocket link

## Structure

```
.
├── backend/
│   ├── Dockerfile
│   └── .env
├── frontend/
│   └── Dockerfile
├── compose.yaml
├── .env
└── README.md
```

## Installation

### Clone repo

```
git clone <repo>
cd gougle-docs
```

### Edit `.env` files

- Rename the `.env.dist` file to `.env` in the project root and backend folder.
- Edit the files to set the values.

## Docker

### Build the containers

Download images and create volumes : ```docker compose up --build```

### Start containers

To start the project containers : ```docker compose up```

### Stop containers

To stop the project containers : ```docker compose down```

### Go to one container

- Frontend : ```docker compose exec -it frontend sh```
- Backend : ```docker compose exec -it backend sh```

### Prisma migration

The compose will generate the prisma TypeScript.<br/>
To generate the table we must execute a migration : ```docker-compose exec backend npx prisma db push```

## 