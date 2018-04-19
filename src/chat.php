<?php

/**
 * Rules:
 * - the admin never initiates a discussion; he only becomes responsible for one.
 * - the admin can see the discussions where he is responsible for and the ones with no responsible.
 */

session_start();

require_once '../library/idiorm.php';
ORM::configure('sqlite:../database.sqlite');

$request_uri = explode('?', $_SERVER['REQUEST_URI'], 2);

$isGetAllChats = preg_match('/\/chat[\/]?$/', $request_uri[0]);
$isGetChat = preg_match('/\/chat\/([\d]+)[\/]?$/', $request_uri[0], $matchedChatID);

if (isset($_SESSION["user"])) {
    $user = $_SESSION["user"];
} else {
    http_response_code(400);
    echo json_encode(["message" => "You should log in first."]);
    return;
}

if ($isGetAllChats) {
    switch ($_SERVER['REQUEST_METHOD']) {
        case "GET":
            getAllChats($user);
            break;
        case "POST":
            userSendMessage($user);
            break;
        default:
            break;
    }

    return;
}

if ($isGetChat) {
    $chatID = $matchedChatID[1];

    switch ($_SERVER['REQUEST_METHOD']) {
        case "GET":
            getChatByID($user, $chatID);
            break;
        case "POST":
            adminSendMessage($user, $chatID);
            break;
        default:
            break;
    }

    return;
}

/**
 * When a user makes a POST request to /chat and initiates a conversation
 * @param $user
 */
function userSendMessage($user) {

    $data = null;

    if (isset($_POST["chat_data"])) {
        $data = json_decode($_POST["chat_data"]);
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Please, send the correct data object."]);
        return;
    }

    if ($user["is_admin"]) {
        http_response_code(400);
        echo json_encode(["message" => "Please, specify the chat's id."]);
        return;
    }

    $chat = ORM::for_table('chat')->where('user_id', $user["id"])->find_one();

    if (!$chat) {
        $chat = ORM::for_table('chat')->create();
        $chat->user_id = $user['id'];
        $chat->unread = 1;
        $chat->save();
    } else {
        $chat->unread = $chat->unread + 1;
        $chat->save();
    }

    $newMessage = ORM::for_table('messages')->create();
    $newMessage->chat_id = $chat->id;
    $newMessage->message = $data->message;
    $newMessage->user_id = $user["id"];

    try {
        $newMessage->save();

        echo json_encode([
            'message'   =>  'Message sent.'
        ]);
    } catch (Exception $e) {
        http_response_code(500);

        echo json_encode([
            'message'   =>  'Message could not be sent.'
        ]);
    }
}

function getAllChats($user) {

    $response = [];

    if ($user["is_admin"]) {
        $chats = ORM::for_table('chat')
            ->raw_query('SELECT * from chat ' .
                'JOIN users ON users.id=user_id ' .
                'WHERE responsible_id IS NULL OR responsible_id=:id ' .
                'ORDER BY unread DESC', ['id' => $user["id"]])->find_many();

        foreach ($chats as $chat) {
            $response[] = [
                'id'        => $chat->id,
                'name'      => $chat->first_name . ' ' . $chat->last_name,
                'unread'    => $chat->unread
            ];
        }
    } else {

        $chat = ORM::for_table('chat')
            ->table_alias('c')
            ->select('c.*')
            ->select('m.user_id', 'from')
            ->select('m.message', 'message')
            ->select('u.id', 'user_id')
            ->select('u.first_name', 'first_name')
            ->select('u.last_name', 'last_name')
            ->select('u.email', 'user_email')
            ->join('messages', 'm.chat_id=c.id', 'm')
            ->join('users', 'u.id=m.user_id', 'u')
            ->where('c.user_id', $user['id'])
            ->order_by_desc('m.id')
            ->limit(20)
            ->find_many();

        foreach ($chat as $message) {
            $response[] = [
                'name'      => $message->first_name . ' ' . $message->last_name,
                'email'     => $message->user_email,
                'message'   => $message->message,
                'side'      => $message->user_id === $user['id'] ?  "right" : "left"
            ];
        }
    }

    header('Content-Type: application/json');
    echo json_encode([
        "chats" => $response
    ]);
}

function getChatByID($user, $chatID) {
    header("Content-type", "application/json");

    if ($user["is_admin"]) {
        $response = [];

        $chat = ORM::for_table('chat')->where('chat_id', $chatID)->find_one();
        if ($chat) {
            $chat->set(['responsible_id' => $user['id']]);
            $chat->set(['unread' => 0]);
            $chat->save();
        }

        $messages = ORM::for_table('chat')
            ->table_alias('c')
            ->select('m.message', 'message')
            ->select('u.first_name', 'first_name')
            ->select('u.last_name', 'last_name')
            ->select('u.email', 'user_email')
            ->join('messages', 'm.chat_id=c.id', 'm')
            ->join('users', 'u.id=m.user_id', 'u')
            ->where('c.id', $chatID)
            ->order_by_desc('m.id')
            ->limit(20)
            ->find_many();

        foreach ($messages as $message) {
            $response[] = [
                'name'      => $message->first_name . $message->last_name,
                'email'     => $message->user_email,
                'message'   => $message->message
            ];
        }

        echo json_encode([
            "chat" => $response
        ]);
    } else {
        http_response_code(403);
        echo json_encode(["message" => "You are not allowed to access this resource."]);
        return;
    }
}

function adminSendMessage($user, $chatID) {
    $data = null;

    if (isset($_POST['message'])) {
        $data = json_decode($_POST['message']);
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Please, specify the chat's id."]);
        return;
    }

    $newMessage = ORM::for_table('chat')->create();
    $newMessage->chat_id = $chatID;
    $newMessage->user_id = $user['id'];
    $newMessage->message = $data->text;

    try {
        $newMessage->save();
    } catch (Exception $e) {
        http_response_code(500);

        echo json_encode([
            'message'   =>  'Message could not be sent.'
        ]);
    }
}
