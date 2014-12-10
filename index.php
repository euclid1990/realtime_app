<?php
    require 'vendor/autoload.php';
    sleep(0.5);
    const JWT_PRIVATE_KEY = 'private_key';
    const JWT_PRIVATE_KEY_VAL = 'abcd123456';

    // Start session
    ini_set('session.cookie_lifetime','3600');
    session_start();
    $_SESSION['userId'] = (isset($_SESSION['userId']) && $_SESSION['userId']) ? $_SESSION['userId'] : uniqid();

    // Generate JSON Web Signature
    $tokenKey = session_id();
    $tokenValue = JWT::encode($tokenKey, JWT_PRIVATE_KEY_VAL);
    $tokenDecoded = JWT::decode($tokenValue, JWT_PRIVATE_KEY_VAL);

    // Write PHPSESSID into Redis storage
    $redisClient = new Predis\Client();
    $userId = $_SESSION['userId'];
    $redisClient->set($userId, $tokenDecoded);
    $redisClient->set(JWT_PRIVATE_KEY, JWT_PRIVATE_KEY_VAL);
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport">
        <title>Realtime Application</title>
    </head>
    <style>
        .notice li, .message li {
            opacity: 0;
            margin-bottom: 5px;
            -moz-transition: opacity 0.5s linear;
            -o-transition: opacity 0.5s linear;
            -webkit-transition: opacity 0.5s linear;
            transition: opacity 0.5s linear;
        }
        .noticeBox {
            float: left;
            margin-left: 20px;
            width: 30%;
        }
        .messageBox {
            float: left;
            margin-left: 20px;
            width: 30%;
        }
        .message {
            height: 300px;
            overflow-y: auto;
        }
        .notificationBox {
            float: left;
            margin-left: 20px;
            width: 30%;
        }
        .notification {
            height: 350px;
            overflow-y: auto;
        }
        #inputMesage {
            width: 100%;
            height: 50px;
            resize: none;
        }
    </style>
    <body>
        <?php
            echo "<h4>Your ID: $userId</h4>";
            echo "<input id='userId' type='hidden' value='$userId'></input>";
            echo "<h4>Token Key: $tokenKey</h4>";
            echo "<h4>Token Value: $tokenValue</h4>";
            echo "<input id='tokenValue' type='hidden' value='$tokenValue'></input>";
        ?>
        <div class="noticeBox">
            <h4>User Activity</h4>
            <ul class="notice" id="notice">
            </ul>
        </div>

        <div class="messageBox">
            <h4>Message Box</h4>
            <ul class="message" id="message">
            </ul>
            <textarea id='inputMesage' placeholder="Enter Message Here ..."></textarea>
        </div>
        <div class="notificationBox">
            <h4>Private Notification</h4>
            <ul class="notification" id="notification">
            </ul>
        </div>
        <script src="js/jquery-1.11.1.min.js" ></script>
        <script src="js/node_modules/socket.io/node_modules/socket.io-client/socket.io.js"></script>
        <script src="js/client.js"></script>
    </body>
</html>