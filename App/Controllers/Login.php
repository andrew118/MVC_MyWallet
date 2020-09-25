<?php

namespace App\Controllers;

use Core\View;
use \App\Models\User;

class Login extends \Core\Controller
{
	public function newAction()
	{
		View::renderTemplate('Login/new.html');
	}
	
	public function createAction()
	{
		$user = User::findByEmail($_POST['email']);
		
		var_dump($user);
	}
}