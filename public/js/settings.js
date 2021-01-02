var userIncomeCategories;
var userExpenseCategories;
var userPaymentMethods;
var emailExists;
var propertyName;
var propertyID;

$(document).ready(function() {

  showHideDetails();
  editAccountData();
  preventModalSubmitWithEnterKey();
  prepareModalContent();
  cancelModal();
  applyChanges();
  checkEmail();
  loadUserCategoriesAndMethods();
  addNewPaymentMethod();
  deletePaymentMethodModal();
  addNewIncomeCategoryModal();
  deleteIncomeCategoryModal();
  editExpenseCategoryModal();
  addNewExpenseCategoryModal();
  enableExpanseLimit();
  deleteExpenseCategoryModal();

});

function preventModalSubmitWithEnterKey() {
  
  $(window).keydown(function(keyEvent) {
    
    if (keyEvent.keyCode == 13) {
      
      keyEvent.preventDefault();
      return false;
      
    }
    
  });
  
}

function loadUserCategoriesAndMethods() {
  
  $.get('/settings/get-all-user-categories-and-methods',
  
    function(data) {
    
    userIncomeCategories = data.incomeCategories;
    userExpenseCategories = data.expenseCategories;
    userPaymentMethods = data.paymentMethods;
    
  });
  
}

function showHideDetails() {
  
  $('.icon-dot').click(function() {
	
    var classKey = '.' + this.id + '-row';
    
    if ($(classKey).hasClass('seen')) {
      
      $(classKey).toggleClass('item-hidden');
      $(classKey).removeClass('seen');
      
    } else {
      
      $('.seen').toggleClass('item-hidden');
      $('.seen').removeClass('seen');
      $(classKey).toggleClass('item-hidden seen');
    }
  });
}

function updateIncomesCategory(newIncomeCategoryID) {
  
  deleteIncomeCategory();
  
  $.post('/settings/update-incomes-category', {
    
    newCategoryID : newIncomeCategoryID,
    categoryToReplaceID : propertyID
    
  }, function(response) {
    
      hideModal();
      reloadPage();
    
  });
  
}

function deleteIncomeCategory() {
  
  $.post('settings/delete-income-category', {
    
    categoryID : propertyID
    
  }, function(response) {
    
      hideModal();
      reloadPage();
    
  });
  
}

function deleteIncomeCategoryModal() {
  
  $('.income').click(function() {
    
    let incomeID = $(this).closest('tr').attr('id');
    let incomeIdSeparated = incomeID.split('-');
    propertyName = incomeIdSeparated[0];
    propertyID = incomeIdSeparated[1];
    let propertyValue = $(this).closest('td').siblings().text();
    
    
    $.post('/settings/find-incomes-assigned-to-category', {
  
      categoryID : propertyID
      
    }, function(response) {
      
        if (response) {

          propertyName = propertyName + '_warning';
          prepareModalContent(propertyName, propertyValue);
          $('#updateModal').modal('toggle');
          
        } else {
          
          prepareModalContent(propertyName, propertyValue);
          $('#updateModal').modal('toggle');
          
        }
      
    });
    
  });
  
}

function checkIncomeExists(userInput) {
  
  let inputLowerCase = userInput.toLowerCase();
  let inputWithoutSpaces = inputLowerCase.replace(/\s/g, '');
  let paymentExists = false;
  let similarIncomeName = '';

  for (const income of userIncomeCategories) {
    
    let categoryLowerCase = income.name.toLowerCase();
    let categoryWithoutSpaces = categoryLowerCase.replace(/\s/g, '');
    
    if ((categoryLowerCase == inputLowerCase) || (categoryWithoutSpaces == inputWithoutSpaces)) {
      
      similarIncomeName = income.name;
      paymentExists = true;
      break;
      
    }
  }

  if(paymentExists) {
    
    $('#divWarning').text('Masz już kategorię przychodów o nazwie "' + similarIncomeName + '"');
    return paymentExists;
      
  } else {
    
    $('#divWarning').text('');
    return paymentExists;
    
  }
  
}

function validateIncomeCategory(userInput) {
  
  if (userInput == '') {
    
    showWarining();
    return false;
    
  } else if (checkIncomeExists(userInput)) {
      
      return false;
      
  } else {
    
    return true;
    
  }
  
}

