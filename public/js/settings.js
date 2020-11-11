$(document).ready(function() {

  showHideDetails();

});

function showHideDetails() {
  
  var incomeCategories = $('.income-category-row');
  var expenseCategories = $('.expense-category-row');
  var paymentMethods = $('.expense-category-row');
  var accountData = $('.user-account-row');
  
  $('.icon-dot').click(function() {
	
  var classKey = '.' + this.id + '-row';
  
  $(classKey).toggleClass('item-hidden');
  //incomeCategories.filter(classKey).toggleClass('item-hidden');
  //expenseCategories.filter(classKey).toggleClass('item-hidden');

});
}