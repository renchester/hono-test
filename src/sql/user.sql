DROP TABLE IF EXISTS Users;

CREATE TABLE IF NOT EXISTS Users (
    id TEXT PRIMARY KEY,
    name TEXT,
    rank INTEGER
);

INSERT INTO Users (id, name, rank) VALUES 
    ('user_1', 'Renchester', 1),
    ('user_2', 'Andres', 2),
    ('user_3', 'Maria', 3);

