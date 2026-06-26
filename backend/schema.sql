-- BoredOut — D1 (SQLite) schema
-- Timestamps are unix epoch seconds (INTEGER); booleans are 0/1 INTEGERs.
-- Array/JSON columns (interests, people, badges, xp_log) are stored as JSON TEXT.

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email         TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  password_hash TEXT,
  initials      TEXT NOT NULL DEFAULT '',
  color         TEXT NOT NULL DEFAULT '#5C7152',
  bio           TEXT DEFAULT '',
  location      TEXT DEFAULT 'Nearby',
  mood          TEXT DEFAULT 'Down for anything',
  interests     TEXT NOT NULL DEFAULT '[]',
  is_bot        INTEGER NOT NULL DEFAULT 0,
  last_seen     INTEGER NOT NULL DEFAULT (unixepoch()),
  created_at    INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS activities (
  id          INTEGER PRIMARY KEY,
  cat         TEXT,
  emoji       TEXT,
  title       TEXT,
  location    TEXT,
  dist        TEXT,
  time        TEXT,
  cost        TEXT,
  going       INTEGER NOT NULL DEFAULT 0,
  badge       TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS activity_joins (
  user_id     TEXT NOT NULL,
  activity_id INTEGER NOT NULL,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch()),
  PRIMARY KEY (user_id, activity_id)
);

CREATE TABLE IF NOT EXISTS activity_ratings (
  user_id     TEXT NOT NULL,
  activity_id INTEGER NOT NULL,
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  PRIMARY KEY (user_id, activity_id)
);

CREATE TABLE IF NOT EXISTS plans (
  id         TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id    TEXT NOT NULL,
  title      TEXT,
  cat        TEXT,
  month      TEXT,
  day        TEXT,
  time       TEXT,
  location   TEXT,
  notes      TEXT DEFAULT '',
  people     TEXT NOT NULL DEFAULT '[]',
  rsvp       TEXT DEFAULT 'going',
  status     TEXT DEFAULT 'pending',
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS friend_requests (
  from_id    TEXT NOT NULL,
  to_id      TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  PRIMARY KEY (from_id, to_id)
);

CREATE TABLE IF NOT EXISTS friendships (
  user_id    TEXT NOT NULL,
  friend_id  TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  PRIMARY KEY (user_id, friend_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id           TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  sender_id    TEXT NOT NULL,
  recipient_id TEXT NOT NULL,
  text         TEXT NOT NULL,
  seen         INTEGER NOT NULL DEFAULT 0,
  sent_at      INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS user_stats (
  user_id       TEXT PRIMARY KEY,
  xp            INTEGER NOT NULL DEFAULT 0,
  streak        INTEGER NOT NULL DEFAULT 1,
  last_active   TEXT,
  last_checkin  TEXT,
  joins         INTEGER NOT NULL DEFAULT 0,
  friends_count INTEGER NOT NULL DEFAULT 0,
  plans_count   INTEGER NOT NULL DEFAULT 0,
  rates         INTEGER NOT NULL DEFAULT 0,
  msgs          INTEGER NOT NULL DEFAULT 0,
  bored_uses    INTEGER NOT NULL DEFAULT 0,
  badges        TEXT NOT NULL DEFAULT '[]',
  xp_log        TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS notifications (
  id         TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id    TEXT NOT NULL,
  text       TEXT,
  icon       TEXT,
  type       TEXT,
  is_read    INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_messages_sender    ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_sent      ON messages(sent_at);
CREATE INDEX IF NOT EXISTS idx_notifs_user        ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_plans_user         ON plans(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_user   ON friendships(user_id);
CREATE INDEX IF NOT EXISTS idx_friend_requests_to ON friend_requests(to_id);
