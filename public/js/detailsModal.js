$(document).ready(function() {

  showHideDetails();
});

function showHideDetails() {
  
  var incomeDetails = $('.income-detailed-row');
  
  $('.icon-dot').click(function() {
	
  console.log(this.id);
  var classKey = '.cat-id-' + this.id;
  
  incomeDetails.filter(classKey).toggleClass('item-hidden');

});
}


