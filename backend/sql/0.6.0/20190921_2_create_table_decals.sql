CREATE TABLE decal
(
    name         VARCHAR(255) NOT NULL,
    quality      INTEGER      NOT NULL,
    icon         VARCHAR(255) NOT NULL,
    paintable    BOOLEAN      NOT NULL,
    id           SERIAL       NOT NULL,
    base_texture VARCHAR(255),
    rgba_map     VARCHAR(255) NOT NULL,
    body_id      INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY (body_id) REFERENCES body (id)
);
