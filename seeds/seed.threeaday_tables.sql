BEGIN;

TRUNCATE
    threeaday_entries,
    threeaday_users
    RESTART IDENTITY CASCADE
;

INSERT INTO threeaday_users (user_name, password)
VALUES
    ('eleanor.s', '$2a$12$NGxi3ntjrfXvHhljMMYPruOnd7B6jsrTZmV9AYjAKxilUJNjkinIa'),
    ('chidi.a', '$2a$12$I967Jk5tsOAx3t5wrOO./ekrnSIYi4Ow6jX6a4CnPN26KjTly42Ka'),
    ('tahani.aj', '$2a$12$3Iu0vXtJcE7QOzrkHOP5Xu3z2LZ7FFidfIX53cSrf/GOWBuMLnolW'),
    ('jason.m', '$2a$12$hZLjPRWQbFcYsXkQ8tGkZuro.p05GoT8xYX0LsfLk0c.FR4dCUzT.'),
    ('michael', '$2a$12$GQywine8tbnbFr/JTrx9.OWmdOrPTVIS1CW2FpFQk8k1DryhyFvKC'),
    ('janet', '$2a$12$43rg7zamDxVOVIahb/gArOVkHSeFLqBV4z9jSuxZqMunoWMRsNo7m')
;

INSERT INTO threeaday_entries (content, public, user_id, date_modified, tag_awe)
    VALUES ('I saw a rainbow today!', true, 1, now() - '20 days'::INTERVAL, true);
INSERT INTO threeaday_entries (content, public, user_id, date_modified, tag_gratitude)
    VALUES ('There was free shrimp at the buffet.', true, 1, now() - '10 days'::INTERVAL, true);
INSERT INTO threeaday_entries (content, public, user_id, date_modified, tag_love)
    VALUES ('Chidi and I kissed under a tree!', false, 1, now() - '5 days'::INTERVAL, true);

INSERT INTO threeaday_entries (content, public, user_id, date_modified, tag_serenity)
    VALUES ('I smelled a beautiful flower today.', true, 2, now() - '18 days'::INTERVAL, true);
INSERT INTO threeaday_entries (content, public, user_id, date_modified, tag_gratitude)
    VALUES ('I got Peeps for half off at the store!', true, 2, now() - '8 days'::INTERVAL, true);
INSERT INTO threeaday_entries (content, public, user_id, date_modified, tag_love)
    VALUES ('Eleanor and I kissed under a tree!', false, 2, now() - '5 days'::INTERVAL, true);

INSERT INTO threeaday_entries (content, public, user_id, date_modified, tag_inspiration)
    VALUES ('I looked absolutely gorgeous in my Chanel dress at the ball.', true, 3, now() - '16 days'::INTERVAL, true);
INSERT INTO threeaday_entries (content, public, user_id, date_modified, tag_pride)
    VALUES ('I threw a lovely party that strengthened the neighborhood community.', true, 3, now() - '6 days'::INTERVAL, true);
INSERT INTO threeaday_entries (content, public, user_id, date_modified, tag_hope)
    VALUES ('I have started making amends with my otherwise wretched sister...', false, 3, now() - '3 days'::INTERVAL, true);

INSERT INTO threeaday_entries (content, public, user_id, date_modified, tag_pride)
    VALUES ('I killed it at the dance competition', true, 4, now() - '14 days'::INTERVAL, true);
INSERT INTO threeaday_entries (content, public, user_id, date_modified, tag_inspiration)
    VALUES ('I am in a very entrepreneurial community', true, 4, now() - '4 days'::INTERVAL, true);
INSERT INTO threeaday_entries (content, public, user_id, date_modified, tag_amusement)
    VALUES ('I do not know where I am, which is kind of exciting!', false, 4, now() - '2 days'::INTERVAL, true);

INSERT INTO threeaday_entries (content, public, user_id, date_modified, tag_hope)
    VALUES ('I am starting to make friends with folks who are different from me', true, 5, now() - '12 days'::INTERVAL, true);
INSERT INTO threeaday_entries (content, public, user_id, date_modified, tag_inspiration)
    VALUES ('I stood up to my abusive boss', true, 5, now() - '2 days'::INTERVAL, true);
INSERT INTO threeaday_entries (content, public, user_id, date_modified, tag_contentment)
    VALUES ('I no longer feel bad about being a demon!', false, 5, now() - '24 hours'::INTERVAL, true);

INSERT INTO threeaday_entries (content, public, user_id, date_modified, tag_other)
    VALUES ('Sometimes I feel bad or neutral, but today I felt good', true, 6, now() - '11 days'::INTERVAL, 'not a robot');
INSERT INTO threeaday_entries (content, public, user_id, date_modified, tag_other)
    VALUES ('My friend asked me a question and I was able to help give him the answer', true, 6, now() - '1 days'::INTERVAL, 'not a robot');
INSERT INTO threeaday_entries (content, public, user_id, date_modified, tag_other)
    VALUES ('I am not a robot!', false, 6, now() - '5 hours'::INTERVAL, 'not a robot');

COMMIT;
