CREATE TABLE body
(
    id           SERIAL       NOT NULL,
    replay_id    INTEGER,
    name         VARCHAR(255) NOT NULL,
    quality      INTEGER      NOT NULL,
    icon         VARCHAR(255) NOT NULL,
    paintable    BOOLEAN      NOT NULL,
    model        VARCHAR(255) NOT NULL,
    blank_skin   VARCHAR(255) NOT NULL,
    base_skin    VARCHAR(255),
    chassis_base VARCHAR(255),
    chassis_n    VARCHAR(255),
    PRIMARY KEY (id)
);
