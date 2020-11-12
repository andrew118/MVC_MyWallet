$(document).ready(function() {

  showHideDetails();
  editAccountData();
  prepareModalContent();
  hideModal();

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
    
    var propertyID = $(this).closest('tr').attr('id');
    var propertyValue = $(this).closest('td').siblings().text();
    
    prepareModalContent(propertyID, propertyValue);
    
    $('#updateModal').modal('toggle');
    
  });
}

function prepareModalContent(selector, text) {
  
  switch(selector) {
    
    case 'userName':
      let fieldsHtmlName = '<h6 class="h6">Podaj nową nazwę użytkownika</h6><input type="text" class="mb-3 rounded form-control" name="user_name" id="user_name" value="' + text + '" required >';
      $('#modalTitle').text('Edycja nazwy użytkownika');
      $('#modalData').append(fieldsHtmlName);
      break;
    
    case 'userEmail':
      let fieldsHtmlEmail = '<h6 class="h6">Podaj nowy email</h6><input type="email" class="mb-3 rounded form-control" name="user_email" id="user_email" value="' + text + '" required >';
      $('#modalTitle').text('Edycja adresu e-mail');
      $('#modalData').append(fieldsHtmlEmail);
      break;
    
    case 'userPassword':
      let fieldsHtmlPassword = '<h6 class="h6">Podaj nowe hasło</h6><input type="text" class="mb-3 rounded form-control" name="user_password" id="user_password" required >';
      $('#modalTitle').text('Edycja adresu e-mail');
      $('#modalData').append(fieldsHtmlPassword);
      break;
  }
  
}

function hideModal() {
  $('#cancelModal').click(function() {
    
    $('#updateModal').modal('hide');
    $('#modalTitle').text('');
    $('#modalData').empty();

  });
}