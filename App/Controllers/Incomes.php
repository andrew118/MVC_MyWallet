<?php

namespace App\Controllers;

use \Core\View;
use \App\Models\CashFlow;

class Incomes extends Authenticated
{
  public function addIncomeAction()
	{
    $userIncomeCategories = CashFlow::loadIncomeCategories($_SESSION['user_id']);
    
    View::renderTemplate('Incomes/add.html', [ 'categories' => $userIncomeCategories]);
	}
	
	public function newAction()
	{ 
    $moneyFlow = new CashFlow($_POST);
    var_dump($moneyFlow);
	}
    
  public static function todayDate() {
      return date('Y-m-d');
  }
}