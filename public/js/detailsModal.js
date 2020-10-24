$(document).ready(function() {
  var incomeClicked = false;

$('#incomeTable tbody tr').click(function() {
	
  var id = $(this).attr('id');
  
  if (!incomeClicked) {
    incomeClicked = true;
    
    var beginDate = $('#beginDate').text();
    var endDate = $('#endDate').text();
    
    $.ajax({
      type: 'POST',
      url: '/balance/show-all-incomes',
      dataType: 'json',
      data: {
        'category_id': id,
        'begin_date': beginDate,
        'end_date': endDate
      },

      success: function(response) {

        $('#modalLongTitle').text(response[0].inc_name);
        
        var incomes = new Array();
        
        if (Array.isArray(incomes) && incomes.length) {
          incomes.length = 0;
        }
        
        for (i = 0; i < response.length; i++) {
          
          var line = '<tr class="detailed"><td>'+ response[i].date + '</td><td>' + response[i].amount + '</td><td>' + response[i].comment + '</td></tr>';
          
          incomes.push(line);
          line = '';
        }

        $('#incomeTable tbody').find('#' + id).after(incomes);
      },
      error : function(xhr, desc, err) {
         console.log(err);
      }
    });
  }
  if (incomeClicked) {
    
    $('#incomeTable tbody #' + id).find('.detailed').remove();
    incomeClicked = false;
  }
});

$( "#expenseTable tbody tr" ).on( "click", function() {
  console.log($(this).attr('id'));
});
});

function hideModal() {
  $('#detailsModal').modal('hide');
  $('#detailsModal').modal('toggle');
  $('#modalData').empty();
}