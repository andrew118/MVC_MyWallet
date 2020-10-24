$(document).ready(function() {

  var expenseInfo = {categories: [], amount: []};
  var colors = {border: [], fill: []};
  
  $('.expense-category').each(function(){
    expenseInfo.categories.push($(this).find('td').html());
    expenseInfo.amount.push($(this).find('td').eq(1).html());
    colors.fill.push(generateColor());
    colors.border.push(generateColor().replace('0.6', '1'));
  });

  var ctx = document.getElementById('pieChart').getContext('2d');
  var chart = new Chart(ctx, {
      type: 'pie',
      data: {
          labels: expenseInfo.categories,
          datasets: [{
              data: expenseInfo.amount,
              backgroundColor: colors.fill,
              borderColor: colors.border,
              borderWidth: 2,
              borderAlign: 'inner'
          }]
      },
      options: {
          legend: {
              labels: {
                  fontColor: '#f2f2f2',
                  fontSize: 16,
                  fontFamily: 'Dosis'
              },

          },
          title: {
              display: true,
              fontSize: 20,
              fontFamily: 'Dosis',
              fontColor: '#f2f2f2',
              text: 'Wydatki według kategorii'
          },
          padding: {
            left: 50,
            right: 50,
            top: 20,
            bottom: 20
          }
      }
  });
});

function generateColor() {
  var r = Math.floor(Math.random() * 256);
  var g = Math.floor(Math.random() * 256);
  var b = Math.floor(Math.random() * 256);
  
  var color = 'rgba(' + r + ', ' + g + ', ' + b + ', 0.6)';
  
  return color;
}