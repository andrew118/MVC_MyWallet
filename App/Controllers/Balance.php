<?php

namespace App\Controllers;

use \Core\View;
use \App\Models\CashFlow;
use \DateTime;

class Balance extends Authenticated
{
  private $beginDate;
  private $endDate;
  
  public $errors = [];
  
  public function showAction()
  {
    $this->setDateRange();
    
    View::RenderTemplate('Balance/show.html', [
      'beginDate' => date('Y-m-d', $this->beginDate->getTimestamp()),
      'endDate' => date('Y-m-d', $this->endDate->getTimestamp())
    ]);
  }
  
  private function setDateRange()
  {
    $this->beginDate = new DateTime();
    $this->endDate = new DateTime();
  
    if (isset($_POST['previous'])) {
      
      $this->beginDate->modify('first day of previous month');
      $this->endDate->modify('last day of previous month');
      unset($_POST['previous']);
      
    } else if (isset($_POST['begin_date'], $_POST['end_date'])) {
      
      $this->validateDateRange($_POST['begin_date'], $_POST['end_date']);
      
      if (empty($this->errors)) {
        
        $this->beginDate = date_create_from_format('Y-m-d', $_POST['begin_date']);
        $this->endDate = date_create_from_format('Y-m-d', $_POST['end_date']);
        unset($_POST['begin_date']);
        unset($_POST['end_date']);
        
      }
    } else {
      
      $this->beginDate->modify('first day of this month');
      $this->endDate->modify('last day of this month');
      unset($_POST['current']);
      
    }
  }
  
  private function validateDateRange($startDate, $finishDate)
  {
    if (cashFlow::checkDatePattern($_POST['begin_date']) == 0
          || cashFlow::checkDatePattern($_POST['end_date']) == 0) {
        
        $this->errors[] = "Wymagany format daty RRRR-MM-DD";
        return false;
      }
      
      if (!cashFlow::isDateCorrect($_POST['begin_date'])
          && !cashFlow::isDateCorrect($_POST['end_date'])) {
        
        $this->errors[] = "Niepoprawna data";
        return false;
      }
      
      return true;
  }
}