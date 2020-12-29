var userExpensesCategories = [];
var selectedCategory;
var userInputAmount = 0;

$(document).ready(function() {
  
  loadExpensesLimits();
  checkCategorySelectedByDefault();
  checkSelectedCategoryByUser();
  getUserInputAmount();
  
});

function loadExpensesLimits() {
  
  $.get('/expenses/get-expenses-limits',
  
    function(data) {

      for (i=0; i < data.length; i++) {
        userExpensesCategories.push(data[i]);
      }
      
  });

}

function checkCategorySelectedByDefault() {
  
  selectedCategory = $('#expenseCategory').val();
  getSpentMoney();

}

function checkSelectedCategoryByUser() {
  
  $('#expenseCategory').change(function() {
    
    selectedCategory = $('#expenseCategory option:selected').val();
    getSpentMoney();

  });
  
}

function getSpentMoney() {

  for (i = 0; i < userExpensesCategories.length; i++) {
    
    if (selectedCategory == userExpensesCategories[i].id) {
      
      if (userExpensesCategories[i].user_limit != null) {
        
        var limit = userExpensesCategories[i].user_limit;
        $('#userLimit').text(limit);
        
        $.post('/expenses/get-sum-of-expenses-in-category', {
          
          categoryID : selectedCategory
          
        }, function(spentAmount) {
          
          if (spentAmount > 0) {
            
            $('#moneySpent').text(spentAmount);
            
          } else {
            
            $('#moneySpent').text('0');
            
          }
          
          let leftAmount =  (limit * 100 - spentAmount * 100)/100;
          $('#leftAmount').text(leftAmount.toFixed(2));
          
          let curentAmountSpent = (spentAmount * 100 + userInputAmount * 100)/100;
          $('#currentlySpent').text(curentAmountSpent.toFixed(2));
          
          if (limit > curentAmountSpent) {
            
            $('#infoDiv').addClass('alert-success');
            
          } else {
            
            $('#infoDiv').addClass('alert-danger');
            
          }
          
          $('#infoDiv').removeClass('item-hidden');
          
        });

      } else {
        
        $('#infoDiv').addClass('item-hidden');
        $('#infoDiv').removeClass('alert-success alert-danger');
        
      }
      
    }
    
  }
  
}

function getUserInputAmount() {
  
  $('#userMoney').change(function() {
    
    userInputAmount = $(this).val();

  });
  
}
