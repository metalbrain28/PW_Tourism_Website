<?php
/**
 * User: Andreea Dobroteanu
 * Date: 30.04.2018
 * Time: 21:32
 */

require_once '../library/idiorm.php';

ORM::configure('sqlite:../database.sqlite');

ORM::get_db()->exec('DROP TABLE IF EXISTS analytics;');
ORM::get_db()->exec(
    'CREATE TABLE analytics (' .
    'id INTEGER PRIMARY KEY AUTOINCREMENT, ' .
    'user_id INTEGER, ' .
    'action TEXT, ' .
    'details TEXT, ' .
    'timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, ' .
    'FOREIGN KEY(user_id) REFERENCES users(id))'
);
