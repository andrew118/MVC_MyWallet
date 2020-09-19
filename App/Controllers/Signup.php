<?php

namespace App\Controllers;

use \Core\View;
use \App\Models\User;

class Signup extends \Core\Controller
{
	public function newAction()
	{
		View::RenderTemplate('Signup/new.html');
	}
	
	public function createAction()
	{
		$user = new User($_POST);

		if ($user->save()) {
			View::RenderTemplate('Signup/success.html');
		} else {
			var_dump($user->errors);
		}
		
		
	}
}