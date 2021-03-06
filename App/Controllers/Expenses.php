<?php

namespace App\Controllers;

use \Core\View;
use \App\Models\CashFlow;
use \App\Flash;
use \DateTime;

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
    
    if ($moneyFlow->saveExpense()) {
      Flash::addMessage('Wydatek dodany');
      
      $this->redirect('/expenses/add-expense');
      
    } else {
      
      Flash::addMessage('Błąd! Wydatek nie został dodany', Flash::WARNING);
      
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
      
    } else {
      
      Flash::addMessage('Nie udało się poprawić wydatku', Flash::WARNING);
      
      $this->redirect('/balance/show');
      
    }
    
  }
  
  public function getLimitsAndSumForExpensesByCategoryAction()
  {   
      $firstMonthDay = new DateTime();
      $firstMonthDay->modify('first day of this month');
      $lastMonthDay = new DateTime();
      $lastMonthDay->modify('last day of this month');
      
      $limitsAndSum = CashFlow::getLimitsAndSumForExpensesByCategoryThisMonth($firstMonthDay->format('Y-m-d'), $lastMonthDay->format('Y-m-d'));
      
    header('Content-Type: application/json');
    echo json_encode($limitsAndSum);
  }
  
  private function loadUserCategories()
  {
    return CashFlow::getCategories('expenses');
  }
  
  private function loadPaymentMethods()
  {
    return CashFlow::getPaymentMethods();
  }
}