function saveIncomeCategory() {
  
  let userInputIncomeCategory = $('#user_income_category').val();
  
  if (validateIncomeCategory(userInputIncomeCategory)) {
    
    $.post('/settings/add-income-category', {
      
        inputCategoryName: userInputIncomeCategory
        
    }, function(response) {
      
      hideModal();
      reloadPage();
      
    });
    
  }
  
}

function addNewIncomeCategoryModal() {
  
  $('#newIncomeCategory').on('click', function() {
    
    propertyName = this.id;
    
    prepareModalContent(propertyName);
    $('#updateModal').modal('toggle');
    
  });
  
}

function enableExpanseLimit() {
  
  $('#modalData').on('change', 'input[name="limit_box"]', function() {
    let box = $(this);
   
    if (box.is(':checked')) {
      
      $('#user_limit').prop("disabled", false);
      
    } else {
      
      $('#user_limit').prop("disabled", true);
      
    }
  });
  
}

function checkExpenseExists(userExpenseName) {
  
  let nameLowerCase = userExpenseName.toLowerCase();
  let nameWithoutSpaces = nameLowerCase.replace(/\s/g, '');
  let expenseExists = false;
  let similarExpenseName = '';
  
  for (const expense of userExpenseCategories) {
    
    let categoryNameLowerCase = expense.name.toLowerCase();
    let categoryNameWithoutSpaces = categoryNameLowerCase.replace(/\s/g, '');
    
    if ((categoryNameLowerCase == nameLowerCase) || (categoryNameWithoutSpaces == nameWithoutSpaces)) {
      
      similarExpenseName = expense.name;
      expenseExists = true;
      break;
      
    }
  }
  
  if(expenseExists) {
    
    $('#divWarning').text('Masz już kategorię wydatków o nazwie "' + similarExpenseName + '"');
    return expenseExists;
      
  } else {
    
    $('#divWarning').text('');
    return expenseExists;
    
  }
  
}

function validateExpenseCategory(userInput) {
  
  if (userInput == '') {
    
    showWarining();
    return false;
    
  } else if (checkExpenseExists(userInput)) {
      
      return false;
      
  } else {
    
    return true;
    
  }
  
}

function validateTransactionsLimit(limit) {
  
  if (limit <= 0) {
      
      $('#divWarning').text('Ustaw limit wydatków');
      return false;
      
  }  else {
    
    return true;
    
  }
}

function saveExpenseCategory() {
  
  let userInputExpenseCategoryName = $('#user_expense_category').val();
  let transactionsLimitChecked = $('input[name="limit_box"]').is(':checked');
  let userExpenseCategoryLimit = 0; 
  let expenseIsValid = true;
  
  expenseIsValid = validateExpenseCategory(userInputExpenseCategoryName);
    
  if (transactionsLimitChecked) {
    
    userExpenseCategoryLimit = $('#user_limit').val();
    expenseIsValid = validateTransactionsLimit(userExpenseCategoryLimit);
  
  }
  
  if (expenseIsValid) {
    
    $.post('/settings/add-expense-category', {
      
        inputCategoryName: userInputExpenseCategoryName,
        inputCategoryLimit: userExpenseCategoryLimit
        
    }, function(response) {
      
      hideModal();
      reloadPage();
      
    });
  }
}

function addNewExpenseCategoryModal() {
  
  $('#newExpenseCategory').click(function() {
    
    propertyName = this.id;
    
    prepareModalContent(propertyName);
    $('#updateModal').modal('toggle');
    
  });
  
}

function updateExpenseCategory() {
  
  let transactionsLimitChecked = $('input[name="limit_box"]').is(':checked');
  let userExpenseCategoryLimit = $('#user_limit').val();
  let expenseIsValid = true;

  if (transactionsLimitChecked) {
    
    userExpenseCategoryLimit = $('#user_limit').val();
    expenseIsValid = validateTransactionsLimit(userExpenseCategoryLimit);

  } else {
    
    userExpenseCategoryLimit = 0;
    
  }
  
  if (expenseIsValid) {
    
    $.post('/settings/update-expense-category-limit', {
      
        inputCategoryLimit: userExpenseCategoryLimit,
        categoryID: propertyID
        
    }, function(response) {
      
      hideModal();
      reloadPage();
      
    });
  } else {
    
    $('#divWarning').text('Nie wprowadziłeś żadnych zmian');
    
  }
}

