<?php
/**
 * User: Andreea Dobroteanu
 * Date: 29.04.2018
 * Time: 17:27
 */

session_start();
date_default_timezone_set('Europe/Bucharest');

require_once '../library/idiorm.php';
ORM::configure('sqlite:../database.sqlite');

$request_uri = explode('?', $_SERVER['REQUEST_URI'], 2);

$isAllTrips = preg_match('/\/trips[\/]?$/', $request_uri[0]);
$isSingleTrip = preg_match('/\/trips\/([\d]+)[\/]?$/', $request_uri[0], $matchedChatID);

if ($isAllTrips) {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    } else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (!isset($_SESSION["user"]) || !$_SESSION["user"]["is_admin"] ) {
            http_response_code(403);
            echo json_encode(["message" => "You should be admin."]);
            return;
        }

        /* Save file to server first */
        $poster = $_FILES["poster"];

        $targetdir = '../public/uploads/';
        $targetfile = $targetdir.$poster['name'];
        $poster_url = "/uploads/".$poster['name'];

        if (move_uploaded_file($poster['tmp_name'], $targetfile)) {
            // file uploaded succeeded
            /* Save data & file path to database */
            $trip = ORM::for_table('trips')->create();
            $trip->title = $_POST["title"];
            $trip->short_description = $_POST["short_description"];
            $trip->description = $_POST["description"];
            $trip->nights_no = $_POST["nights_no"];
            $trip->price = $_POST["price"];
            $trip->start_date = $_POST["start_date"];
            $trip->end_date = $_POST["end_date"];
            $trip->poster = $poster_url;

            try {
                $trip->save();

                $response_data = array_merge($_POST, ["id" => $trip->id, "rating" => 0]);

                header('Content-Type: application/json');
                echo json_encode([
                    "data" => $response_data
                ]);
                return;
            } catch (Exception $e) {
                http_response_code(500);

                echo json_encode([
                    'message'   =>  $e->getMessage()
                ]);
            }
        } else {
            // file upload failed
            http_response_code(500);

            echo json_encode([
                'message'   =>  'Could not save the poster. Try again later.'
            ]);
        }
    }
}

if ($isSingleTrip) {

}
