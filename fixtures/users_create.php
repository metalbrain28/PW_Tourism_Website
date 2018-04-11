<?php
/**
 * User: Andreea Dobroteanu
 * Date: 11.04.2018
 * Time: 23:15
 */

require_once '../library/idiorm.php';

ORM::configure('sqlite:../database.sqlite');

ORM::get_db()->exec('DROP TABLE IF EXISTS users;');
ORM::get_db()->exec(
    'CREATE TABLE users (' .
    'id INTEGER PRIMARY KEY AUTOINCREMENT, ' .
    'first_name TEXT, ' .
    'last_name TEXT, ' .
    'email TEXT, ' .
    'phone TEXT, ' .
    'password TEXT)'
);
