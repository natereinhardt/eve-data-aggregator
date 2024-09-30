CREATE TABLE calendar (
    date DATE NOT NULL,
    year INT NOT NULL,
    quarter VARCHAR(10) NOT NULL,
    month VARCHAR(10) NOT NULL,
    day VARCHAR(10) NOT NULL,
    PRIMARY KEY (date)
);