function editExpenseCategoryModal() {
  
  $('.expense-edit').click(function() {
    
    let expenseID = $(this).closest('tr').attr('id');
    let expenseIdSeparated = expenseID.split('-');
    propertyName = expenseIdSeparated[0];
    propertyID = expenseIdSeparated[1]; 
    let propertyValue = $(this).closest('td').siblings().text();
    
    $.post('/settings/find-expenses-associated-to-expense-category', {
  
      categoryID : propertyID
      
    }, function(response) {
      
        if (response) {

          propertyName = propertyName + '_warning';
          prepareModalContent(propertyName, propertyValue);
          $('#updateModal').modal('toggle');
          
        } else {
          
          prepareModalContent(propertyName, propertyValue);
          $('#updateModal').modal('toggle');
          
        }
      
    });
    
  });
  
}

function deleteExpenseCategory() {

    $.post('/settings/delete-expense-category', {
    
    expenseCategoryID: propertyID
    
  }, function(response) {
    
      hideModal();
      reloadPage();
      
  });
  
}

function updateExpensesCategory(selectedNewExpenseCategoryID) {
  
  deleteExpenseCategory();
  
  $.post('/settings/change-category-for-expenses', {
    
    newCategoryID : selectedNewExpenseCategoryID,
    categoryToReplaceID : propertyID
    
  }, function(response) {

      hideModal();
      reloadPage();
    
  });
  
}

function deleteExpenseCategoryModal() {
  
  $('.icon-trash.expense').click(function() {
    
    let expenseID = $(this).closest('tr').attr('id');
    let expenseIdSeparated = expenseID.split('-');
    propertyName = expenseIdSeparated[0] + '_delete';
    propertyID = expenseIdSeparated[1]; 
    let propertyValue = $(this).closest('td').siblings().text();

    $.post('/settings/find-expenses-associated-to-expense-category', {
      
      expenseCategoryID : propertyID
      
    }, function(response) {
        
        if (response) {

          propertyName = propertyName + '_warning';
          prepareModalContent(propertyName, propertyValue);
          $('#updateModal').modal('toggle');

        } else {

          prepareModalContent(propertyName, propertyValue);
          $('#updateModal').modal('toggle');
          
        }
        
    });
    
  });
  
}

function editAccountData() {
  
  $('.account').click(function () {
    
    propertyName = $(this).closest('tr').attr('id');
    var propertyValue = $(this).closest('td').siblings().text();

    prepareModalContent(propertyName, propertyValue);
    $('#updateModal').modal('toggle');
    
  });
}

function checkPaymentExists(userInput) {
    
  let inputLowerCase = userInput.toLowerCase();
  let inputWithoutSpaces = inputLowerCase.replace(/\s/g, '');
  let paymentExists = false;
  let similarMethodName = '';

  for (const method of userPaymentMethods) {
    
    let methodLowerCase = method.name.toLowerCase();
    let methodWithoutSpaces = methodLowerCase.replace(/\s/g, '');
    
    if ((methodLowerCase == inputLowerCase) || (methodWithoutSpaces == inputWithoutSpaces)) {
      
      similarMethodName = method.name;
      paymentExists = true;
      break;
      
    }
  }

  if(paymentExists) {
    
    $('#divWarning').text('Masz już metodę płatności o nazwie "' + similarMethodName + '"');
    return paymentExists;
      
  } else {
    
    $('#divWarning').text('');
    return paymentExists;
    
  }
}

function validatePaymentMethod(userInput) {
  
  if (userInput == '') {
    
    showWarining();
    return false;
    
  } else if (checkPaymentExists(userInput)) {
      
      return false;
      
  } else {
    
    return true;
    
  }
}

function savePaymentMethod() {
  
  let submit = $('#modalSubmit').val();
  let userInputPayment = $('#user_payment').val();
  
  if (validatePaymentMethod(userInputPayment)) {
    
    $.post('/settings/add-payment-method', {
      
        submit: submit,
        name: userInputPayment
        
    }, function(response) {
      
         hideModal();
         reloadPage();
      
    });
    
  }
  
}

function addNewPaymentMethod() {
  
  $('#newPaymentMethod').click(function() {
    
    propertyName = this.id;
    
    prepareModalContent(propertyName);
    $('#updateModal').modal('toggle');
    
  });
  
}

