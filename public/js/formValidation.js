$(document).ready(function() {
  
  $('#incomeForm').validate({
          errorPlacement: function(error, element) {
            if (element.attr('name') == 'money') {
              error.insertAfter("#cash");
            }
            if (element.attr('name') == 'dater') {
              error.insertAfter('#date')
            }
            $('.error').css('padding-left', '1.5rem');
          },
          rules: {
                  money: {
                          required: true,
                          step: 0.01,
                          min: 0.01
                  },
                  dater: {
                          required: true,
                          validDate: true,
                          dateISO: true
                  }
          },
          messages: {
                  money: {
                          required: 'Podaj kwotę przychodu',
                          step: 'Dokładność do 0,01',
                          min: 'Przychody większe od zera'
                  },
                  dater: {
                          required: 'Podaj datę',
                          dateISO: 'Podaj poprawną datę w formacie rrrr-mm-dd'
                  }
          }
  });
});