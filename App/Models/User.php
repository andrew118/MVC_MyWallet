<?php

namespace App\Models;

use PDO;
use \App\Token;

class User extends \Core\Model
{
	public $errors = [];
	
	
  public function __construct($data =[])
	{
		foreach ($data as $key => $value) {
			$this->$key = $value;
		}
	}
	
	public function save()
	{
		$this->validate();
		
		if (empty($this->errors)) {
			$password_hash = password_hash($this->password, PASSWORD_DEFAULT);
		
			$sql = 'INSERT INTO users (name, email, password_hash)
					VALUES (:name, :email, :password_hash)';
			
			$db = static::getDB();
			$stmt = $db->prepare($sql);
			
			$stmt->bindValue(':name', $this->name, PDO::PARAM_STR);
			$stmt->bindValue(':email', $this->email, PDO::PARAM_STR);
			$stmt->bindValue(':password_hash', $password_hash, PDO::PARAM_STR);
			
			return $stmt->execute();
		}
			return false;
	}
	
	public function validate()
	{
		if ($this->name == '') {
			$this->errors[] = 'Imię jest wymagane';
		}
  
		if (filter_var($this->email, FILTER_VALIDATE_EMAIL) === false) {
			$this->errors[] = 'Niepoprawny e-mail';
		}
		
		if (static::emailExists($this->email)) {
			$this->errors[] = 'E-mail jest już zajęty';
		}

		if (strlen($this->password) < 6) {
			$this->errors[] = 'Hasło musi mieć conajmniej 6 znaków';
		}
		
		if (preg_match('/.*[a-z]+.*/i', $this->password) == 0) {
			$this->errors[] = 'Hasło musi zawierać conajmniej jedną literę';
		}
		
		if (preg_match('/.*\d+.*/i', $this->password) == 0) {
			$this->errors[] = 'Hasło musi zawierać conajmniej 1 cyfrę';
		}
	}
	
	public static function emailExists($email)
	{
		return static::findByEmail($email) !== false;
	}
	
	public static function findByEmail($email)
	{
		$sql = 'SELECT * FROM users WHERE email = :email';
		
		$db = static::getDB();
		$stmt = $db->prepare($sql);
		$stmt->bindParam(':email', $email, PDO::PARAM_STR);
		
		$stmt->setFetchMode(PDO::FETCH_CLASS, get_called_class());
		
		$stmt->execute();
		
		return $stmt->fetch();
	}
	
	public static function authenticate($email, $password)
	{
		$user = static::findByEmail($email);
		
		if ($user) {
			if (password_verify($password, $user->password_hash)) {
				return $user;
			}
		}
		return false;
	}
	
	public static function findByID($id)
	{
		$sql = 'SELECT name, email FROM users WHERE id = :id';
		
		$db = static::getDB();
		$stmt = $db->prepare($sql);
		$stmt->bindParam(':id', $id, PDO::PARAM_INT);
		
		$stmt->setFetchMode(PDO::FETCH_CLASS, get_called_class());
		
		$stmt->execute();
		
		return $stmt->fetch();
	}
	
	public function rememberLogin()
	{
		$token = new Token();
		$hashed_token = $token->getHash();
		$this->remember_token = $token->getValue();
		
		$this->expiry_timestamp = time() + 60 * 60 *24 * 7; // 7 days from now
		
		$sql = 'INSERT INTO remembered_logins (token_hash, user_id, expires_at)
				VALUES (:token_hash, :user_id, :expires_at)';
		
		$db = static::getDB();
		$stmt = $db->prepare($sql);
		
		$stmt->bindValue(':token_hash', $hashed_token, PDO::PARAM_STR);
		$stmt->bindValue(':user_id', $this->id, PDO::PARAM_INT);
		$stmt->bindValue(':expires_at', date('Y-m-d H-i-s', $this->expiry_timestamp), PDO::PARAM_STR);
		
		return $stmt->execute();
	}
  
  public static function updateUserName($newName, $userID)
  {
      $sql = 'UPDATE users SET name = :newName WHERE id = :userID';
    
      $db = static::getDB();
      $stmt = $db->prepare($sql);
      
      $stmt->bindValue(':newName', $newName, PDO::PARAM_STR);
      $stmt->bindValue(':userID', $userID, PDO::PARAM_INT);
      
      return $stmt->execute();
  }
  
  public static function updateUserEmail($newEmail, $userID)
  {
    $sql = 'UPDATE users SET email = :newEmail WHERE id = :userID';
    
      $db = static::getDB();
      $stmt = $db->prepare($sql);
      
      $stmt->bindValue(':newEmail', $newEmail, PDO::PARAM_STR);
      $stmt->bindValue(':userID', $userID, PDO::PARAM_INT);
      
      return $stmt->execute();
  }
  
  public static function updateUserPassword($newPassword, $userID)
  {
    $password_hash = password_hash($newPassword, PASSWORD_DEFAULT);
    
    $sql = 'UPDATE users SET password_hash = :password_hash WHERE id = :userID';
  
    $db = static::getDB();
    $stmt = $db->prepare($sql);
    
    $stmt->bindValue(':password_hash', $password_hash, PDO::PARAM_STR);
    $stmt->bindValue(':userID', $userID, PDO::PARAM_INT);
    
    return $stmt->execute();
  }
}
