const infoSuccess = 'Zapisano pomyślnie';
const infoError = 'Wystąpił błąd';
var userIncomeCategories;
var userExpenseCategories;
var userPaymentMethods;
var emailExists;
var propertyName;
var propertyID;

$(document).ready(function() {

  showHideDetails();
  editAccountData();
  prepareModalContent();
  cancelModal();
  applyChanges();
  checkEmail();
  loadUserCategoriesAndMethods();
  addNewPaymentMethod();
  deletePaymentMethodModal();
  addNewIncomeCategory();
  deleteIncomeCategoryModal();

});

function loadUserCategoriesAndMethods() {
  
  $.get('/settings/get-all-user-categories-and-methods', function(data) {
    
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
    
    $('#divWarning').text('Masz już kategorię płatności o nazwie "' + similarIncomeName + '"');
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
      
        if (response) {
          hideModal();
          showSuccessMessage();
          setTimeout(function() {
            window.location.reload();
          }, 1500 );
        } else {
          showErrorMessage();
        }
      
    });
    
  }
  
}

function addNewIncomeCategory() {
  
  $('#newIncomeCategory').click(function() {
    
    propertyName = this.id;
    
    prepareModalContent(propertyName);
    $('#updateModal').modal('toggle');
    
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
      
        if (response) {
          hideModal();
          showSuccessMessage();
          setTimeout(function() {
            window.location.reload();
          }, 1500 );
        } else {
          showErrorMessage();
        }
      
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

    prepareModalContent(propertyName, propertyValue);
    $('#updateModal').modal('toggle');
    
  });
}

function deletePayment() {
  
  $.post('/settings/delete-payment-method', {
    
    paymentID: propertyID
    
  }, function(response) {
    
      if (response) {
        $('#payment-' + propertyID).remove();
        hideModal();
        showSuccessMessage();
        loadUserCategoriesAndMethods();
      } else {
        showErrorMessage();
      }
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
        
        case 'income_warning':
          console.log($('#change_category option:selected').val());
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
      
      if (response) {
        $('#userName td').first().text(newName);
        hideModal();
        showSuccessMessage();
      } else {
        showErrorMessage();
      }
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
    
    $('#divWarning').load('/settings/update-email', {
    
          email: newEmail,
          submit: submit
          
      }, function(responseText) {
        
        if (responseText === 'Uaktualniono') {
          
          $('#divWarning').addClass('item-hidden');
          $('#userEmail td').first().text(newEmail);
          hideModal();
          showSuccessMessage();
          alert('Teraz logujesz się nowym emailem! \n\n' + newEmail);
          
        } else {
          
          $('#divWarning').addClass('item-hidden');
          hideModal();
          showErrorMessage(responseText);
          
        }
      }
    );
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
          
      }, function(responseText) {
        
          if (responseText === 'Uaktualniono') {
            
            $('#divWarning').addClass('item-hidden');
            hideModal();
            showSuccessMessage();
            
          } else {
            
            $('#divWarning').addClass('item-hidden');
            hideModal();
            showErrorMessage(responseText);
            
          }
      }
    );
  }
}

function showSuccessMessage() {
  
  $('#requestInfo').text(infoSuccess);
  $('#requestInfo').addClass('alert-success');
  $('#requestInfo').toggleClass('d-none');
  
  setTimeout(function() {
    $('#requestInfo').removeClass('alert-success');
    $('#requestInfo').toggleClass('d-none');
    },
    1500
  );
}

function showErrorMessage(errorMsg = 0) {
  
  if (errorMsg != 0) {
    $('#requestInfo').text(errorMsg);
  } else {
    $('#requestInfo').text(infoError);
  }
  
  $('#requestInfo').addClass('alert-danger');
  $('#requestInfo').toggleClass('d-none');
  
  setTimeout(function() {
    $('#requestInfo').removeClass('alert-danger');
    $('#requestInfo').toggleClass('d-none');
    },
    1500
  );
}

function showWarining() {
  
  $('#divWarning').text('Pole nie moze być puste');
}

function prepareSelectPart(selector) {
  
  let optionsData = '<div><label for="change_category" class="mr-sm-2 h6">Wybierz inną kategorię</label><select class="custom-select mr-sm-2" id="change_category" name="updatedCategory">';
  
  if (selector == 'income_warning') {
    
    for (const incomeCategory of userIncomeCategories) {
      
      optionsData += '<option value="' + incomeCategory.id + '">' + incomeCategory.name + '</option>';
      
    }
    
    optionsData += '</select></div>'
    
    return optionsData;
  }
  
}

function prepareModalContent(selector, description=0) {
  
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