function deletePaymentMethodModal() {
  
  $('.payment').click(function() {
    
    let paymentID = $(this).closest('tr').attr('id');
    let paymentIdSeparated = paymentID.split('-');
    propertyName = paymentIdSeparated[0];
    propertyID = paymentIdSeparated[1];
    let propertyValue = $(this).closest('td').siblings().text();
    
    $.post('/settings/find-expenses-associated-to-payment-method', {
      
      paymentID : propertyID
      
    }, function(response) {
        
        if (response) {

          propertyName = propertyName + '_warning';
          prepareModalContent(propertyName, propertyValue);
          $('#updateModal').modal('toggle');
          
        } else {
          
          prepareModalContent(propertyName, propertyValue);
          $('#updateModal').modal('toggle');
          
        }
        
    });
    
  });
}

function updatePaymentMethod(selectedNewMethod) {
  
  deletePayment();
  
  $.post('/settings/update-payment-method', {
    
    newPaymentID : selectedNewMethod,
    paymentToReplace : propertyID
    
  }, function(response) {
      
      hideModal();
      reload();
      
  });
  
}

function deletePayment() {
  
  $.post('/settings/delete-payment-method', {
    
    paymentID: propertyID
    
  }, function(response) {
    
      hideModal();
      reloadPage();
      
  });
  
}

function applyChanges() {
  
    $('#modalSubmit').click(function() {

      switch (propertyName) {
    
        case 'newIncomeCategory':
          saveIncomeCategory();
          break;
        
        case 'userName':
          updateName();
          break;
        
        case 'userEmail':
          updateEmail();
          break;
          
        case 'userPassword':
          updatePassword();
          break;
          
        case 'newPaymentMethod':
          savePaymentMethod();
          break;
        
        case 'payment':
          deletePayment();
          break;
        
        case 'payment_warning':
          let selectedNewMethodID = $('#change_category option:selected').val();
          updatePaymentMethod(selectedNewMethodID);
          break;
        
        case 'income':
          deleteIncomeCategory();
          break;
        
        case 'income_warning':
          let selectedNewIncomeCategoryID = $('#change_category option:selected').val();
          updateIncomesCategory(selectedNewIncomeCategoryID);
          break;
        
        case 'newExpenseCategory':
          saveExpenseCategory();
          break;
        
        case 'expense':
          updateExpenseCategory();
          break;
        
        case 'expense_delete':
          deleteExpenseCategory();
          break;
        
        case 'expense_delete_warning':
          let selectedNewExpenseCategoryID = $('#change_category option:selected').val();
          updateExpensesCategory(selectedNewExpenseCategoryID);
          break;
      }
      
    });
}

function updateName() {
  
  let newName = $('#user_name').val();
  
  if (newName !== '') {
    
    $.post('/settings/update-name', {
        name: newName
    }, function(response) {
      
      hideModal();
      reloadPage();
      
    });
    
  } else {
    
    showWarining();
  }
}

function checkEmail() {
  
  $('#modalData').on('keyup', '#user_email', function() {
    
    var newEmail = $(this).val();
    
    $.post('/settings/check-email-existance', {
      
        email: newEmail
        
    }, function(exists) {

      if (exists) {
        
        $('#divWarning').text('Email jest zajęty');
        
      } else {
        
        $('#divWarning').text('');
        
      }
    });
    
  });
}

function validateEmail(typedEmail) {
  
  let regexEmail = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  
  if (typedEmail == '') {
    
    showWarining();
    return false;
    
  } else if (!regexEmail.test(typedEmail)) {
    
    $('#divWarning').text('Podaj poprawny email');
    return false;
    
  } else {
   
    return true;
    
  }
}

function updateEmail() {
  
  let newEmail = $('#user_email').val();
  let submit = $('#modalSubmit').val();
  
  if (validateEmail(newEmail)) {
    
    $.post('/settings/update-email', {
    
          email: newEmail,
          
      }, function(response) {
          
          hideModal();
          reloadPage();
          
      });
  }
}

