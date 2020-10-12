<?php

namespace App\Models;

use PDO;

class cashFlow extends \Core\Model
{ 
  public $errors = [];
  

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
  
  public static function getCategories($userID, $tableIndicator)
  {  
    if ($tableIndicator == 'incomes') {
      $sql = 'SELECT id, name FROM incomes_category_assigned_to_users WHERE user_id = :userID';
    } else if ($tableIndicator == 'expenses') {
      $sql = 'SELECT id, name FROM expenses_category_assigned_to_users WHERE user_id = :userID';
    }
    
    $db = static::getDB();
    
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':userID', $userID, PDO::PARAM_INT);
		
    $stmt->setFetchMode(PDO::FETCH_CLASS, get_called_class());
		
    $stmt->execute();
		
		return $stmt->fetchAll();
  }
  public static function getPaymentMethods($userID)
  {
    $sql = 'SELECT id, name FROM payment_methods_assigned_to_users WHERE user_id = :userID';
    
    $db = static::getDB();
    
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':userID', $userID, PDO::PARAM_INT);
		
    $stmt->setFetchMode(PDO::FETCH_CLASS, get_called_class());
		
    $stmt->execute();
		
		return $stmt->fetchAll();
  }
  
  public function saveIncome($userID)
  {
    $this->validate();
    
    if (empty($this->errors)) {
      $sql = 'INSERT INTO incomes (user_id, income_category_assigned_to_user_id, amount, date_of_income, income_comment) VALUES (:userID, :incomeID, :money, :date, :comment)';
      
      $db = static::getDB();
      $stmt = $db->prepare($sql);
      
      $stmt->bindValue(':userID', $userID, PDO::PARAM_INT);
      $stmt->bindValue(':incomeID', $this->category, PDO::PARAM_INT);
      $stmt->bindValue(':money', $this->money, PDO::PARAM_STR);
      $stmt->bindValue('date', $this->dater, PDO::PARAM_STR);
      $stmt->bindValue('comment', $this->comment, PDO::PARAM_STR);
      
      return $stmt->execute();
    }
  }
  
  public function saveExpense($userID)
  {
    $this->validate();
    
    if (empty($this->errors)) {
      $sql = 'INSERT INTO expenses (user_id, expense_category_assigned_to_user_id, payment_method_assigned_to_user_id, amount, date_of_expense, expense_comment) VALUES (:userID, :expenseID, :paymentID, :money, :date, :comment)';
      
      $db = static::getDB();
      $stmt = $db->prepare($sql);
      
      $stmt->bindValue(':userID', $userID, PDO::PARAM_INT);
      $stmt->bindValue(':expenseID', $this->category, PDO::PARAM_INT);
      $stmt->bindValue(':paymentID', $this->payment, PDO::PARAM_INT);
      $stmt->bindValue(':money', $this->money, PDO::PARAM_STR);
      $stmt->bindValue('date', $this->dater, PDO::PARAM_STR);
      $stmt->bindValue('comment', $this->comment, PDO::PARAM_STR);
      
      return $stmt->execute();
    }

    return false;
  }
  
  private function validate()
  {
    if ($this->money == '' || $this->money <= 0) {
      $this->errors[] = 'Podaj poprawną kwotę przychodu';
    }
    
    $date = trim($this->dater);
    if (static::checkDatePattern($date) == 0) {
      $this->errors[] = 'Podaj datę w formacie RRRR-MM-DD';
    }
    
    if (!$this->static::isDateCorrect($date)) {
      $this->errors[] = 'Podaj poprawną datę';
    }
  }
  
  public static function checkDatePattern($date)
  {
    return preg_match('/^\d{4}-\d{2}-\d{2}$/', $date);
  }
  
  public static function isDateCorrect($date)
  {
    $separated_date = explode('-', $date);
    
    return checkdate($separated_date[1], $separated_date[2], $separated_date[0]); //format M-D-Y
  }
}