BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "films" (
	"id"	INTEGER,
	"title"	TEXT NOT NULL,
	"favorite"	INTEGER NOT NULL DEFAULT (0),
	"watchdate"	TEXT,
	"rating"	INTEGER,
    "user"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT) 
);
CREATE TABLE IF NOT EXISTS "users" (
	"id"	INTEGER NOT NULL,
	"email"	TEXT NOT NULL,
	"name"	TEXT,
	"hash"	TEXT NOT NULL,
	"salt"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);

INSERT INTO "users" VALUES (1,'u1@p.it','John','15d3c4fca80fa608dcedeb65ac10eff78d20c88800d016369a3d2963742ea288','72e4eeb14def3b21');
INSERT INTO "users" VALUES (2,'u2@p.it','Alice','1d22239e62539d26ccdb1d114c0f27d8870f70d622f35de0ae2ad651840ee58a','a8b618c717683608');
INSERT INTO "users" VALUES (3,'u3@p.it','George','61ed132df8733b14ae5210457df8f95b987a7d4b8cdf3daf2b5541679e7a0622','e818f0647b4e1fe0');

-- Insert some movies for Alice (user id 1)
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('Inception', 1, '2023-01-15', 5, 1);
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('Titanic', 0, '2023-02-20', 4, 1);
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('Star Wars: A New Hope', 0, NULL, NULL, 1);
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('Interstellar', 1, '2023-03-25', 5, 1);
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('The Dark Knight', 1, '2023-04-01', 5, 1);
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('Pulp Fiction', 1, '2023-03-10', 5, 1);
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('The Matrix', 0, '2023-04-12', 5, 1);
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('Fight Club', 0, '2023-05-05', 4, 1);
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('Forrest Gump', 1, '2023-06-20', 5, 1);
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('The Shawshank Redemption', 1, '2023-07-10', 5, 1);

-- Insert some movies for Bob (user id 2)
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('The Godfather', 1, '2023-01-05', 5, 2);
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('Goodfellas', 0, '2023-02-12', 4, 2);
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('Casino', 0, NULL, 3, 2);
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('Reservoir Dogs', 1, '2023-03-04', 4, 2);
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('Heat', 0, '2023-03-22', 4, 2);
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('Scarface', 1, '2023-04-10', 4, 2);
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('American Gangster', 0, '2023-04-30', 3, 2);
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('The Departed', 1, '2023-05-20', 5, 2);
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('L.A. Confidential', 1, '2023-06-15', 5, 2);
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('Donnie Brasco', 0, '2023-07-05', 4, 2);

-- Insert some movies for Charlie (user id 3)
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('The Lion King', 1, '2023-02-01', 5, 3);
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('Toy Story', 1, '2023-02-10', 4, 3);
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('Up', 0, '2023-03-01', 4, 3);
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('Finding Nemo', 1, '2023-03-15', 5, 3);
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('Wall-E', 1, '2023-04-05', 5, 3);
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('Inside Out', 0, '2023-04-20', 4, 3);
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('Coco', 1, '2023-05-10', 5, 3);
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('Up', 0, NULL, 3, 3);
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('Zootopia', 0, '2023-06-01', 4, 3);
INSERT INTO "films" ("title", "favorite", "watchdate", "rating", "user")
VALUES ('Ratatouille', 1, '2023-07-01', 5, 3);

COMMIT;