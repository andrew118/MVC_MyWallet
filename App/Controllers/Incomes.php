<?php

namespace App\Controllers;

use \Core\View;
use \App\Models\CashFlow;
use \App\Flash;

class Incomes extends Authenticated
{
  public function addIncomeAction()
	{
    View::renderTemplate('Incomes/add.html', [ 'categories' => $this->getUserCategories()]);
	}
	
	public function newAction()
	{ 
    $moneyFlow = new CashFlow($_POST);
    
    if ($moneyFlow->saveIncome($_SESSION['user_id'])) {
      Flash::addMessage('Przychód dodany');
      View::RenderTemplate('Incomes/add.html', [ 'categories' => $this->getUserCategories()]);
    } else {
      View::RenderTemplate('Incomes/add.html', ['income' => $moneyFlow, 'categories' => $this->getUserCategories()]);
    }
	}
  
  private function getUserCategories()
  {
    return CashFlow::loadCategories($_SESSION['user_id'], 'incomes');
  }
    
  public static function todayDate() {
      return date('Y-m-d');
  }
}