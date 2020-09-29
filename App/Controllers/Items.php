<?php

namespace App\Controllers;

use \Core\View;

class Items extends \Core\Controller
{
	public function indexAction()
	{
		$this->requireLogin();
		
		View::renderTemplate('Items/index.html');
	}
}