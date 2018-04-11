<?php

$request_uri = explode('?', $_SERVER['REQUEST_URI'], 2);

// Route it up!
switch ($request_uri[0]) {
    // Home page
    case '/':
        require 'site.php';
        break;
    // Login/Register
    case '/login':
    case '/register':
        require '../src/user.php';
        break;
    // Everything else
    default:
        require 'site.php';
}

