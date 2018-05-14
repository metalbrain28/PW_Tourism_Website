<?php
/**
 * User: Andreea Dobroteanu
 * Date: 08.05.2018
 * Time: 00:54
 */

session_start();
date_default_timezone_set('Europe/Bucharest');

require_once '../library/idiorm.php';
ORM::configure('sqlite:../database.sqlite');

$request_uri = explode('?', $_SERVER['REQUEST_URI'], 2);

$rating = preg_match('/\/rating\/([\d]+)[\/]?$/', $request_uri[0], $matchedTripID);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $tripID = $matchedTripID[1];

    $rating = ORM::for_table('users_ratings')->create();
    $rating->user_id = $_SESSION["user"]["id"];
    $rating->trip_id = $tripID;
    $rating->rating = $_POST["rating"];

    $trip = ORM::for_table('trips')->find_one($tripID);
    $trip->rating = ($trip->rating > 0 ? (($trip->rating + $_POST["rating"]) / 2) : $_POST["rating"]);

    try {
        $rating->save();
        $trip->save();

        header('Content-Type: application/json');
        echo json_encode([
            "message" => "Rated " . $_POST["rating"]
        ]);
        return;
    } catch (Exception $e) {
        http_response_code(500);

        echo json_encode([
            'message'   =>  'Could not rate this.'
        ]);
    }
}
