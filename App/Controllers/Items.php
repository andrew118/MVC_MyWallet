<?php

namespace App\Controllers;

use \Core\View;

class Items extends \Core\Controller
{
	protected function before()
	{
		$this->requireLogin();
	}
	
	public function indexAction()
	{
		View::renderTemplate('Items/index.html');
	}
	
	public function newAction()
	{
		echo('Nowy wydatek');
	}
}