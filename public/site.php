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
    ->where_gte('start_date', date("Y-m-d"))
    ->order_by_desc('rating')
    ->order_by_asc('start_date')
    ->limit(4)
    ->find_many();

$bestOffers = ORM::for_table('trips')
    ->where_gte('start_date', date("Y-m-d"))
    ->order_by_asc('price')
    ->order_by_desc('rating')
    ->limit(4)
    ->find_many();

include("../templates/site_start.html");
include("../templates/index.html");
include("../templates/partials/book_trip.html");
include("../templates/partials/login_form.html");
include("../templates/partials/conversation.html");
include("../templates/partials/all_conversations.html");
include("../templates/partials/add_trip.html");
include("../templates/site_end.html");
