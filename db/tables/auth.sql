CREATE TABLE auth (
    scp VARCHAR(255),
    jti VARCHAR(255) PRIMARY KEY, -- Use the 'jti' as a unique identifier for each token
    kid VARCHAR(255),
    sub VARCHAR(255),
    azp VARCHAR(255),
    tenant VARCHAR(50),
    tier VARCHAR(50),
    region VARCHAR(50),
    aud JSON, -- Store the 'aud' array as a JSON field
    name VARCHAR(255),
    owner VARCHAR(255),
    exp BIGINT, -- Store exp and iat as UNIX timestamps
    iat BIGINT,
    iss VARCHAR(255)
);