<?php

namespace App\Controllers;

use \Core\View;
use \App\Models\User;
use \App\Models\CashFlow;
use \App\Flash;

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
            
			$newUser = User::findByEmail($user->email);

            CashFlow::assignDefaultCategoriesToUser($newUser->id);
            
            Flash::addMessage('Zarejestrowałeś się pomyślnie. Możesz się zalogować');
			
			$this->redirect('/login/new');
      
		} else {
      
			View::RenderTemplate('Signup/new.html', ['user' => $user]);
      
		}
	}
}