$(document).ready(function() {

  showHideDetails();
  showEditModal();
  hideModal();
});

function showHideDetails() {
  
  var incomeDetails = $('.income-detailed-row');
  var expenseDetails = $('.expense-detailed-row');
  
  $('.icon-dot').click(function() {
	
  var classKey = '.' + this.id;
  
  incomeDetails.filter(classKey).toggleClass('item-hidden');
  expenseDetails.filter(classKey).toggleClass('item-hidden');

});
}

function showEditModal() {
  
  $('.income-detailed-row').click(function() {
    
    var elementID = this.id;
    
    var elements = $(this).children('td:first-child').children();
    var date = elements.eq(0).text();
    var amount = elements.eq(1).text();
    var comment = elements.eq(2).text();
    
    $('#userMoney').val(amount);
    $('#userDate').val(date);
    $('#userComment').val(comment);

    $('#detailsModal').modal('show');
  });
}

function hideModal() {
  $('#cancel_modal').click(function() {
    $('#detailsModal').modal('hide');
  });
}

