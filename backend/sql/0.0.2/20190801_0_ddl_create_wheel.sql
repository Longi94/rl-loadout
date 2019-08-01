CREATE TABLE wheel
(
    id          SERIAL       NOT NULL,
    replay_id   INTEGER,
    name        VARCHAR(255) NOT NULL,
    quality     INTEGER      NOT NULL,
    icon        VARCHAR(255) NOT NULL,
    paintable   BOOLEAN      NOT NULL,
    model       VARCHAR(255) NOT NULL,
    rim_base    VARCHAR(255),
    rim_rgb_map VARCHAR(255),
    PRIMARY KEY (id)
);
