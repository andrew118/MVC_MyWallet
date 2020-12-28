var userExpensesCategories;
var selectedCategory;

$(document).ready(function() {
  
  loadExpensesLimits();
  checkCategorySelectedByDefault();
  checkLimits();
  
});

function loadExpensesLimits() {
  
  $.get('/expenses/get-expenses-limits',
  
    function(data) {

      userExpensesCategories = data;

  });
  
}

function checkCategorySelectedByDefault() {
  
  selectedCategory = $('#expenseCategory').val();
  console.log('domyślna: ' + selectedCategory);
}

function checkLimits() {
  
  $('#expenseCategory').change(function() {
    
    selectedCategory = $('#expenseCategory option:selected').val();

  });
  
}
