<?php

namespace App\Controllers;

use \Core\View;

class Balance extends Authenticated
{
  public function showAction()
  {
    View::RenderTemplate('Balance/show.html');
  }
}