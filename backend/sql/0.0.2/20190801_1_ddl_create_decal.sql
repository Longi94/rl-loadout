CREATE TABLE decal
(
    id              SERIAL       NOT NULL,
    base_texture    VARCHAR(255),
    rgba_map        VARCHAR(255) NOT NULL,
    body_id         INTEGER,
    decal_detail_id INTEGER      NOT NULL,
    quality         INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY (body_id) REFERENCES body (id),
    FOREIGN KEY (decal_detail_id) REFERENCES decal_detail (id)
);
