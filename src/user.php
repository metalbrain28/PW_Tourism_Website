<?php
/**
 * User: Andreea Dobroteanu
 * Date: 11.04.2018
 * Time: 23:11
 */

session_start();

require_once '../library/idiorm.php';
ORM::configure('sqlite:../database.sqlite');

$request_uri = explode('?', $_SERVER['REQUEST_URI'], 2);

function logout() {
    if (isset($_SESSION["user"])) {
        session_unset();
        session_destroy();
    }
}

/* Login */
if (strstr($request_uri[0], "login")) {
    logout();

    $email = $_POST["email"];
    $password = $_POST["password"];

    $user = ORM::for_table('users')
        ->where_like('email', $email)
        ->where_like('password', md5($password))
        ->find_one();

    header("Content-type", "application/json");

    if ($user) {
        setSessionData($user);

        echo json_encode([
            'id' => $user->id,
            'name' => $user->first_name
        ]);
    } else {
        http_response_code(400);
        echo json_encode([
            'message'   =>  'Invalid credentials.'
        ]);
    }
}

/* Register */
if (strstr($request_uri[0], "register")) {
    logout();

    header("Content-type", "application/json");

    $user = ORM::for_table('users')->create();
    $user->first_name = $_POST["firstname"];
    $user->last_name = $_POST["lastname"];
    $user->email = $_POST["email"];
    $user->password = md5($_POST["password"]);

    try {
        $user->save();
    } catch (Exception $e) {

        if ($e->getCode() == 23000) {
            /* Duplicate email */

            http_response_code(400);
            echo json_encode([
                'message'   =>  'User already registered.'
            ]);
        } else {
            http_response_code(500);

            echo json_encode([
                'message'   =>  'Server error. Please, try again later.'
            ]);
        }

        return;
    }

    setSessionData($user);

    echo json_encode([
        'id' => $user->id,
        'name' => $user->first_name
    ]);
}

function setSessionData($user) {
    $_SESSION["user"] = [
        "id"        => $user->id,
        "name"      => $user->first_name,
        "is_admin"  => $user->is_admin
    ];
}

/* Logout */
if (strstr($request_uri[0], "logout")) {
    logout();
}
