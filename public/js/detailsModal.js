var incomeCategories;
var expenseCategories;
var paymentMethotds;

$(document).ready(function() {
  
  getCategories('incomes');
  getCategories('expenses');
  getPaymentMethods();
  showHideDetails();
  showIncomeEditModal();
  showExpenseEditModal();
  hideModal();
  findCategoryIDInClassName();
});

function getCategories(categoryName) {
  
  $.ajax({
    data: {
      selector: categoryName
      },
    url: '/balance/get-user-income-expense-categories',
    method: 'post',
    
    success: function(categories) {
      if (categoryName == 'incomes') {
        incomeCategories = categories;
      } else if (categoryName == 'expenses') {
        expenseCategories = categories;
      }
      
    },
    error: function() {
      console.log("Błąd połączenia");
    }
  });
}

function getPaymentMethods() {
  
  $.ajax({
    url: '/balance/get-user-payment-methods',
    
    success: function(methods) {
      paymentMethotds = methods;
    },
    error: function() {
      console.log("Błąd połączenia");
    }
  });
}

function showHideDetails() {
  
  var incomeDetails = $('.income-detailed-row');
  var expenseDetails = $('.expense-detailed-row');
  
  $('.category').click(function() {
	
  var classKey = '.' + this.id;
  
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

function showIncomeEditModal() {
  
  $('.income-detailed-row').click(function() {
    $('#modalLongTitle').text('Edycja przychodu');
    $('#updateForm').attr('action', '/incomes/update-record');
    
    var selectedRowID = this.id;
    var input = $("<input>").attr("type", "hidden").attr("name", "elementID").val(selectedRowID);
    $('#invisible').append($(input));
    
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

function showExpenseEditModal() {
  
  $('.expense-detailed-row').click(function() {
    $('#modalLongTitle').text('Edycja wydatku');
    $('#updateForm').attr('action', '/expenses/update-record');
    
    var selectedRowID = this.id;
    var input = $("<input>").attr("type", "hidden").attr("name", "elementID").val(selectedRowID);
    $('#invisible').append($(input));
    
    var nameOfClass = $(this).attr('class');

    var idOfCategory = findCategoryIDInClassName(nameOfClass);

    var selectedRowElements = $(this).children('td:first-child').children();
    
    var date = selectedRowElements.eq(0).text();
    var amount = selectedRowElements.eq(1).text();
    var comment = selectedRowElements.eq(2).text();
    var payId = selectedRowElements.eq(3).attr('id');
    var payIdNumber = payId.split(/pay-/);
    payIdNumber.shift();
    
    var selectHTML = '<label class="mr-sm-2" for="payment">Metoda płatności</label><select class="custom-select mr-sm-2" name="payment" id="userPayment"></select>';
    
    $('#paymentPlace').append(selectHTML);
    
    for (const method of paymentMethotds) {
      if (payIdNumber == method.id) {
        var option = '<option value="' + method.id + '" selected>' + method.name + '</option>';
      } else {
        var option = '<option value="' + method.id + '">' + method.name + '</option>';
      }

      $('#userPayment').append(option);
    }
    
    for (const category of expenseCategories) {
      
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
    $('#paymentPlace').empty();
    $('#invisible').empty();
  });
}

function findCategoryIDInClassName(nameOfClass) {
  
  if(nameOfClass != null) {
    var id = nameOfClass.match(/inc-(\d+)|ex-(\d+)/i);

    if (id[1] == null) {
      return id[2];
    } else {
      return id[1];
    }
  }
}