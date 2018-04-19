<?php

require_once '../library/idiorm.php';

ORM::configure('sqlite:../database.sqlite');

ORM::get_db()->exec('DROP TABLE IF EXISTS messages;');
ORM::get_db()->exec(
    'CREATE TABLE messages (' .
    'id INTEGER PRIMARY KEY AUTOINCREMENT, ' .
    'chat_id INTEGER, ' .
    'message TEXT, ' .
    'user_id INTEGER, ' .
    'seen INTEGER, ' .
    'timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, ' .
    'FOREIGN KEY(user_id) REFERENCES users(id), ' .
    'FOREIGN KEY(chat_id) REFERENCES chat(id))'
);
