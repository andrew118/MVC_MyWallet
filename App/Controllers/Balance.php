<?php

namespace App\Controllers;

use \Core\View;
use \App\Models\CashFlow;
use \DateTime;
use \App\Flash;

class Balance extends Authenticated
{
  private $beginDate;
  private $endDate;
  private $totalIncomesAmount;
  private $totalExpensesAmount;
  private $sumOfIncomesByCategories;
  private $sumOfExpensesByCategories;
  private $incomesByCategory;
  private $expensesByCategory;
  
  public function showAction()
  {
    $this->setDateRange();
    $this->loadIncomesAndExpensesSum();
    $this->loadSumOfIncomesByCategories();
    $this->loadSumOfExpensesByCategories();
    $this->loadAllIncomes();
    $this->loadAllExpenses();
    $comment = $this->getDifferenceComment();

    View::RenderTemplate('Balance/show.html', [
      'beginDate' => date('Y-m-d', $this->beginDate->getTimestamp()),
      'endDate' => date('Y-m-d', $this->endDate->getTimestamp()),
      'sumIncomes' => $this->totalIncomesAmount['summary'],
      'sumExpenses' => $this->totalExpensesAmount['summary'],
      'comment' => $comment,
      'incomes' => $this->sumOfIncomesByCategories,
      'expenses' => $this->sumOfExpensesByCategories,
      'allIncomes' => $this->incomesByCategory,
      'allExpenses' => $this->expensesByCategory
    ]);
  }

  private function setDateRange()
  {
    $this->beginDate = new DateTime();
    $this->endDate = new DateTime();
  
    if (isset($_POST['previous'])) {
      
      $this->beginDate->modify('first day of previous month');
      $this->endDate->modify('last day of previous month');
      unset($_POST['previous']);
      
    } else if (isset($_POST['begin_date'], $_POST['end_date'])) {
      
      if ($this->validateDateRange($_POST['begin_date'], $_POST['end_date'])) {
        
        $this->beginDate = date_create_from_format('Y-m-d', $_POST['begin_date']);
        $this->endDate = date_create_from_format('Y-m-d', $_POST['end_date']);
        unset($_POST['begin_date']);
        unset($_POST['end_date']);
        
      } else {

        $this->redirect('/balance/show');
        
      }
    } else {
      
      $this->beginDate->modify('first day of this month');
      $this->endDate->modify('last day of this month');
      unset($_POST['current']);
      
    }
  }
  
  private function validateDateRange($startDate, $finishDate)
  {
    if (cashFlow::checkDatePattern($_POST['begin_date']) == 0
          || cashFlow::checkDatePattern($_POST['end_date']) == 0) {
        
        Flash::addMessage('Wymagany format daty RRRR-MM-DD');
        
        return false;
      }
      
    if (!cashFlow::isDateCorrect($_POST['begin_date'])
        || !cashFlow::isDateCorrect($_POST['end_date'])) {
      
      Flash::addMessage('Niepoprawna data');
      
      return false;
    }
    
    $begin = DateTime::createFromFormat('Y-m-d', $_POST['begin_date']);
    $end = DateTime::createFromFormat('Y-m-d', $_POST['end_date']);
    if ($begin->getTimestamp() > $end->getTimestamp()) {
      Flash::addMessage('Początkowa data musi być mniejsza niż końcowa');
      
      return false;
    }
    
    return true;
  }

  private function loadIncomesAndExpensesSum()
  {
    $this->totalIncomesAmount = CashFlow::getSumIncomesExpenses($_SESSION['user_id'], $this->beginDate->format('Y-m-d'), $this->endDate->format('Y-m-d'), 'incomes');
    
    $this->totalExpensesAmount = CashFlow::getSumIncomesExpenses($_SESSION['user_id'], $this->beginDate->format('Y-m-d'), $this->endDate->format('Y-m-d'), 'expenses');
  }
  
  private function getDifferenceComment()
  {
    if ($this->totalIncomesAmount > $this->totalExpensesAmount) {
      return ['balanceInfo'  => 'badge badge-success', 'balanceComment' => 'Dobrze zarządzasz! '];
    }
    
    if ($this->totalIncomesAmount == $this->totalExpensesAmount) {
      return ['balanceInfo'  => 'badge badge-warning', 'balanceComment' => 'Przejrzyj wydatki. Coś idzie nie najlepiej. '];
    }
    
    if ($this->totalIncomesAmount < $this->totalExpensesAmount) {
      return ['balanceInfo'  => 'badge badge-danger', 'balanceComment' => 'Nie wygląda to dobrze...  '];
    }
  }
  
  private function loadSumOfIncomesByCategories()
  {
    $incomes = new CashFlow;
    
    $this->sumOfIncomesByCategories = $incomes->getIncomesExpensesByCategories($_SESSION['user_id'], $this->beginDate->format('Y-m-d'), $this->endDate->format('Y-m-d'), 'incomes');
  }
  
  private function loadSumOfExpensesByCategories()
  {
    $expenses = new CashFlow;
    
    $this->sumOfExpensesByCategories = $expenses->getIncomesExpensesByCategories($_SESSION['user_id'], $this->beginDate->format('Y-m-d'), $this->endDate->format('Y-m-d'), 'expenses');
  }
  
  public function loadAllIncomes()
  {
    $userID = $_SESSION['user_id'];
    
    $incomes = new CashFlow;
    $this->incomesByCategory = $incomes->getAllByCategory($userID, $this->beginDate->format('Y-m-d'), $this->endDate->format('Y-m-d'), 'incomes');
  }
  
    public function loadAllExpenses()
  {
    $userID = $_SESSION['user_id'];
    
    $expenses = new CashFlow;
    $this->expensesByCategory = $expenses->getAllByCategory($userID, $this->beginDate->format('Y-m-d'), $this->endDate->format('Y-m-d'), 'expenses');
  }
}