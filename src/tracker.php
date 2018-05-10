<?php
/**
 * User: Andreea Dobroteanu
 * Date: 30.04.2018
 * Time: 21:32
 */

session_start();
date_default_timezone_set('Europe/Bucharest');

require_once '../library/idiorm.php';
ORM::configure('sqlite:../database.sqlite');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $data = ORM::for_table('analytics')->find_many();

    header('Content-Type: application/json');
    echo json_encode([
        "data" => $data
    ]);
    return;

} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $track = ORM::for_table('analytics')->create();
    $track->user_id = isset($_SESSION["user"]) ? $_SESSION["user"]["id"] : null;
    $track->action = $_POST["action"];
    $track->details = $_POST["details"];
    $track->timestamp = date("Y-m-d H:i:s");

    try {
        $track->save();

        header('Content-Type: application/json');
        echo json_encode([
            "message" => "Tracked " . $_POST["action"]
        ]);
        return;
    } catch (Exception $e) {
        http_response_code(500);

        echo json_encode([
            'message'   =>  'Could not track this.'
        ]);
    }
}