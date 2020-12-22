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
      $sql = 'SELECT * FROM expenses_category_assigned_to_users WHERE user_id = :userID';
    }
    
    $db = static::getDB();
    
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':userID', $userID, PDO::PARAM_INT);
		
    $stmt->execute();
		
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
  
  public static function getPaymentMethods($userID)
  {
    $sql = 'SELECT id, name FROM payment_methods_assigned_to_users WHERE user_id = :userID';
    
    $db = static::getDB();
    
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':userID', $userID, PDO::PARAM_INT);
		
    $stmt->execute();
		
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
  
  public static function addIncomeCategory($userID, $incomeCategoryName)
  {
    $categoryCorrect = static::validateCategoryName($userID, $incomeCategoryName, 'incomes');
    
    if ($categoryCorrect) {
      
      $sql = 'INSERT INTO incomes_category_assigned_to_users (user_id, name) VALUES (:userID, :incomeName)';
      
      $db = static::getDB();
      
      $stmt = $db->prepare($sql);
      $stmt->bindParam(':userID', $userID, PDO::PARAM_INT);
      $stmt->bindParam(':incomeName', $incomeCategoryName, PDO::PARAM_STR);
      
      return $stmt->execute();
      
    } else {
      
      return false;
      
    }
  }
  
  public static function validateCategoryName($userID, $categoryName, $tableIndicator)
  {
    $existingUserCategories = static::getCategories($userID, $tableIndicator);
    
    $categoryNameLowerCase = strtolower($categoryName);
    $categoryNameNoSpaces = preg_replace('/\s+/', '', $categoryNameLowerCase);
    
    foreach ($existingUserCategories as $existingCategory) {
      
      $existingCategoryLowerCase = strtolower($existingCategory['name']);
      $existingCategoryNoSpaces = preg_replace('/\s+/', '', $existingCategoryLowerCase);
      
      if (($categoryNameLowerCase == $existingCategoryLowerCase) || ($categoryNameNoSpaces == $existingCategoryNoSpaces)) {
        
        return false;
        
      }
    }
    
    return true;
  }
  
  public static function checkIncomesAssignedToCategory($userID, $categoryID) {
    
    $sql = 'SELECT * FROM incomes WHERE user_id = :userID AND income_category_assigned_to_user_id = :categoryID';
    
    $db = static::getDB();
    
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':userID', $userID, PDO::PARAM_INT);
    $stmt->bindParam(':categoryID', $categoryID, PDO::PARAM_INT);
    
    $stmt->execute();
    
    return $stmt->fetch() !== false;
    
  }
  
  public static function removeIncomeCategory($userID, $categoryID)
  {
    
    $sql = 'DELETE FROM incomes_category_assigned_to_users WHERE id = :categoryID AND user_id = :userID';
    
    $db = static::getDB();
    
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':userID', $userID, PDO::PARAM_INT);
    $stmt->bindParam(':categoryID', $categoryID, PDO::PARAM_INT);
    
    $stmt->execute();
    
    return $stmt->rowCount();
    
  }
  
  public static function updateIncomesCategory($userID, $newCategoryID, $replacingCategoryID)
  {
    
    $sql = 'UPDATE incomes SET income_category_assigned_to_user_id = :newCategoryID WHERE user_id = :userID AND income_category_assigned_to_user_id = :replacingCategoryID';
    
    $db = static::getDB();
    
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':newCategoryID', $newCategoryID, PDO::PARAM_INT);
    $stmt->bindParam(':userID', $userID, PDO::PARAM_INT);
    $stmt->bindParam(':replacingCategoryID', $replacingCategoryID, PDO::PARAM_INT);
    
    return $stmt->execute();
    
  }
  
  public static function addExpenseCategory($userID, $categoryName, $categoryLimit)
  {
    
    $categoryCorrect = static::validateCategoryName($userID, $categoryName, 'expenses');
    
    if ($categoryCorrect) {
      
      if ($categoryLimit <= 0 || $categoryLimit == '') {
        
        $sql = 'INSERT INTO expenses_category_assigned_to_users (user_id, name) VALUES (:userID, :expenseName)';
        
        $db = static::getDB();
      
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':userID', $userID, PDO::PARAM_INT);
        $stmt->bindParam(':expenseName', $categoryName, PDO::PARAM_STR);
        
      } else {
        
        $sql = 'INSERT INTO expenses_category_assigned_to_users (user_id, name, limit_enabled, user_limit) VALUES (:userID, :expenseName, true, :categoryLimit)';
        
        $db = static::getDB();
      
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':userID', $userID, PDO::PARAM_INT);
        $stmt->bindParam(':expenseName', $categoryName, PDO::PARAM_STR);
        $stmt->bindParam(':categoryLimit', $categoryLimit, PDO::PARAM_STR);
        
      }
      
      return $stmt->execute();
      
    } else {
      
      return false;
      
    }
    
  }
  
  public static function updateExpenseCategory($userID, $categoryLimit, $categoryID)
  {
    
    if ($categoryLimit > 0) {
      
      $sql = 'UPDATE expenses_category_assigned_to_users SET limit_enabled = true, user_limit = :categoryLimit WHERE id = :categoryID AND user_id = :userID';
      
      $db = static::getDB();
    
      $stmt = $db->prepare($sql);
      $stmt->bindParam(':categoryLimit', $categoryLimit, PDO::PARAM_STR);
      $stmt->bindParam(':categoryID', $categoryID, PDO::PARAM_INT);
      $stmt->bindParam(':userID', $userID, PDO::PARAM_INT);
      
      return $stmt->execute();
      
    } else if ($categoryLimit <= 0) {
      
     $sql = 'UPDATE expenses_category_assigned_to_users SET limit_enabled = false, user_limit = NULL WHERE id = :categoryID AND user_id = :userID';
      
      $db = static::getDB();
    
      $stmt = $db->prepare($sql);
      $stmt->bindParam(':categoryID', $categoryID, PDO::PARAM_INT);
      $stmt->bindParam(':userID', $userID, PDO::PARAM_INT);
      
      return $stmt->execute();
      
    } else {
      
      return false;
      
    }

  }
  
  public static function addPaymentMethod($userID, $paymentName)
  {
    $nameCorrect = static::validatePaymentMethod($userID, $paymentName);
    
    if ($nameCorrect) {
      
      $sql = 'INSERT INTO payment_methods_assigned_to_users (user_id, name) VALUES (:userID, :paymentName)';
      
      $db = static::getDB();
      
      $stmt = $db->prepare($sql);
      $stmt->bindParam(':userID', $userID, PDO::PARAM_INT);
      $stmt->bindParam(':paymentName', $paymentName, PDO::PARAM_STR);
      
      return $stmt->execute();
      
    } else {
      
      return false;
      
    }
  }
  
  public static function checkPaymentMethodAssignedToExpense($userID, $paymentID)
  {
    
    $sql = 'SELECT * FROM expenses WHERE user_id = :userID AND payment_method_assigned_to_user_id = :paymentID';
    
    $db = static::getDB();
    
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':userID', $userID, PDO::PARAM_INT);
    $stmt->bindParam(':paymentID', $paymentID, PDO::PARAM_INT);
    
    $stmt->execute();
    
    return $stmt->fetch() !== false;
    
  }
  
  public static function updatePaymentMethod($userID, $newPaymentID, $replacingPaymentID)
  {
    
    $sql = 'UPDATE expenses SET payment_method_assigned_to_user_id = :newPaymentID WHERE user_id = :userID AND payment_method_assigned_to_user_id = :replacingPaymentID';
    
    $db = static::getDB();
    
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':newPaymentID', $newPaymentID, PDO::PARAM_INT);
    $stmt->bindParam(':userID', $userID, PDO::PARAM_INT);
    $stmt->bindParam(':replacingPaymentID', $replacingPaymentID, PDO::PARAM_INT);
    
    return $stmt->execute();
    
  }
  
  public static function deletePaymentMethod($userID, $paymentID)
  {
    $sql = 'DELETE FROM payment_methods_assigned_to_users WHERE id = :paymentID AND user_id = :userID';
    
    $db = static::getDB();
    
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':paymentID', $paymentID, PDO::PARAM_INT);
    $stmt->bindParam(':userID', $userID, PDO::PARAM_INT);
    
    return $stmt->execute();
  }
  
  public static function validatePaymentMethod($userID, $paymentName)
  {
    $existingUserMethods = static::getPaymentMethods($userID);
    $methodNameLowerCase = strtolower($paymentName);
    $methodNameNoSpaces = preg_replace('/\s+/', '', $methodNameLowerCase);
    
    foreach ($existingUserMethods as $existingMethod) {
      
      $existingMethodLowerCase = strtolower($existingMethod['name']);
      $existingMethodNoSpaces = preg_replace('/\s+/', '', $existingMethodLowerCase);
      
      if (($methodNameLowerCase == $existingMethodLowerCase) || ($methodNameNoSpaces == $existingMethodNoSpaces)) {
        
        return false;
        
      }
    }
    
    return true;
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
    
    if (!static::isDateCorrect($date)) {
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
  
  public static function getSumIncomesExpenses($userID, $beginDate, $endDate, $incomeExpenseIndicator)
  {
    if ($incomeExpenseIndicator == 'incomes') {
      $sql = 'SELECT SUM(amount) AS summary FROM incomes WHERE user_id = :userID AND date_of_income BETWEEN :begin AND :end';
    } else if ($incomeExpenseIndicator == 'expenses') {
      $sql = 'SELECT SUM(amount) AS summary FROM expenses WHERE user_id = :userID AND date_of_expense BETWEEN :begin AND :end';
    }
      
      $db = static::getDB();
      $stmt = $db->prepare($sql);
      
      $stmt->bindValue(':userID', $userID, PDO::PARAM_INT);
      $stmt->bindValue('begin', $beginDate, PDO::PARAM_STR);
      $stmt->bindValue('end', $endDate, PDO::PARAM_STR);
      
      $stmt->execute();
      
      return $stmt->fetch(PDO::FETCH_ASSOC);
  }
  
  public function getIncomesExpensesByCategories($userID, $beginDate, $endDate, $incomeExpenseIndicator)
  {
    if ($incomeExpenseIndicator == 'incomes') {
      $sql = 'SELECT cat.name AS inc_name, cat.id AS id, SUM(inc.amount) AS inc_amount FROM incomes AS inc, incomes_category_assigned_to_users AS cat WHERE inc.user_id = :userID AND cat.user_id = :userID AND inc.income_category_assigned_to_user_id = cat.id AND inc.date_of_income BETWEEN :beginDate AND :endDate GROUP BY inc_name ORDER BY inc_amount DESC';
    }
    
    if ($incomeExpenseIndicator == 'expenses') {
      $sql = 'SELECT cat.name AS ex_name, cat.id AS id, SUM(ex.amount) AS ex_amount FROM expenses AS ex, expenses_category_assigned_to_users AS cat WHERE ex.user_id = :userID AND cat.user_id = :userID AND ex.expense_category_assigned_to_user_id = cat.id AND ex.date_of_expense BETWEEN :beginDate AND :endDate GROUP BY ex_name ORDER BY ex_amount DESC';
    }
    
    
    $db = static::getDB();
    
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':userID', $userID, PDO::PARAM_INT);
    $stmt->bindParam(':beginDate', $beginDate, PDO::PARAM_STR);
    $stmt->bindParam(':endDate', $endDate, PDO::PARAM_STR);
		
    $stmt->execute();
		
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
  
  public function getAllByCategory($userID, $beginDate, $endDate, $incomeExpenseIndicator)
  {
    if($incomeExpenseIndicator == 'incomes') {
      $sql = 'SELECT inc.id AS id, inc.amount AS amount, inc.date_of_income AS date, inc.income_comment AS comment, income_category_assigned_to_user_id AS catID FROM incomes AS inc WHERE inc.user_id = :userID AND inc.date_of_income BETWEEN :beginDate AND :endDate ORDER BY catID';
    }
    if ($incomeExpenseIndicator == 'expenses') {
      $sql = 'SELECT ex.id AS id, ex.amount AS amount, ex.date_of_expense AS date, ex.expense_comment AS comment, expense_category_assigned_to_user_id AS catID, userPay.name AS payName, userPay.id AS payId FROM expenses AS ex, payment_methods_assigned_to_users AS userPay WHERE ex.user_id = :userID AND ex.date_of_expense BETWEEN :beginDate AND :endDate AND ex.payment_method_assigned_to_user_id = userPay.id ORDER BY catID';
    }
    
    $db = static::getDB();
    
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':userID', $userID, PDO::PARAM_INT);
    $stmt->bindParam(':beginDate', $beginDate, PDO::PARAM_STR);
    $stmt->bindParam(':endDate', $endDate, PDO::PARAM_STR);
		
    $stmt->execute();
		
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
  
  public function updateExpense()
  {
    $sql = 'UPDATE expenses SET expense_category_assigned_to_user_id = :expenseCategory, payment_method_assigned_to_user_id = :paymentID, amount = :amount, date_of_expense = :dateExpense, expense_comment = :comment WHERE id = :expenseID';
    
    $db = static::getDB();
    
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':expenseCategory', $this->category, PDO::PARAM_INT);
    $stmt->bindParam(':paymentID', $this->payment, PDO::PARAM_INT);
    $stmt->bindParam(':amount', $this->money, PDO::PARAM_STR);
    $stmt->bindParam(':dateExpense', $this->dater, PDO::PARAM_STR);
    $stmt->bindParam(':comment', $this->comment, PDO::PARAM_STR);
    $stmt->bindParam(':expenseID', $this->elementID, PDO::PARAM_INT);
    
    return $stmt->execute();
  }
  
  public function updateIncome()
  {
    $sql = 'UPDATE incomes SET income_category_assigned_to_user_id = :incomeCategory, amount = :amount, date_of_income = :dateIncome, income_comment = :comment WHERE id = :incomeID';
    
    $db = static::getDB();
    
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':incomeCategory', $this->category, PDO::PARAM_INT);
    $stmt->bindParam(':amount', $this->money, PDO::PARAM_STR);
    $stmt->bindParam(':dateIncome', $this->dater, PDO::PARAM_STR);
    $stmt->bindParam(':comment', $this->comment, PDO::PARAM_STR);
    $stmt->bindParam(':incomeID', $this->elementID, PDO::PARAM_INT);
    
    return $stmt->execute();
  }
}