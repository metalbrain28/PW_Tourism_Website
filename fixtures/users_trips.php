<?php
/**
 * User: Andreea Dobroteanu
 * Date: 29.04.2018
 * Time: 11:03
 */

require_once '../library/idiorm.php';

ORM::configure('sqlite:../database.sqlite');

ORM::get_db()->exec('DROP TABLE IF EXISTS users_trips;');
ORM::get_db()->exec(
    'CREATE TABLE users_trips (' .
    'id INTEGER PRIMARY KEY AUTOINCREMENT, ' .
    'user_id INTEGER, ' .
    'trip_id INTEGER, ' .
    'people_no INTEGER, ' .
    'total_price REAL, ' .
    'timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, ' .
    'FOREIGN KEY(user_id) REFERENCES users(id), ' .
    'FOREIGN KEY(trip_id) REFERENCES trips(id))'
);

