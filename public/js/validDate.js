$.validator.addMethod('validDate',
    function(value, element, param) {
        
        if (value != '') {
            if (value.match(/^\d{4}-\d{2}-\d{2}$/i) == null) { // format YYYY-MM-DD
                return false;
            }
            
            var date = new Date(value);
            var timeMs = date.getTime();
            if (!timeMs && timeMs !== 0) {
              return false;
            }
            return date.toISOString.slice(0, 10) === value;
        }
        // return true;
    },
    'Podaj poprawną datę w formacie rrrr-mm-dd'
);