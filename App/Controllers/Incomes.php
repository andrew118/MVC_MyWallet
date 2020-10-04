<?php

namespace App\Controllers;

use \Core\View;
use \App\Models\cashFlow;

class Incomes extends Authenticated
{
	public function addIncomeAction()
	{
		View::renderTemplate('Incomes/add.html');
	}
	
	public function newAction()
	{
		echo('Nowy wydatek');
	}
}