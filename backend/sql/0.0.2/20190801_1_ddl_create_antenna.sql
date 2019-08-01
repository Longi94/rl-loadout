CREATE TABLE antenna
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
    stick_id     INTEGER      NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (stick_id) REFERENCES antenna_stick (id)
);
