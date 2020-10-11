<?php

namespace App\Controllers;

use \Core\View;
use \App\Models\CashFlow;

class Expenses extends Authenticated
{
  public function addExpense()
  {
    View::RenderTemplate('Expenses/add.html');
  }
}