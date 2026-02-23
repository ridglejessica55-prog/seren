import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("community.db");

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    author TEXT,
    content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    likes INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    postId TEXT,
    author TEXT,
    content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(postId) REFERENCES posts(id)
  );
`);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  app.use(express.json());

  // API Routes
  app.get("/api/posts", (req, res) => {
    const posts = db.prepare("SELECT * FROM posts ORDER BY timestamp DESC").all();
    res.json(posts);
  });

  app.post("/api/posts", (req, res) => {
    const { id, author, content } = req.body;
    db.prepare("INSERT INTO posts (id, author, content) VALUES (?, ?, ?)").run(id, author, content);
    const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(id);
    io.emit("post:created", post);
    res.json(post);
  });

  app.get("/api/posts/:postId/comments", (req, res) => {
    const comments = db.prepare("SELECT * FROM comments WHERE postId = ? ORDER BY timestamp ASC").all(req.params.postId);
    res.json(comments);
  });

  app.post("/api/posts/:postId/comments", (req, res) => {
    const { id, author, content } = req.body;
    const postId = req.params.postId;
    db.prepare("INSERT INTO comments (id, postId, author, content) VALUES (?, ?, ?, ?)").run(id, postId, author, content);
    const comment = db.prepare("SELECT * FROM comments WHERE id = ?").get(id);
    io.emit("comment:created", { postId, comment });
    res.json(comment);
  });

  app.post("/api/posts/:postId/like", (req, res) => {
    db.prepare("UPDATE posts SET likes = likes + 1 WHERE id = ?").run(req.params.postId);
    const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.postId);
    io.emit("post:updated", post);
    res.json(post);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
