<?php

namespace App\Controllers;

use \Core\View;
use \App\Models\CashFlow;
use \App\Flash;

class Expenses extends Authenticated
{
  public function addExpenseAction()
  {
    View::RenderTemplate('Expenses/add.html', [
      'categories' => $this->loadUserCategories(),
      'payments' => $this->loadPaymentMethods()
    ]);
  }
  
  public function newAction()
  {
    $moneyFlow = new CashFlow($_POST);
    
    if ($moneyFlow->saveExpense($_SESSION['user_id'])) {
      Flash::addMessage('Wydatek dodany');
      
      $this->redirect('/expenses/add-expense');
    } else {
      View::RenderTemplate('Expenses/add.html', [
        'expense' => $moneyFlow,
        'categories' => $this->loadUserCategories(),
        'payments' => $this->loadPaymentMethods()
      ]);
    }
  }
  
  public function updateRecordAction()
  {
    $moneyFlow = new CashFlow($_POST);
    
    if ($moneyFlow->updateExpense()) {
      Flash::addMessage('Wydatek poprawiony');
      
      $this->redirect('/balance/show');
    }
    
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