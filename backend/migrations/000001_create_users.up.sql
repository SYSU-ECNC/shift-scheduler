CREATE TABLE
    IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

INSERT INTO
    users (username, password_hash, full_name, role)
VALUES
    (
        'admin',
        '$2a$12$guYsbYoOku6chx2TLFx26O7Ryscww0kDavHbgzLJhBrHme8cceZ9W',
        '初始管理员',
        '黑心'
    );