<?php

namespace App\Controllers;

use \Core\View;
use \App\Models\CashFlow;

class Expenses extends Authenticated
{
  public function addExpense()
  {
    View::RenderTemplate('Expenses/add.html', [
      'categories' => $this->loadUserCategories(),
      'payments' => $this->loadPaymentMethods()
    ]);
  }
  
  private function loadUserCategories()
  {
    return CashFlow::getCategories($_SESSION['user_id'], 'expenses');
  }
  
  private function loadPaymentMethods()
  {
    return CashFlow::getPaymentMethods($_SESSION['user_id']);
  }
}