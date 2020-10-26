var incomeCategories;

$(document).ready(function() {
  
  getIncomeCategories();
  showHideDetails();
  showEditModal();
  hideModal();
  findCategoryIDInClassName();
});

function getIncomeCategories() {
  
  $.ajax({
    url: '/balance/get-user-income-categories',
    method: 'post',
    dataType: 'json',
    
    success: function(categories) {
      incomeCategories = categories;
    },
    error: function() {
      console.log("Błąd połączenia");
    }
  });
}

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
    
    var selectedRowID = this.id;
    
    var nameOfClass = $(this).attr('class');
    var idOfCategory = findCategoryIDInClassName(nameOfClass);
    
    var selectedRowElements = $(this).children('td:first-child').children();
    
    var date = selectedRowElements.eq(0).text();
    var amount = selectedRowElements.eq(1).text();
    var comment = selectedRowElements.eq(2).text();
    
    for (const category of incomeCategories) {
      
      if (idOfCategory == category.id) {
        
        var option = '<option value="' + category.id + '" selected>' + category.name + '</option>';
      } else {
        
        var option = '<option value="' + category.id + '">' + category.name + '</option>';
      }
      
      $('#selectBox').append(option);
      
    }
    
    $('#userMoney').val(amount);
    $('#userDate').val(date);
    $('#userComment').val(comment);

    $('#detailsModal').modal('toggle');
  });
}

function hideModal() {
  $('#cancel_modal').click(function() {
    
    $('#detailsModal').modal('hide');
    $('#selectBox').empty();
    
  });
}

function findCategoryIDInClassName(nameOfClass) {
  
  if(nameOfClass != null) {
    var id = nameOfClass.match(/inc-(\d+)/i);
    return id[1];
  }
}