function validatePassword(typedPassword) {
    
  if (typedPassword == '') {
    
    showWarining();
    return false;
    
  } else if (typedPassword.match(/.*[a-z]+.*/i) == null) {
    
    $('#divWarning').text('Hasło musi zawierać conajmniej 1 literę');
    return false;
    
  } else if (typedPassword.match(/.*\d+.*/) == null) {
    
    $('#divWarning').text('Hasło musi zawierać conajmniej 1 cyfrę');
    return false;
    
  } else if (typedPassword.length < 6) {
    
    $('#divWarning').text('Hasło musi mieć conajmniej 6 znaków');
    return false;
    
  } else {
    
    return true;
    
  }
}

function updatePassword() {
  
  let newPassword = $('#user_password').val();
  let submit = $('#modalSubmit').val();
  
  if (validatePassword(newPassword)) {
    
    $('#divWarning').load('/settings/update-password', {
    
          password: newPassword,
          submit: submit
          
      }, function(response) {
        
          hideModal();
          reloadPage();
            
        }
    );
  }
}

function showWarining() {
  
  $('#divWarning').text('Pole nie moze być puste');
}

function prepareSelectPart(selector) {
  
  let optionsData = '<div><label for="change_category" class="mr-sm-2 h6">Wybierz inną, żeby je przypisać</label><select class="custom-select mr-sm-2" id="change_category" name="updatedCategory">';
  
  if (selector == 'income_warning') {
    
    for (const incomeCategory of userIncomeCategories) {
      
      if (incomeCategory.id != propertyID) {
        
        optionsData += '<option value="' + incomeCategory.id + '">' + incomeCategory.name + '</option>';
      
      }
    }
    
    optionsData += '</select></div>'
    
    return optionsData;
    
  }
  
  if (selector == 'payment_warning') {
    
    for (const paymentMethod of userPaymentMethods) {
      
      if (paymentMethod.id != propertyID) {
        
        optionsData += '<option value="' + paymentMethod.id + '">' + paymentMethod.name + '</option>';
      
      }
    }
    
    optionsData += '</select></div>'
    
    return optionsData;
    
  }
  
  if (selector == 'expense_delete_warning') {
    
    for (const expenseCategory of userExpenseCategories) {
      
      if (expenseCategory.id != propertyID) {
        
        optionsData += '<option value="' + expenseCategory.id + '">' + expenseCategory.name + '</option>';
      
      }
    }
    
    optionsData += '</select></div>'
    
    return optionsData;
    
  }
  
}

function checkExistingLimit(expenseName) {
  
  for (const expenseCategory of userExpenseCategories) {
    
    if (expenseCategory.name == expenseName) {
      
      let limitDetails = [expenseCategory.limit_enabled, expenseCategory.user_limit];
      
      return limitDetails;
      
    }
    
  }
}

