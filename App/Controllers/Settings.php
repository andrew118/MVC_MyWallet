<?php

namespace App\Controllers;

use \Core\View;
use \App\Models\CashFlow;
use \App\Models\User;
use \App\Flash;

class Settings extends Authenticated
{
  public function showAction()
  {
    $args['incomeCategories'] = $this->loadUserIncomeCategories();
    $args['expenseCategories'] = $this->loadUserExpenseCategories();
    $args['paymentMethods'] = $this->loadUserPaymentMethods();
    $user = $this->loadUserData();
  
    View::RenderTemplate('Settings/settings.html', [
          'userSettings' => $args,
          'userData' => $user
          ]);
  }
  
  private function loadUserIncomeCategories()
  {
    $userID = $_SESSION['user_id'];
    
    return CashFlow::getCategories($userID, 'incomes');
  }
  
  private function loadUserExpenseCategories()
  {
    $userID = $_SESSION['user_id'];
    
    return CashFlow::getCategories($userID, 'expenses');
  }
  
  private function loadUserPaymentMethods()
  {
    $userID = $_SESSION['user_id'];
    
    return CashFlow::getPaymentMethods($userID);
  }
  
  private function loadUserData()
  {
    $userID = $_SESSION['user_id'];
    
    return User::findByID($userID);
  }
}