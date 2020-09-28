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
			$this->redirect('/signup/success');
		} else {
			View::RenderTemplate('Signup/new.html', ['user' => $user]);
		}
	}
	
	public function successAction()
	{
		View::RenderTemplate('Signup/success.html');
	}
}