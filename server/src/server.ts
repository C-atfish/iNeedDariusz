import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { Profile } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserDB } from "./db/User";
import { QueueRouter } from "./routes/Queue";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const {
  PORT = "3001",
  BASE_URL = "http://localhost:3001",
  FRONTEND_ORIGIN = "http://localhost:3000",
  GOOGLE_CLIENT_ID = "",
  GOOGLE_CLIENT_SECRET = "",
  JWT_SECRET = "change_me",
  JWT_COOKIE_NAME = "app_token",
  JWT_EXPIRES_DAYS = "7",
  NODE_ENV = "development",
} = process.env;

const isProd = NODE_ENV === "production";
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);
app.use(passport.initialize());

app.use("/api/queue", QueueRouter);

type User = { id: string; email?: string; name?: string; picture?: string };
const users = new Map<string, User>();

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${BASE_URL}/api/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile: Profile, done) => {
      try {
        const id = profile.id;
        let user: any = await UserDB.getUser(
          id,
          profile.emails?.[0]?.value || ""
        );
        if (!user) {
          if (!profile.emails?.[0]?.value) {
            console.log("NO EMAIL, save failed");

            return;
          }
          user = UserDB.saveUser(
            profile.displayName,
            profile.emails?.[0]?.value,
            id
          );
        }
        return done(null, user);
      } catch (err) {
        return done(err as any);
      }
    }
  )
);

function signToken(user: User) {
  const days = Number(JWT_EXPIRES_DAYS);
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name, picture: user.picture },
    JWT_SECRET,
    { expiresIn: `${days}d` }
  );
}

app.get(
  "/api/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/failure",
    session: false,
  }),
  (req: any, res) => {
    const token = signToken(req.user as User);
    res.cookie(JWT_COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProd, // true on HTTPS
      sameSite: isProd ? "none" : "lax", // if frontend/backend are same site in prod, Lax also ok
      maxAge: Number(JWT_EXPIRES_DAYS) * 24 * 60 * 60 * 1000,
      path: "/",
    });
    // Back to your frontend (optionally respect ?next=)
    const next = typeof req.query.next === "string" ? req.query.next : "/";
    res.redirect(`${FRONTEND_ORIGIN}${next}`);
  }
);

app.get("/api/auth/failure", (_req, res) =>
  res.status(401).send("Google sign-in failed")
);

app.get("/api/auth/me", (req, res) => {
  try {
    const raw = req.cookies[JWT_COOKIE_NAME];
    if (!raw) return res.status(401).json({ ok: false });
    const payload = jwt.verify(raw, JWT_SECRET);
    return res.json({ ok: true, user: payload });
  } catch {
    return res.status(401).json({ ok: false });
  }
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie(JWT_COOKIE_NAME, { path: "/" });
  res.status(204).end();
});

const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", async (socket: any) => {
  console.log("Socket connected");

  socket.on("chat:message", (msg: any) => {
    socket.broadcast.emit("chat:message", msg);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

server.listen(Number(PORT), () => {
  console.log(`API on http://localhost:${PORT}`);
  console.log(`Google callback: ${BASE_URL}/api/auth/google/callback`);
});
