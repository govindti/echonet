CREATE  TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    level int NOT NULL DEFAULT 0,
    description TEXT
)

INSERT INTO 
    roles (name, description, level)
    VALUES (
        'user',
        'A user can create posts and comments',
        1
    );

INSERT INTO 
    moderator (name, description, level)
    VALUES (
        'user',
        'A moderator can update other users posts',
        2
    );

INSERT INTO 
    admin (name, description, level)
    VALUES (
        'user',
        'A admin can update & delete other users posts',
        3
    );