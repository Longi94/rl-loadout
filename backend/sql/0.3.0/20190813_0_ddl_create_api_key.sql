CREATE TABLE api_key
(
    key         VARCHAR(32)  NOT NULL,
    name        VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    active      BOOLEAN      NOT NULL,
    PRIMARY KEY (key)
);
