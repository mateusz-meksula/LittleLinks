USE littlelinks;

CREATE TABLE link (
    id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id SMALLINT UNSIGNED,
    url varchar(250) NOT NULL,
    alias varchar(5) UNIQUE NOT NULL,
    visit_count SMALLINT NOT NULL DEFAULT 0,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user (id),
    INDEX idx_alias (alias)
);