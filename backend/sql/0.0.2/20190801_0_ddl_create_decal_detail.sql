CREATE TABLE decal_detail
(
    id        SERIAL       NOT NULL,
    replay_id INTEGER,
    name      VARCHAR(255) NOT NULL,
    quality   INTEGER      NOT NULL,
    icon      VARCHAR(255) NOT NULL,
    paintable BOOLEAN      NOT NULL,
    PRIMARY KEY (id)
);
