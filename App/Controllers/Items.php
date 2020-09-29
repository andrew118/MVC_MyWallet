<?php

namespace App\Controllers;

use \Core\View;
use \App\Auth;

class Items extends \Core\Controller
{
	public function indexAction()
	{
		if (! Auth::isLoggedIn()) {
			$this->redirect('/login');
		}
		
		View::renderTemplate('Items/index.html');
	}
}