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
    return CashFlow::getCategories($_SESSION['user_id'], 'incomes');
  }
  
  private function loadUserExpenseCategories()
  {
    return CashFlow::getCategories($_SESSION['user_id'], 'expenses');
  }
  
  private function loadUserPaymentMethods()
  {
    return CashFlow::getPaymentMethods($_SESSION['user_id']);
  }
  
  private function loadUserData()
  {
    return User::findByID($_SESSION['user_id']);
  }
}