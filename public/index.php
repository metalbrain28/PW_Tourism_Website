<?php

$request_uri = explode('?', $_SERVER['REQUEST_URI'], 2);

$routes = [
    'chat' => [
        'pattern'   => '/\/chat(\/[\d]+[\/]?$)?/',
        'file'      => '../src/chat.php'
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
