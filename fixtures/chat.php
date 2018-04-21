<?php
/**
 * Created by PhpStorm.
 * User: Metalbrain
 * Date: 15.04.2018
 * Time: 21:03
 */

require_once '../library/idiorm.php';

ORM::configure('sqlite:../database.sqlite');

ORM::get_db()->exec('DROP TABLE IF EXISTS chat;');
ORM::get_db()->exec(
    'CREATE TABLE chat (' .
    'id INTEGER PRIMARY KEY AUTOINCREMENT, ' .
    'user_id INTEGER, ' .
    'responsible_id INTEGER, ' .
    'unread INTEGER, ' .
    'timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, ' .
    'last_message_time DATETIME, ' .
    'FOREIGN KEY(user_id) REFERENCES users(id), ' .
    'FOREIGN KEY(responsible_id) REFERENCES users(id))'
);
