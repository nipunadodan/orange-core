<?php

namespace User;

use Db\Db;

class User extends Db {
    private $table = "users";

    public $id;
    private $first_name;
    private $last_name;
    private $username;
    private $password;
    private $level;
    private $status;
    private $created_by;


    public function login($username, $password){

        $user = parent::select($this->table, '*', [
            "username" => $username
        ]);

        $passwordFromPost = $password;

        if ($user) {
            $hashedPasswordFromDB = $user[0]['password'];
            if (password_verify($passwordFromPost, $hashedPasswordFromDB) && $user[0]['status'] != 10) {
                $user_browser = $_SERVER['HTTP_USER_AGENT'];
                $_SESSION['app_id'] = APP_ID;
                /*echo $user[0]['status'];*/
                $username = preg_replace("/[^a-zA-Z0-9_\-\/]+/","",$username);
                $_SESSION['username'] = $username;
                $_SESSION['login_string'] = hash('sha512',$hashedPasswordFromDB . $user_browser);
                $_SESSION['first_name'] = $user[0]['first_name'];
                $_SESSION['last_name'] = $user[0]['last_name'];
                $_SESSION['status'] = $user[0]['status'];
                $_SESSION['level'] = $user[0]['level'];
                $_SESSION['user_id'] = $user[0]['id'];

                parent::update($this->table,[
                    'failed_login_attempts' => 0
                ],[
                    'username' => $username
                ]);

                return true;
            } else {
                //error ( "You&rsquo;ve entered invalid credentials" );
                parent::update($this->table,[
                    'failed_login_attempts[+]' => 1
                ],[
                    'username' => $username
                ]);
                return false;
            }
        } else {
            //error ('Not a valid user');
            return false;
        }
    }

    public function login_check() {
        if (isset($_SESSION['user_id'],$_SESSION['login_string'], $_SESSION['status'])) {
            $login_string = $_SESSION['login_string'];
            $user_id =$_SESSION['user_id'];
            $user_browser = $_SERVER['HTTP_USER_AGENT'];

            $result = parent::select($this->table, 'password', [
                'id' => $user_id
            ]);
            if ($result) {
                $password = $result[0];
                $login_check = hash('sha512', $password . $user_browser);
                if (count($result) == 1) {
                    if ($login_check == $login_string) {
                        //$db->connection = null;
                        return true;
                    } else {
                        //$db->connection = null;
                        return false;
                    }
                } else {
                    //$db->connection = null;
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public function checkPerm($level){
        if($this->login_check() && $_SESSION['level'] >= $level){
            return true;
        }else{
            return false;
        }
    }

    public function getUserId(){
        if($this->login_check()){
            return $_SESSION['user_id'];
        }
    }

    public function getAllUsers($filter){
        if($this->checkPerm(8)){
            return $users = parent::select($this->table, '*',[
                'ORDER' => 'status'
            ]);
        }elseif($this->checkPerm(8) && $filter){
            return $users = parent::select($this->table, '*');
        }else{
            return false;
        }
    }

    public function getUser($id){
        if($this->checkPerm(8)){
            $user = parent::select($this->table, '*', [
                'id' => $id
            ]);
            $this->first_name = $user['first_name'];
        }else{
            return false;
        }
    }

    public function createUser($post, $created_by){
        if($this->checkPerm(8)){
            $create = parent::insert($this->table, [
                'first_name' => $post['first_name'],
                'last_name' => $post['last_name'],
                'username' => $post['username'],
                'password' => password_hash($post['password'], PASSWORD_BCRYPT),
                'status' => $post['status'],
                'level' => $post['level'],
                'created_by' => $created_by
            ]);
            if($create->rowCount() == 1){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    public function updateUserPassword($id,$post){
        $user = $this->getUser($id);
        if(isset($post['old_password'], $post['password1'], $post['password2']) && $post['old_password'] !== '' && $post['password1'] !== '' && $post['password2'] !== '') {
            if (password_verify($post['old_password'], $user[0]['password']) && $post['password1'] == $post['password2']) {
                $update = parent::update($this->table, [
                    'password' => password_hash($post['password1'], PASSWORD_BCRYPT)
                ], [
                    'id' => $id
                ]);
                if ($update->rowCount() > 0) {
                    $return = array(
                        'message' => 'Successfully updated the password',
                        'status' => 'success'
                    );
                } else {
                    $return = array(
                        'message' => 'Password update error',
                        'status' => 'danger'
                    );
                }
            } else {
                $return = array(
                    'message' => 'Passwords not matching',
                    'status' => 'warning'
                );
            }
        }else{
            $return = array(
                'message' => 'Required fields missing',
                'status' => 'info'
            );
        }
        return $return;
    }

    public function updateUser($id, $post){
        if($this->checkPerm(8) || $id == $_SESSION['user_id']){

            $update = parent::update($this->table,[
                'first_name' => $post['first_name'],
                'last_name' => $post['last_name'],
                'status' => $post['status'],
                'level' => $post['level'],
            ],[
                'id' => $id
            ]);
            if($update->rowCount() > 0){
                $return = array(
                    'message' => 'Successfully updated the user',
                    'status' => 'success'
                );
            }else{
                $return = array(
                    'message' => 'User not updated',
                    'status' => 'danger'
                );
            }
        }else{
            $return = array(
                'message' => 'No sufficient permissions',
                'status' => 'warning'
            );
        }
        return $return;
    }

    public function deleteUser($id){
        if($this->checkPerm(8)){
            if(isset($post['old_password'])) {}
            $update = parent::update($this->table,[
                'status' => 10
            ],[
                'id' => $id
            ]);

            if($update->rowCount() > 0){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }
}
