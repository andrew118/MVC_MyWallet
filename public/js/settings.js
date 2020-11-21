const infoSuccess = 'Zapisano pomyślnie';
const infoError = 'Wystąpił błąd';
var propertyID;

$(document).ready(function() {

  showHideDetails();
  editAccountData();
  prepareModalContent();
  cancelModal();
  applyChanges();

});

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

function applyChanges() {
  
    $('#modalSubmit').click(function() {

      switch (propertyID) {
    
        case 'userName':
          updateName();
          break;
        
        case 'userEmail':
          updateEmail();
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

function updateEmail() {
  
  let newEmail = $('#user_email').val();
  let submit = $('#modalSubmit').val();
  
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
          }
      }
      );
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

function showErrorMessage() {
  
  $('#requestInfo').text(infoError);
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

function prepareModalContent(selector, text) {
  
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