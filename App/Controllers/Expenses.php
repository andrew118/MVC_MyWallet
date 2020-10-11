<?php

namespace App\Controllers;

use \Core\View;
use \App\Models\CashFlow;

class Expenses extends Authenticated
{
  public function addExpense()
  {
    View::RenderTemplate('Expenses/add.html', [
      'categories' => $this->getUserCategories()]);
  }
  
  private function getUserCategories()
  {
    return CashFlow::loadCategories($_SESSION['user_id'], 'expenses');
  }
}