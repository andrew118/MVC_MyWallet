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
    $user = $this->loadUserDetails();
  
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
  
  public function checkEmailExistanceAction()
  {
    $email = $_POST['email'];
    $is_valid = User::EmailExists($email);
		
		echo $is_valid;
    
  }
  
  public function updateEmailAction()
  { 
    if (isset($_POST['submit'])) {
      
      $email = $_POST['email'];
      $emailIsCorrect = true;
      
      if (empty($email)) {
          $emailIsCorrect = false;
      } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
          $emailIsCorrect = false;
      } elseif (User::emailExists($email)) {
          $emailIsCorrect = false;
      }

      if ($emailIsCorrect) {
        
        $success = User::updateUserEmail($email, $_SESSION['user_id']);
        
        if ($success) {
          echo 'Uaktualniono'; 
        } else {
          echo 'Wystąpił problem';
        }
      } else {
        
        echo 'Email jest niepoprawny';
        
      }
    }
  }
  
  public function updatePasswordAction()
  {
    if (isset($_POST['submit'])) {
      
      $newPassword = $_POST['password'];
      $passwordCorrect = true;
      
      if (strlen($newPassword) < 6) {
        $passwordCorrect = false;
      }
      
      if (preg_match('/.*[a-z]+.*/i', $newPassword) == 0) {
        $passwordCorrect = false;
      }
      
      if (preg_match('/.*\d+.*/i', $newPassword) == 0) {
        $passwordCorrect = false;
      }
      
      if ($passwordCorrect) {
        $success = User::updateUserPassword($newPassword, $_SESSION['user_id']);
        
        if ($success) {
          echo 'Uaktualniono'; 
        } else {
          echo 'Wystąpił problem';
        }
      } else {
        
        echo 'Hasło nie spełnia wymagań';
        
      }
    }
  }
  
  public function addPaymentMethodAction()
  {
    if (isset($_POST['submit'])) {
      
      $methodName = $_POST['name'];
      
      if (!empty($methodName)) {
        
        echo CashFlow::addPaymentMethod($_SESSION['user_id'], $methodName);
        
      }
    }
  }
  
  public static function deletePaymentMethodAction()
  {
    if (isset($_POST['paymentID'])) {
      echo CashFlow::deletePaymentMethod($_SESSION['user_id'], $_POST['paymentID']);
    }
  }
  
  public function getAllUserCategoriesAndMethodsAction()
  {
    $data['incomeCategories'] = $this->loadUserIncomeCategories();
    $data['expenseCategories'] = $this->loadUserExpenseCategories();
    $data['paymentMethods'] = $this->loadUserPaymentMethods();
    
    header('Content-Type: application/json');
    echo json_encode($data);
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
  
  private function loadUserDetails()
  {
    return User::findByID($_SESSION['user_id']);
  }
}