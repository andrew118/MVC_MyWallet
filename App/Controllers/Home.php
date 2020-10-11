<?php

namespace App\Controllers;

use \Core\View;

class Home extends Authenticated
{
  public function indexAction()
  {
    View::renderTemplate('Home/index.html');
  }
  
  public static function todayDate()
  {
    return date('Y-m-d');
  }
}
