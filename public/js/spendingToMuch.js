var userExpensesCategories = [];
var selectedCategory;

$(document).ready(function() {
  
  loadExpensesLimits();
  checkCategorySelectedByDefault();
  checkSelectedCategoryByUser();
  
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
  showLimitMessage();

}

function checkSelectedCategoryByUser() {
  
  $('#expenseCategory').change(function() {
    
    selectedCategory = $('#expenseCategory option:selected').val();
    showLimitMessage();

  });
  
}

function showLimitMessage() {

  for (i = 0; i < userExpensesCategories.length; i++) {
    
    if (selectedCategory == userExpensesCategories[i].id) {
      
      if (userExpensesCategories[i].user_limit != null) {
        
        console.log("jest limit " + userExpensesCategories[i].user_limit);
        
      }
      
    }
    
  }
  
}
