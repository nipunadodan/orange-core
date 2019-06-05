<?php
// Using Medoo namespace
use Medoo\Medoo;

$database = new Medoo([
// required
'database_type' => 'mysql',
'database_name' => DB,
'server' => DB_HOST,
'username' => DB_USER,
'password' => DB_PASSWORD,
'prefix' => DB_PREFIX,
]);
