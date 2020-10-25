$(document).ready(function() {

  showHideDetails();
  edit
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


