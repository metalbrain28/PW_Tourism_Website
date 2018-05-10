<?php
/**
 * User: Andreea Dobroteanu
 * Date: 29.04.2018
 * Time: 11:04
 */

require_once '../library/idiorm.php';

ORM::configure('sqlite:../database.sqlite');

ORM::get_db()->exec('DROP TABLE IF EXISTS trips;');
ORM::get_db()->exec(
    'CREATE TABLE trips (' .
    'id INTEGER PRIMARY KEY AUTOINCREMENT, ' .
    'title TEXT, ' .
    'short_description TEXT, ' .
    'description TEXT, ' .
    'poster TEXT, ' .
    'start_date DATETIME, ' .
    'end_date DATETIME, ' .
    'nights_no INTEGER, ' .
    'price REAL, ' .
    'latitude REAL, ' .
    'longitude REAL, ' .
    'rating INTEGER DEFAULT 0)'
);

function rand_float($st_num=0,$end_num=1,$mul=100)
{
    if ($st_num>$end_num) return false;
    return mt_rand($st_num*$mul,$end_num*$mul)/$mul;
}

function createTrip($title, $short_description, $lat, $long, $index) {
    $nights_no = mt_rand(1, 10);
    $rating = rand_float(0, 5);

    $trip = ORM::for_table('trips')->create();
    $trip->title = $title;
    $trip->short_description = $short_description;
    $trip->description = file_get_contents('http://loripsum.net/api/'.mt_rand(1, 5).'/short/headers');
    $trip->nights_no = $nights_no;
    $trip->price = rand_float(50, 3000);
    $trip->start_date = date("Y-m-d");
    $trip->end_date = date("Y-m-d", strtotime("+". ($nights_no + 1) ." day"));
    $trip->poster = "/images/tour".($index + 1).".jpg";
    $trip->rating = $rating;
    $trip->latitude = $lat;
    $trip->longitude = $long;
    $trip->save();
}

$titles = ["Belize & Guatemala", "Vietnam, Laos & Cambodia", "Thailand", "Loire & Burgundy", "Norway", "Venice, Florence & Rome"];
$short_descriptions = ["Family journey", "Culinary adventure", "Group tour", "For honeymooners", "Cultural walking adventure", "Educational tour"];
$latitudes = [17.1899, 14.0583, 15.8700, 47.5532, 60.4720, 45.4408];
$longitudes = [88.4976, 108.2772, 100.9925, 1.0105, 8.4689, 12.3155];

for ($i = 0; $i < 6; $i++) {
    createTrip($titles[$i], $short_descriptions[$i], $latitudes[$i], $longitudes[$i], $i);
}

