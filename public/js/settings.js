const infoSuccess = 'Zapisano pomyślnie';
const infoError = 'Wystąpił błąd';
var userIncomeCategories;
var userExpenseCategories;
var userPaymentMethods;
var emailExists;
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

function editAccountData() {
  
  $('.account').click(function () {
    
    propertyID = $(this).closest('tr').attr('id');
    var propertyValue = $(this).closest('td').siblings().text();

    prepareModalContent(propertyID, propertyValue);
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

function validatePaymentMethod() {
  
  let userInputPayment = $('#user_payment').val();
  
  if (userInputPayment == '') {
    
    showWarining();
    return false;
    
  } else if (checkPaymentExists(userInputPayment)) {
      
      return false;
      
  } else {
    
    return true;
    
  }
}

function savePaymentMethod() {
  
  console.log(validatePaymentMethod());
  
}

function addNewPaymentMethod() {
  
  $('#newPaymentMethod').click(function() {
    
    propertyID = this.id;
    
    prepareModalContent(propertyID);
    $('#updateModal').modal('toggle');
    
  });
  
}

function applyChanges() {
  
    $('#modalSubmit').click(function() {

      switch (propertyID) {
    
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

function prepareModalContent(selector, text=0) {
  
  switch(selector) {
    
    case 'userName':
      let fieldsHtmlName = '<h6 class="h6">Podaj nową nazwę użytkownika</h6><input type="text" class="mb-3 rounded form-control" name="name" id="user_name" value="' + text + '" required >';
      $('#modalTitle').text('Edycja nazwy użytkownika');
      $('#modalData').append(fieldsHtmlName);
      break;
    
    case 'userEmail':
      let fieldsHtmlEmail = '<h6 class="h6">Podaj nowy email</h6><input type="email" class="mb-3 rounded form-control" name="email" id="user_email" value="' + text + '" required >';
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