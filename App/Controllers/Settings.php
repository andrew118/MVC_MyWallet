<?php

namespace App\Controllers;

use \Core\View;
use \App\Models\CashFlow;
use \App\Models\User;
use \App\Flash;

class Settings extends Authenticated
{
  public function showAction()
  {
    $args['incomeCategories'] = $this->loadUserIncomeCategories();
    $args['expenseCategories'] = $this->loadUserExpenseCategories();
    $args['paymentMethods'] = $this->loadUserPaymentMethods();
    $user = $this->loadUserData();
  
    View::RenderTemplate('Settings/settings.html', [
          'userSettings' => $args,
          'userData' => $user
          ]);
  }
  
  public function updateNameAction()
  {
    if (isset($_POST['name']) && !empty($_POST['name'])) {
      
      $success = User::updateUserName($_POST['name'], $_SESSION['user_id']);
      
      header('Content-Type: application/json');
      echo json_encode($success);
    }
  }
  
  public function updateEmailAction()
  { 
    if (isset($_POST['submit'])) {
      $email = $_POST['email'];
      $emailIsCorrect = true;
      
      if (empty($email)) {
        
        echo 'Email nie może być pusty';
        $emailIsCorrect = false;
        
      } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        
        echo 'Podaj poprawny email';
        $emailIsCorrect = false;
        
      } elseif (User::emailExists($email)) {
        
        echo 'Podany email jest zajęty';
        $emailIsCorrect = false;
        
      }

      if ($emailIsCorrect) {
        
        $success = User::updateUserEmail($email, $_SESSION['user_id']);
        
        if ($success) {
          
          echo 'Uaktualniono';
          
        } else {
          
          echo 'Wystąpił problem';
          
        }
      }
    }
  }
  
  private function loadUserIncomeCategories()
  {
    return CashFlow::getCategories($_SESSION['user_id'], 'incomes');
  }
  
  private function loadUserExpenseCategories()
  {
    return CashFlow::getCategories($_SESSION['user_id'], 'expenses');
  }
  
  private function loadUserPaymentMethods()
  {
    return CashFlow::getPaymentMethods($_SESSION['user_id']);
  }
  
  private function loadUserData()
  {
    return User::findByID($_SESSION['user_id']);
  }
}