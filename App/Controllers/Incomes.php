<?php

namespace App\Controllers;

use \Core\View;

class Items extends Authenticated
{
	public function indexAction()
	{
		View::renderTemplate('Incomes/add.html');
	}
	
	public function newAction()
	{
		echo('Nowy wydatek');
	}
}