CREATE TABLE threeaday_users (
    id SERIAL PRIMARY KEY,
    user_name TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    date_created TIMESTAMP NOT NULL DEFAULT now(),
    date_modified TIMESTAMP
);

CREATE TABLE threeaday_entries (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    public BOOLEAN NOT NULL DEFAULT true,
    user_id INTEGER REFERENCES threeaday_users(id),
    date_modified TIMESTAMP NOT NULL DEFAULT now(),
    tag_amusement BOOLEAN DEFAULT false,
    tag_awe BOOLEAN DEFAULT false,
    tag_contentment BOOLEAN DEFAULT false,
    tag_gratitude BOOLEAN DEFAULT false,
    tag_inspiration BOOLEAN DEFAULT false,
    tag_joy BOOLEAN DEFAULT false,
    tag_hope BOOLEAN DEFAULT false,
    tag_love BOOLEAN DEFAULT false,
    tag_pride BOOLEAN DEFAULT false,
    tag_serenity BOOLEAN DEFAULT false,
    tag_other TEXT
);