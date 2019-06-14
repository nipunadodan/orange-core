<?php
include_once ('../config.php');
include_once ('../classes/User/User.php');

error_reporting(E_ALL);
ini_set('display_errors', 1);

$user = new \User\User();

$thisUser = $user->getUser(1);
var_dump($thisUser);
