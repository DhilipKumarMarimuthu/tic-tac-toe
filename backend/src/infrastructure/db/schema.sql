CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS players (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR (100) UNIQUE NOT NULL,
    wins        INTEGER NOT NULL DEFAULT 0,
    losses      INTEGER NOT NULL DEFAULT 0,
    draws       INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS games (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_x_id   UUID NOT NULL REFERENCES players(id),
    player_o_id   UUID REFERENCES players(id),
    board         JSONB NOT NULL DEFAULT '[null,null,null,null,null,null,null,null,null]',
    current_turn  CHAR(1) NOT NULL DEFAULT 'X',
    status        VARCHAR(10) NOT NULL DEFAULT 'waiting',
    result        VARCHAR(4),
    winner_id     UUID REFERENCES players(id),
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);