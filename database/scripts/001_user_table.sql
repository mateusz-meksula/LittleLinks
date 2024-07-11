USE littlelinks;

CREATE TABLE user (
    id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    username varchar(20) UNIQUE NOT NULL,
    hash varchar(60) NOT NULL,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id)
);