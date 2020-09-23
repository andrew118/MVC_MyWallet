<?php

namespace App\Models;

use PDO;

class User extends \Core\Model
{
	public $errors = [];
	
	
    public function __construct($data)
	{
		foreach ($data as $key => $value) {
			$this->$key = $value;
		}
	}
	
	public static function getAll()
    {
        $db = static::getDB();
        $stmt = $db->query('SELECT id, name FROM users');
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
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
		$sql = 'SELECT * FROM users WHERE email = :email';
		
		$db = static::getDB();
		$stmt = $db->prepare($sql);
		$stmt->bindParam(':email', $email, PDO::PARAM_STR);
		
		$stmt->execute();
		
		return $stmt->fetch() !== false;
	}
}
