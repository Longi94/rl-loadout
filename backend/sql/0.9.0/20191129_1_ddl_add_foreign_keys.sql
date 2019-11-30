ALTER TABLE antenna
    ADD CONSTRAINT constraint_name FOREIGN KEY (id) REFERENCES product (id);
ALTER TABLE body
    ADD CONSTRAINT constraint_name FOREIGN KEY (id) REFERENCES product (id);
ALTER TABLE decal
    ADD CONSTRAINT constraint_name FOREIGN KEY (id) REFERENCES product (id);
ALTER TABLE topper
    ADD CONSTRAINT constraint_name FOREIGN KEY (id) REFERENCES product (id);
ALTER TABLE wheel
    ADD CONSTRAINT constraint_name FOREIGN KEY (id) REFERENCES product (id);
