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
                            min: 0
                    },
                    dater: {
                            required: true,
                            validDate:true
                    }
            },
            messages: {
                    money: {
                            required: 'Podaj kwotę przychodu',
                            step: 'Dokładność do 0,01',
                            min: 'Przychody są dodatnie'
                    },
                    dater: {
                            required: 'Podaj datę'
                    }
            }
    });
});