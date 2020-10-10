<?php

namespace App\Controllers;

use \Core\View;
use \App\Models\cashFlow;

class Incomes extends Authenticated
{  
  public function addIncomeAction()
	{
    $userIncomeCategories = $this->getCategories();
    //var_dump($userIncomeCategories);
    View::renderTemplate('Incomes/add.html', [ 'categories' => $userIncomeCategories]);
	}
	
	public function newAction()
	{ 
    var_dump($this->getIncomes());
	}
    
  public static function todayDate() {
      return date('Y-m-d');
  }
  
  private function getCategories()
  {
    return cashFlow::loadIncomeCategories($_SESSION['user_id']);
  }
}