$(document).ready(function() {

  showHideDetails();

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