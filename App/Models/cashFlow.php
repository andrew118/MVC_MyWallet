<?php

namespace App\Models;

use PDO;

class cashFlow extends \Core\Model
{ 
  public function __construct($data =[])
  {
    foreach ($data as $key => $value) {
      $this->$key = $value;
    }
  }
  
  public static function assignDefaultCategoriesToUser($id)
  {
    $db = static::getDB();
    
    if ($db->query("INSERT INTO payment_methods_assigned_to_users (user_id, name) SELECT '$id', name FROM payment_methods_default")
        && $db->query("INSERT INTO expenses_category_assigned_to_users (user_id, name) SELECT '$id', name FROM expenses_category_default")
        && $db->query("INSERT INTO incomes_category_assigned_to_users (user_id, name) SELECT '$id', name FROM incomes_category_default")) {
        
        return true;
    }
    return false;
  }
  
  public static function loadIncomeCategories($userID)
  {
    $sql = 'SELECT id, name FROM incomes_category_assigned_to_users WHERE user_id = :userID';
    
    $db = static::getDB();
    
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':userID', $userID, PDO::PARAM_INT);
		
    $stmt->setFetchMode(PDO::FETCH_CLASS, get_called_class());
		
    $stmt->execute();
		
		return $stmt->fetchAll();
  }
}