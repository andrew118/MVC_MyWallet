var categoriesAndLimits = [];
var selectedCategory;
var userInputAmount = 0;
var currentDate = new Date();

$(document).ready(function() {
  
  loadCategoriesAndLimits();
  checkCategorySelectedByDefault();
  checkSelectedCategoryByUser();
  checkUserDate();
  getUserInputAmount();

});

function loadCategoriesAndLimits() {
  
  $.get('/expenses/get-limits-and-sum-for-expenses-by-category',
  
    function(data) {

      for (i=0; i < data.length; i++) {
        categoriesAndLimits.push(data[i]);
      }
      
  });

}

function checkCategorySelectedByDefault() {
  
  selectedCategory = $('#expenseCategory').val();
  showLimitmessage();

}

function checkSelectedCategoryByUser() {
  
  $('#expenseCategory').change(function() {
    
    selectedCategory = $('#expenseCategory option:selected').val();
    userInputAmount = $('#userMoney').val();
    showLimitmessage();

  });
  
}

function getUserInputAmount() {
  
  $('#userMoney').on('keyup change', function() {
    
    userInputAmount = $(this).val();
    showLimitmessage();

  });
  
}

function checkUserDate() {
  
  $('#date').on('change', function() {
    
    let currentMonth = currentDate.getMonth();
    let userDate = new Date($('#userDate').val());
    
    if (currentMonth == userDate.getMonth()) {
      
      showLimitmessage();
      
    } else {
      
      $('#infoDiv').addClass('item-hidden');
      $('#infoDiv').removeClass('alert-success alert-danger');
      
    }
    
  });
  
}

function showLimitmessage() {

  for (i = 0; i < categoriesAndLimits.length; i++) {
    
    if (selectedCategory == categoriesAndLimits[i].id) {

        let limit = categoriesAndLimits[i].user_limit;
        let spentAmount = categoriesAndLimits[i].spent_money;
        
        if (spentAmount == null) {
          spentAmount = 0;
        }
        
        let leftAmount =  (limit * 100 - spentAmount * 100)/100;
        let curentAmountSpent = (spentAmount * 100 + userInputAmount * 100)/100;
        
        $('#userLimit').text(limit);
        $('#moneySpent').text(spentAmount);
        $('#leftAmount').text(leftAmount.toFixed(2));
        $('#currentlySpent').text(curentAmountSpent.toFixed(2));

        if (limit > curentAmountSpent) {
          
          $('#infoDiv').removeClass('alert-success alert-danger');
          $('#infoDiv').addClass('alert-success');
          
        } else {
          
          $('#infoDiv').removeClass('alert-success alert-danger');
          $('#infoDiv').addClass('alert-danger');
          
        }
          
          $('#infoDiv').removeClass('item-hidden');
          break;

    } else {
      
      $('#infoDiv').addClass('item-hidden');
      $('#infoDiv').removeClass('alert-success alert-danger');
      
    }
  
  }
      
}
  
