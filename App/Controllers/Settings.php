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
      
      if ($success) {
        
        Flash::addMessage('Twoje imię zostało zmienione');
        
      } else {
        
        Flash::addMessage('Błąd! Nie udało się zimenić imienia', Flash::DANGER);
        
      }
      
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
    if (isset($_POST['email'])) {
      
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
          
          Flash::addMessage('Email został uaktualniony');
          Flash::addMessage("Od teraz logujesz się nowym emailem $email", Flash::INFO);
          
        } else {
          
          Flash::addMessage('Błąd. Email nie został uaktualniony', Flash::DANGER);
          
        }
      } else {
        
        Flash::addMessage('Podany email jest niepoprawny', Flash::DANGER);
        
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
          
          Flash::addMessage('Hasło zostało uaktualnione');
          
        } else {
          
          Flash::addMessage('Błąd. Hasło zostało uaktualnione', Flash::DANGER);
          
        }
      } else {
        
        Flash::addMessage('Podane hasło jest niepoprawne', Flash::DANGER);
        
      }
    }
  }
  
  public function getNewlyAddedItemDataAction()
  {
    if (isset($_POST['selector'])) {
      
      $newCategory = CashFlow::getUserLastIncomeCategory($_POST['selector']);
      
      header('Content-Type: application/json');
      echo json_encode($newCategory);
    }
  }
  
  public function addIncomeCategoryAction()
  {
    if (isset($_POST['inputCategoryName'])) {
      
      $categoryName = $_POST['inputCategoryName'];
      
      if (!empty($categoryName)) {
        
        $success = CashFlow::addIncomeCategory($categoryName);
        
       if ($success) {
        
        Flash::addMessage('Kategoria przychodów została dodana');
        
        } else {
        
        Flash::addMessage('Bląd. Kategoria przychodów nie została dodana', Flash::DANGER);
        
        }
      } else {
      
        Flash::addMessage('Nazwa kategorii nie może być pusta', Flash::DANGER);
      }
    }
  }
  
  public function findIncomesAssignedToCategoryAction()
  {
    if (isset($_POST['categoryID'])) {
      
      echo CashFlow::checkIncomesAssignedToCategory($_POST['categoryID']);
      
    }
  }
  
  public function updateIncomesCategoryAction()
  {
    
    if (isset($_POST['newCategoryID']) && isset($_POST['categoryToReplaceID'])) {
      
      $success =  CashFlow::updateIncomesCategory($_POST['newCategoryID'], $_POST['categoryToReplaceID']);
      
      if ($success) {
        
        Flash::addMessage('Uaktualniono');
        
      } else {
        
        Flash::addMessage('Bląd. Nie udało się uaktualnić', Flash::DANGER);
        
      } 
      
    } else {
        
        Flash::addMessage('Bląd. Nie wybrano kategorii', Flash::DANGER);
    }
  }
  
  public function deleteIncomeCategoryAction()
  {
    if (isset($_POST['categoryID'])) {
      
      $success = CashFlow::removeIncomeCategory($_POST['categoryID']);
      
      if ($success) {
        
        Flash::addMessage('Wybrana kategoria przychodu zostala usunięta');
        
      } else {
        
        Flash::addMessage('Bląd. Nie wybrano kategorii', Flash::DANGER);
        
      }
      
    }
  }
  
  public function deleteExpenseCategoryAction()
  {
    
    if (isset($_POST['expenseCategoryID'])) {
      
      $success = CashFlow::removeExpenseCategory($_POST['expenseCategoryID']);
      
      if ($success) {
        
        Flash::addMessage('Wybrana kategoria wydatków zostala usunięta');
        
      } else {
        
        Flash::addMessage('Bląd. Kategoria wydatków nie została usunięta', Flash::DANGER);
        
      }
      
    }  else {
      
      Flash::addMessage('Bląd. Nie wybrano kategorii', Flash::DANGER);
      
    }
    
  }
  
  public function findExpensesAssociatedToExpenseCategoryAction()
  {
    
    if (isset($_POST['expenseCategoryID'])) {
      
      echo CashFlow::checkExpensesAssignedToDeletedCategory($_POST['expenseCategoryID']);
      
    }
    
  }
  
  public function changeCategoryForExpensesAction()
  {
    
    if (isset($_POST['newCategoryID']) && isset($_POST['categoryToReplaceID'])) {
      
      $success = CashFlow::changeCategoryForExpenses($_POST['newCategoryID'], $_POST['categoryToReplaceID']);
      
      if ($success) {
        
        Flash::addMessage('Uaktualniono');
        
      } else {
        
        Flash::addMessage('Bląd. Nie udało się uaktualnić', Flash::DANGER);
        
      } 

    } else {
      
      Flash::addMessage('Bląd. Nie wybrano kategorii', Flash::DANGER);
      
    }
    
  }
  
  public function updateExpenseCategoryLimitAction() {
    
    if (isset($_POST['categoryID'])) {
      
      $success = CashFlow::updateExpenseCategory($_POST['inputCategoryLimit'], $_POST['categoryID']);
      
      if ($success) {
        
        Flash::addMessage('Uaktualniono');
        
      } else {
        
        Flash::addMessage('Bląd. Nie udało się uaktualnić', Flash::DANGER);
        
      } 
      
    } else {
      
      Flash::addMessage('Bląd. Nie podano limitu', Flash::DANGER);
    }
  }
  
  public function addExpenseCategoryAction()
  {
    
    if (isset($_POST['inputCategoryName'])) {
      
      $success = CashFlow::addExpenseCategory($_POST['inputCategoryName'], $_POST['inputCategoryLimit']);
      
      if ($success) {
        
        Flash::addMessage('Kategoria wydatków została dodana');
        
      } else {
        
        Flash::addMessage('Bląd. Kategoria wydatków nie została dodana', Flash::DANGER);
        
      }
      
    } else {
      
      Flash::addMessage('Nazwa kategorii nie może być pusta', Flash::DANGER);
      
    }
    
  }
  
  public function findExpensesAssociatedToPaymentMethodAction()
  {
    
    if (isset($_POST['paymentID'])) {
      
      echo CashFlow::checkPaymentMethodAssignedToExpense($_POST['paymentID']);
      
    }
    
  }
  
  public function addPaymentMethodAction()
  {
    if (isset($_POST['submit'])) {
      
      $methodName = $_POST['name'];
      
      if (!empty($methodName)) {
        
        $success = CashFlow::addPaymentMethod($methodName);
        
        if ($success) {
          
          Flash::addMessage('Metoda płatności dodana');
          
        } else {
          
          Flash::addMessage('Błąd. Metoda płatności nie została dodana', Flash::DANGER);
          
        }
        
      } else {
        
        Flash::addMessage('Błąd. Nazwa metody płatności nie może być pusta', Flash::DANGER);
        
      }
      
    }
    
  }
  
  public function updatePaymentMethodAction()
  {
    
    if (isset($_POST['newPaymentID']) && isset($_POST['paymentToReplace'])) {
      
      $success = CashFlow::updatePaymentMethod($_POST['newPaymentID'], $_POST['paymentToReplace']);
      
      if ($success) {
          
          Flash::addMessage('Uaktulaniono');
          
        } else {
          
          Flash::addMessage('Błąd. Nie można uaktualnić', Flash::DANGER);
          
        }
      
    } else {
      
      Flash::addMessage('Błąd. Nie podano metody płatności', Flash::DANGER);
      
    }
    
  }
  
  public function deletePaymentMethodAction()
  {
    if (isset($_POST['paymentID'])) {
      
      $success = CashFlow::deletePaymentMethod($_POST['paymentID']);
      if ($success) {
          
          Flash::addMessage('Usunięto metodę płatności');
          
      } else {
        
        Flash::addMessage('Błąd. Nie można usunąć', Flash::DANGER);
        
      }
      
    } else {
      
      Flash::addMessage('Błąd. Nie wybrano metody płatności', Flash::DANGER);
      
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
  
  public function getFlashMessagesAction() {
    
    $messages = Flash::getMessages();
    
    header('Content-Type: application/json');
    echo json_encode($messages);
    
  }
  
  private function loadUserIncomeCategories()
  {
    return CashFlow::getCategories('incomes');
  }
  
  private function loadUserExpenseCategories()
  {
    return CashFlow::getCategories('expenses');
  }
  
  private function loadUserPaymentMethods()
  {
    return CashFlow::getPaymentMethods();
  }
  
  private function loadUserDetails()
  {
    return User::findByID($_SESSION['user_id']);
  }
}