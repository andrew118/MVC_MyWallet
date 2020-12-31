<?php

namespace App\Controllers;

use \Core\View;
use \App\Models\CashFlow;
use \App\Flash;

class Incomes extends Authenticated
{
  public function addIncomeAction()
	{
    View::renderTemplate('Incomes/add.html', [ 'categories' => $this->loadUserCategories()]);
	}
	
	public function newAction()
	{ 
    $moneyFlow = new CashFlow($_POST);
    
    if ($moneyFlow->saveIncome()) {
      Flash::addMessage('Przychód dodany');
      
      $this->redirect('/incomes/add-income');
    } else {
      View::RenderTemplate('Incomes/add.html', ['income' => $moneyFlow, 'categories' => $this->loadUserCategories()]);
    }
	}
  
  private function loadUserCategories()
  {
    return CashFlow::getCategories('incomes');
  }
  
  public function updateRecordAction()
  {
    $moneyFlow = new CashFlow($_POST);
    
    if ($moneyFlow->updateIncome()) {
      Flash::addMessage('Przychód poprawiony');
      
      $this->redirect('/balance/show');
    } else {
      Flash::addMessage('Nie udało się poprawić przychodu');
      
      $this->redirect('/balance/show');
    }
    
  }
}