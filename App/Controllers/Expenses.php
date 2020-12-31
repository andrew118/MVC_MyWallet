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
    } else {
      Flash::addMessage('Nie udało się poprawić wydatku');
      
      $this->redirect('/balance/show');
    }
    
  }
  
  public function getExpensesLimitsAction()
  {
    $limits = CashFlow::getCategories('expenses');
    
    header('Content-Type: application/json');
    echo json_encode($limits);
  }
  
  public function getSumOfExpensesInCategoryAction()
  {
    if (isset($_POST['categoryID'])) {
      
      $firstMonthDay = new DateTime();
      $firstMonthDay->modify('first day of this month');
      $lastMonthDay = new DateTime();
      $lastMonthDay->modify('last day of this month');
      
      $respond = CashFlow::getSumForExpenseCategoryThisMonth($_SESSION['user_id'], $_POST['categoryID'], $firstMonthDay->format('Y-m-d'), $lastMonthDay->format('Y-m-d'));
      
      echo $respond['sum'];
    }
  }
  
  private function loadUserCategories()
  {
    return CashFlow::getCategories('expenses');
  }
  
  private function loadPaymentMethods()
  {
    return CashFlow::getPaymentMethods($_SESSION['user_id']);
  }
}