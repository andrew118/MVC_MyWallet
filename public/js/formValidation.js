$(document).ready(function() {

    $('#incomeForm').validate({
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