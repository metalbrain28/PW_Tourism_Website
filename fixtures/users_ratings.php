<?php
/**
 * User: Andreea Dobroteanu
 * Date: 14.05.2018
 * Time: 20:17
 */

require_once '../library/idiorm.php';

ORM::configure('sqlite:../database.sqlite');

ORM::get_db()->exec('DROP TABLE IF EXISTS users_ratings;');
ORM::get_db()->exec(
    'CREATE TABLE users_ratings (' .
    'id INTEGER PRIMARY KEY AUTOINCREMENT, ' .
    'user_id INTEGER, ' .
    'trip_id INTEGER, ' .
    'rating INTEGER, ' .
    'timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, ' .
    'FOREIGN KEY(user_id) REFERENCES users(id), ' .
    'FOREIGN KEY(trip_id) REFERENCES trips(id))'
);


