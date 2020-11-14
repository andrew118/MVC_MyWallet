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
  
  $('#modalData').append('<div class="text-warning text-right h6">Pole nie moze być puste</div>');
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
}