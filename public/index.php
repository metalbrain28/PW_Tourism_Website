<?php

$request_uri = explode('?', $_SERVER['REQUEST_URI'], 2);

$routes = [
    'chat' => [
        'pattern'   => '/\/chat(\/[\d]+[\/]?$)?/',
        'file'      => '../src/chat.php'
    ],
    'trips' => [
        'pattern'   => '/\/trips(\/[\d]+[\/]?$)?/',
        'file'      => '../src/trip.php'
    ],
    'rating' => [
        'pattern'   => '/\/rating/',
        'file'      => '../src/rating.php'
    ],
    'track' => [
        'pattern'   => '/\/track[\/]?/',
        'file'      => '../src/tracker.php'
    ],
    'user' => [
        'pattern'   => '/\/[(login)(logout)(register)]+/',
        'file'      => '../src/user.php'
    ],
    'home' => [
        'pattern'   => '/\//',
        'file'      => 'site.php'
    ]
];

foreach ($routes as $route) {
    if (preg_match($route["pattern"], $request_uri[0])) {
        require $route["file"];
        return;
    }
}
