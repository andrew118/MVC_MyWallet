<?php

namespace App\Controllers;

use \Core\View;
use \App\Models\CashFlow;
use \App\Flash;

class Settings extends Authenticated
{
  public function showAction()
  {
    $args['incomeCategories'] = $this->loadUserIncomeCategories();
    $args['expenseCategories'] = $this->loadUserExpenseCategories();
  
    View::RenderTemplate('Settings/settings.html', [
          'userSettings' => $args
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
}