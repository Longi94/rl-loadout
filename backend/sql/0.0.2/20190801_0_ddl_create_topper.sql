CREATE TABLE topper
(
    id           SERIAL       NOT NULL,
    replay_id    INTEGER,
    name         VARCHAR(255) NOT NULL,
    quality      INTEGER      NOT NULL,
    icon         VARCHAR(255) NOT NULL,
    paintable    BOOLEAN      NOT NULL,
    model        VARCHAR(255) NOT NULL,
    base_texture VARCHAR(255),
    rgba_map     VARCHAR(255),
    PRIMARY KEY (id)
);
