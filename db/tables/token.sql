CREATE TABLE tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- Auto-incrementing primary key
    access_token TEXT NOT NULL,         -- Stores the access token
    expires_in INT NOT NULL,            -- Time in seconds until token expires
    token_type VARCHAR(50),             -- Type of token, e.g., 'Bearer'
    refresh_token TEXT NOT NULL,        -- Stores the refresh token
    scp VARCHAR(255),                   -- Scopes granted to the token
    sub VARCHAR(255),                   -- Subject identifier, usually the character and service
    name VARCHAR(255),                  -- Character name
    owner VARCHAR(255),                 -- Owner identifier, base64 encoded
    exp INT NOT NULL,                   -- Expiry timestamp in seconds since epoch
    job VARCHAR(255)					-- job for which this token is for
);