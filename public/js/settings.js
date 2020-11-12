$(document).ready(function() {

  showHideDetails();
  editAccountData();
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
    
    $('#updateModal').modal('toggle');
    console.log($(this).closest('tr').attr('id'));
    
  });
}

function hideModal() {
  $('#cancelModal').click(function() {
    
    $('#updateModal').modal('hide');

  });
}