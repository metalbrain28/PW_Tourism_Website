<?php
/**
 * User: Andreea Dobroteanu
 * Date: 11.04.2018
 * Time: 23:30
 */

session_start();

require_once '../library/idiorm.php';

ORM::configure('sqlite:../database.sqlite');

$popularTrips = ORM::for_table('trips')
//    ->where_gte('start_date', date("Y-m-d"))
    ->order_by_desc('rating')
    ->order_by_asc('start_date')
    ->limit(4)
    ->find_many();

$bestOffers = ORM::for_table('trips')
//    ->where_gte('start_date', date("Y-m-d"))
    ->order_by_asc('price')
    ->order_by_desc('rating')
    ->limit(4)
    ->find_many();

$allTrips = ORM::for_table('trips')
//    ->where_gte('start_date', date("Y-m-d"))
    ->order_by_asc('start_date')
    ->find_many();

$statistics = ORM::for_table('analytics')
    ->raw_query('SELECT COUNT(id) as counter, strftime(\'%Y-%m-%d\', timestamp) as day FROM analytics WHERE action="visit" GROUP BY day ORDER BY day DESC LIMIT 7')
    ->find_many();

$mouseStatistics = ORM::for_table('analytics')
    ->raw_query('SELECT COUNT(id) as counter, details FROM analytics WHERE action="mousemove" GROUP BY details')
    ->find_many();

$linksStatistics = ORM::for_table('analytics')
    ->where('action', 'links')
    ->order_by_desc('id')
    ->find_one();

$maxVisits = 0;
foreach ($statistics as $k => $v) {
    $maxVisits = $v->counter > $maxVisits ? $v->counter : $maxVisits;
}

$statistics = array_reverse($statistics);

$allTripsData = [];
foreach ($allTrips as $trip) {
    $allTripsData[] = [
        'id'                => $trip->id,
        'poster'            => $trip->poster,
        'title'             => $trip->title,
        'short_description' => $trip->short_description,
        'latitude'          => $trip->latitude,
        'longitude'         => $trip->longitude,
    ];
}



include("../templates/site_start.html");
include("../templates/index.html");
include("../templates/partials/book_trip.html");
include("../templates/partials/login_form.html");
include("../templates/partials/conversation.html");
include("../templates/partials/all_conversations.html");
include("../templates/partials/add_trip.html");
include("../templates/partials/trip_widget.html");
include("../templates/site_end.html");