function prepareModalContent(selector, description=0) {

  let expenseSetLimitHtml = '<div><input type="checkbox" id="limit_box" name="limit_box"><label for="limit_box" class="h6">Ustaw miesięczny limit transakcji dla kategorii</label></div><div><input type="number" class="mb-3 rounded form-control" id="user_limit" name="user_limit" min="0" step="0.01" disabled></div>';
  
  switch(selector) {
    
    case 'userName':
      let fieldsHtmlName = '<h6 class="h6">Podaj nową nazwę użytkownika</h6><input type="text" class="mb-3 rounded form-control" name="name" id="user_name" value="' + description + '" required >';
      $('#modalTitle').text('Edycja nazwy użytkownika');
      $('#modalData').append(fieldsHtmlName);
      break;
    
    case 'userEmail':
      let fieldsHtmlEmail = '<h6 class="h6">Podaj nowy email</h6><input type="email" class="mb-3 rounded form-control" name="email" id="user_email" value="' + description + '" required >';
      $('#modalTitle').text('Edycja adresu e-mail');
      $('#modalData').append(fieldsHtmlEmail);
      break;
    
    case 'userPassword':
      let fieldsHtmlPassword = '<h6 class="h6">Podaj nowe hasło</h6><input type="text" class="mb-3 rounded form-control" name="password" id="user_password" required >';
      $('#modalTitle').text('Edycja adresu e-mail');
      $('#modalData').append(fieldsHtmlPassword);
      break;
    
    case 'newPaymentMethod':
      let fieldsHtmlPayment = '<h6 class="h6">Podaj nazwę nowej metody płatności</h6><input type="text" class="mb-3 rounded form-control" name="payment" id="user_payment" required >';
      $('#modalTitle').text('Dodaj nową metodę płatności');
      $('#modalData').append(fieldsHtmlPayment);
      break;
    
    case 'payment':
      let fieldsHtmlPaymentDeleteConfirm = '<h6 class="h6">Czy na pewno chesz usunąć "' + description + '"?</h6>';
      $('#modalTitle').text('Usuwanie metody płatności');
      $('#modalData').append(fieldsHtmlPaymentDeleteConfirm);
      break;
    
    case 'payment_warning':
      letfieldsHtmlPaymentMethodWarning = '<div><h6 class="h6 font-bold text-warning">Do metody, którą chcesz usunąć są przypisane wydatki!</h6></div>';
      let selectPaymentMethod = prepareSelectPart(selector);
      $('#modalTitle').text('Nie można usunąć tej metody płatności');
      $('#modalData').append(letfieldsHtmlPaymentMethodWarning, selectPaymentMethod);
      break;
    
    case 'newIncomeCategory':
      let fieldsHtmlIncomeCategory = '<h6 class="h6">Podaj nazwę nowej kategorii</h6><input type="text" class="mb-3 rounded form-control" name="income_category" id="user_income_category" required >';
      $('#modalTitle').text('Dodawanie nowej kategorii przychodów');
      $('#modalData').append(fieldsHtmlIncomeCategory);
      break;
    
    case 'income':
      let fieldsHtmlIncomeCategoryDeleteConfirm = '<h6 class="h6">Czy na pewno chesz usunąć "' + description + '"?</h6>';
      $('#modalTitle').text('Usuwanie kategorii przychodu');
      $
      ('#modalData').append(fieldsHtmlIncomeCategoryDeleteConfirm);
      break;
    
    case 'income_warning':
      letfieldsHtmlIncomeCategoryWarning = '<div><h6 class="h6 font-bold text-warning">Do kategorii, którą chcesz usunąć są przypisane przychody!</h6></div>';
      let selectIncomeCategory = prepareSelectPart(selector);
      $('#modalTitle').text('Nie można usunąć tej kategorii');
      $('#modalData').append(letfieldsHtmlIncomeCategoryWarning, selectIncomeCategory);
      break;
    
    case 'newExpenseCategory':
      let fieldsHtmlExpenseCategory = '<div><label for="user_expense_category" class="h6">Podaj nazwę nowej kategorii</label><input type="text" class="mb-3 rounded form-control" name="expense_category" id="user_expense_category" required ></div>' + expenseSetLimitHtml;
      $('#modalTitle').text('Dodawanie nowej kategorii wydatków');
      $('#modalData').append(fieldsHtmlExpenseCategory);
      break;
      
    case 'expense':
      let fieldsHtmlEditExpenseCategory = '<div><h6 class="h5">Wybrana kategoria: <span class="font-weight-bold">' + description + '</span></h5></div>' + expenseSetLimitHtml;
      $('#modalTitle').text('Edycja kategorii wydatków');
      $('#modalData').append(fieldsHtmlEditExpenseCategory);
      let limit = checkExistingLimit(description);
      if (limit[0] == true) {
        $('#limit_box').prop('checked', true);
        $('#user_limit').prop('disabled', false);
        $('#user_limit').val(limit[1]);
      }
      break;
      
    case 'expense_delete':
      let fieldsHtmlExpenseDeleteConfirm = '<h6 class="h6">Czy na pewno chesz usunąć "' + description + '"?</h6>';
      $('#modalTitle').text('Usuwanie kategorii wydatków');
      $('#modalData').append(fieldsHtmlExpenseDeleteConfirm);
      break;
    
    case 'expense_delete_warning':
      letfieldsHtmlExpenseCategoryWarning = '<div><h6 class="h6 font-bold text-warning">Do kategorii, którą chcesz usunąć są przypisane przychody!</h6></div>';
      let selectExpenseCategory = prepareSelectPart(selector);
      $('#modalTitle').text('Nie można usunąć tej kategorii');
      $('#modalData').append(letfieldsHtmlExpenseCategoryWarning, selectExpenseCategory);
      break;
  }
  
}

function cancelModal() {
  
  $('#cancelModal').click(hideModal);
  
}

function hideModal() {
  
  $('#updateModal').modal('hide');
  $('#modalTitle').text('');
  $('#modalData').empty();
  $('#divWarning').text('');
}

function reloadPage() {
  
  window.location.reload();
  
}